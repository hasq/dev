// Hasq Technology Pty Ltd (C) 2013-2015

#include "gl_utils.h"
#include "gl_err.h"

#include "sg_cout.h"

#include "hq_worker.h"
#include "hq_wkrtask.h"

void Worker::runOnceUnconditionally()
{
//    os::Thread::sleep(1000);

    os::net::Socket * s = grabJob();
    if ( !s ) return;

    string msg = s->getReceivedMessage();

    const char ** mime = &s->accessRequest().accessPmd().mime;
    string reply = workerCore.process(msg, mime);
    s->send_msg(reply);
    delete s;

    if ( gs->config->dbg.wkr )
    {
        const int SZ = 40;

        const string & prx = gs->config->proxyIpport;
        gl::replaceAll(reply, "\r", "");
        gl::replaceAll(reply, "\n", "\\n");

        if( reply.size() > SZ ) reply = reply.substr(0,SZ-3)+"...";

        for( size_t i=0; i<reply.size(); i++ )
        {
            const char & c = reply[i];
            if( c=='\n' || ( c>=' ' && c<='~' ) ){}
            else reply[i]='.';
        }

        os::Cout() << os::prmpt("wkr", gs->config->dbg.id)
                   << "[" << msg
                   << "] -> [" << reply << "]"
                   << (prx.empty() ? "" : " (proxy)") << os::endl;
    }

//    os::Thread::sleep(1000);

}

os::net::Socket * Worker::grabJob()
{
    WkrArea & wa = gs->wkrArea;

    sgl::Mutex mutex_wa(wa.mutex);

    JobQueue & jobs = wa.jobSockets;

    return jobs.extractJob();
}

string WorkerCore::process(const string & message, const char ** mime)
{
    if ( message.empty() || message[0] != '#' )
        return process(message, mime, false);

    string em = decrypt(message.substr(1));

    if ( em.empty() )
        return er::Code(er::REQ_BAD_CRYPT);

    return process(em, mime, true);
}

string WorkerCore::process(const string & message, const char ** mime, bool enc)
{
    const string & prx = gs->config->proxyIpport;

    if ( !prx.empty() )
        return Worker2::proxy(gs, prx, message);

    if ( message.empty() && !gs->config->webhome.empty() )
        return process(gs->config->webhome, mime);

    bool recog;
    const string & reply = Worker2(gs, &message, mime, enc).process(&recog);

    if ( !gs->config->homevalid ) // no valid web dirs
        return reply;

    string msg2 = message;

    if ( recog )
        return reply; // message processed

    if ( msg2.find(" ") != string::npos )
        return reply;

    const std::vector<string> & vd = gs->config->vdirs;

    for ( size_t i = 0; i < vd.size(); i++ )
    {
        size_t vdsz = vd[i].size();
        if ( vdsz > msg2.size() ) continue;
        if ( vd[i] != msg2.substr(0, vdsz) ) continue;
        if ( vdsz < msg2.size() && msg2[vdsz] != '/' ) continue;

        msg2.replace(0, vdsz, "/" + gs->config->ddirs[i]);
        return Worker2(gs, &msg2, mime, enc).process(0);
    }

    return reply;
}

string WorkerCore::decrypt(const string & msg)
{
    return gs->keyArea.skcdec(msg, false, true);
}
