// Hasq Technology Pty Ltd (C) 2013-2015

#ifndef NODE_H
#define NODE_H

#include <string>

#include "gl_utils.h"

#include "hq_config.h"
#include "hq_publisher.h"

using std::string;

struct PubObject : os::Blockable
{
    Publisher pub;

    PubObject( Config * c, bool * exitf ): os::Blockable(exitf), pub(c) {}

    void runOnceUnconditionally() { pub.run(); *exitp = true; }
    os::Semaphore * getMainSemaphore() const { return 0; }

    void stop() { pub.getGlobalSpace()->stopPublisherSignal(); }

};

struct PubData
{
    std::vector<string> clocks;
};


class Node
{
        string cmd;
        Config cfg;
        bool exitf;
        PubObject pubObject;
        os::Thread thread;

        GlobalSpace * gs;
        bool bSelected;

        void stop() { exitf = true; pubObject.stop(); }
        static Config * modify_cfg(Config *);

    public:

        typedef unsigned short ushort;
        const ushort port_mine;
        typedef std::vector<ushort> vus;
        vus port_friends;

        Node(const string & cmd);
        ~Node() { stop(); }
        char activity();
        const string & getCmd() const { return cmd; }

        string send(const string & acmd);
        bool refreshConn();
        bool selected() const { return bSelected; }
        void select() { bSelected = !bSelected; }

        string recpwd(const string & un, const string & N, const string & rdn, const string & pwd);
        string id() const { return gl::tos(gs->config->seIpLink.getPort()); }

        PubData getPubdata();

        void inject_list(const string & acmd);
        void inject_one(const string & acmd);

        bool exited() const { return exitf; }

        void reorg();

    private:
        Node(const Node &);
        void operator=(const Node &);

};

#endif

