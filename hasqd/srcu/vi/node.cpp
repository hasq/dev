// Hasq Technology Pty Ltd (C) 2013-2015

#include <iostream>

#include <cstring>

#include "gl_except.h"

#include "hq_config.h"
#include "sg_client.h"

#include "node.h"

struct S2E
{
        int ac;
        const char ** av;
        S2E(const string & s);
        ~S2E();

    private:
        S2E(const S2E &);
        void operator=(const S2E &);
};

S2E::S2E(const string & s)
{
    std::vector<string> toks = gl::tokenise(s);
    ac = static_cast<int>(toks.size() + 1);
    av = new const char*[ac + 1];

    av[0] = "";
    av[ac] = 0;

    for ( int i = 1; i < ac; i++ )
    {
        av[i] = new char[ toks[i - 1].size() + 1 ];
        std::strcpy( const_cast<char *>(av[i]), toks[i - 1].c_str()  );
    }
}

S2E::~S2E()
{
    for ( int i = 1; i < ac; i++ )
    {
        delete[] av[i];
    }
    delete[] av;
}

Node::Node(const string & s):
    cmd(s),
    cfg(S2E(s).ac, S2E(s).av),
    exitf(false),
    pubObject(modify_cfg(&cfg), &exitf),
    thread(pubObject),
    gs(pubObject.pub.getGlobalSpace()),
    bSelected(false),
    port_mine(gs->config->seIpLink.getPort())

{
    os::Timer t;
    for ( int i = 0; i < 1000; i++ )
    {
        if ( gs->publisherState == 1 )
            return;

        if ( gs->publisherState == 2 )
            break;

        if ( t.get() > 2000 )
            break;

        os::Thread::sleep(10);
    }

    pubObject.stop();
    throw gl::ex("Not enough resources to start node [" + cmd + "]");
}


char Node::activity()
{
    GlobalSpace::ActivityQueueType & q = gs->activity;
    if ( q.empty() ) return '\0';
    return q.pop_some();
}

string Node::send(const string & cm)
{
    for ( int i = 0; i < 10; i++ )
    {
        sgl::Client c(gs->config->clntProt,
                      gs->config->netLimits, gs->config->seIpLink.str());

        if ( !c.isok() )
        {
            os::Thread::sleep(10);
            continue;
        }

        c.send(cm);

        string msg = c.recv();

        if ( msg.empty() )
            return "Error: Canvas: empty reply on [" + cm + "]\n";

        return msg;
    }

    return "Error: Canvas: internal error in Client creation\n";
}

bool Node::refreshConn()
{
    sgl::Client c(gs->config->clntProt,
                  gs->config->netLimits, gs->config->seIpLink.str());

    c.send("info nbs");

    string msg = c.recv();

    if ( msg.empty() )
        return false;

    port_friends.clear();

    std::istringstream is(msg);
    string line;
    is >> line; // OK

    while (1)
    {
        is >> line;
        if ( line.empty() || !is ) break;
        gl::replaceAll(line, "\r", "");
        string::size_type i = line.find(":");
        if ( i == string::npos) throw gl::Never("neighbours throw rubbish");
        ushort port = static_cast<ushort>(gl::toi( line.substr(i + 1) ));
        port_friends.push_back( port );
    }

    return true;
}

string Node::recpwd(const string & un, const string & N, const string & rdn, const string & pwd)
{
    gl::intint iN = gl::toii(N);
    // supply data - need to make interface in htview and wxviewer
    string rc = gs->database.makeFromPasswdStr(un, iN, rdn, pwd, "");
    return rc;
}

PubData Node::getPubdata()
{
    PubData r;
    r.clocks = gs->database.getClocks();
    return r;
}

Config * Node::modify_cfg(Config * cfg)
{
    cfg->console = false;
    cfg->netLimits.maxReadTime = 1500;
    cfg->netLimits.maxConnTime = 1500;
    return cfg;
}

void Node::inject_list(const string & cm)
{
    std::istringstream is(cm);
    while (1)
    {
        string line;
        std::getline(is, line);
        if ( !is ) break;
        if ( line.empty() ) continue;
        if ( line[0] == '#' ) continue;
        inject_one(line);
    }
}

void Node::inject_one(const string & cm)
{
    Publisher & publisher = pubObject.pub;
    publisher.getServant()->addTask_safe(cm);
    publisher.getGlobalSpace()->svtArea.svtSemaphore.up();
}


void Node::reorg()
{
    Publisher & publisher = pubObject.pub;
    SvtJob sjob( gs, SvtJob::Reorg );
    publisher.getGlobalSpace()->svtArea.addJob_safe( sjob );
}

