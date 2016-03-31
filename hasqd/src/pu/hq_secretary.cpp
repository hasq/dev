// Hasq Technology Pty Ltd (C) 2013-2015

#include "gl_err.h"
#include "os_net.h"
#include "sg_cout.h"

#include "hq_secretary.h"

Secretary::Secretary(GlobalSpace * g) : Blockable(&g->stopPublisher)
    , gs(g)
    , am(gs)
    , tcpAcceptor(&gs->protHttp, gs->config->seIpLink)
    , selector(g->config->netLimits)
    , alarms(g)
{
    bool tcpon = {tcpAcceptor.getAddr().getPort() != 0};
    if ( tcpon ) selector.addAcceptor(&tcpAcceptor);

    if ( gs->config->quiet ) return;

    const string & prx = gs->config->proxyIpport;

    os::Cout out;
    out << "HOST: name=" << gs->config->nodename;

    if ( tcpon )
    {
        string ip = os::net::NetInitialiser::list_ips(false);
        if ( !ip.empty() )
            out << " ip=" << ip;

        out << " port=" << gs->config->seIpLink.getPort();

        if ( !prx.empty() )
            out << (" => " + prx);
    }

    out << os::endl;
}


void Secretary::runOnceUnconditionally()
{
    os::net::Socket * s = selector.wait(gs->config->seTimeout);
    alarms.trigger();

    if ( !s )
    {
        if (gs->config->dbg.pul) os::Cout() << '.' << os::flush;
        return;
    }

    if ( gs->stopPublisher )
    {
        delete s;
        return;
    }

    if (gs->config->dbg.sec)
    {
        const size_t MXL = 80;

        string raw;
        const string & msg = s->getReceivedMessage(&raw);

        if ( raw.size() > MXL ) raw = raw.substr(0, MXL) + "...";


        gl::replaceAll(raw, "\r", "");
        gl::replaceAll(raw, "\n", "\\n");

        string pr = os::prmpt("sec", gs->config->dbg.id);
        os::Cout() << pr << "Received [" << raw << "]\n"
                   << pr << "Submitting job ["
                   << (msg.size() < MXL ? msg : msg.substr(0, MXL))
                   << "]" << os::endl;
    }

    submitJob(s);
}


void Secretary::submitJob(os::net::Socket * s)
{
    if ( s->getAddr().strIp() == gs->config->xfwd )
    {
        string ip = s->accessRequest().accessPmd().ip;
        if ( !ip.empty() )
            s->setAddr(ip);
    }

    WkrArea & wa = gs->wkrArea;

    sgl::Mutex mutex_wa(wa.mutex);

    JobQueue & jobs = wa.jobSockets;

    er::Code k = jobs.add(s);

    if ( k )
    {
        gs->logger.add
        (
            Logger::Overflow,
            "Error submitJob: [" + s->getReceivedMessage() + "] " + k.str()
        );

        s->send_msg("BUSY");
        delete s;
        return;
    }

    wa.workerSemaphore.up();
}

