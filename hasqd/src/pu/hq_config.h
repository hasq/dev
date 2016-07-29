// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_CONFIG
#define _HQ_CONFIG

#include <string>
#include <vector>

#include "gl_protocol.h"

#include "os_ipaddr.h"

#include "hq_dbcfg.h"

using std::string;

namespace cfg
{

struct Dbg
{
    bool acceptQuit; //
    bool ced;
    bool wkr;
    bool svt;
    bool sec;
    bool prn; // allow print from Svt by "print" command
    bool evt;
    bool pul; // pulse
    bool agt; // agent
    unsigned short id;
    string tcp; // save incoming connection

    Dbg();
};

struct PublicNetCmd
{
    PublicNetCmd();

    void all(bool);
    void set(string, bool);

    bool admin;
    bool quit;
    bool add;
    bool conflict;
    bool connect;
    bool unlink;
    bool pleb;
    bool file;
    bool data;
    bool first;
    bool html;
    bool info;
    bool job;
    bool last;
    bool lastdata;
    bool list;
    bool note;
    bool range;
    bool record;
    bool zero;
    bool ping;
    bool proxy;
};

} // cfg

class Config
{
    public:
        enum { ALL, NONE, SVT_ONLY } createThreads;
        string createThreadsStr() const;

        int seTimeout;
        int reorgToutS;
        int cpuLoadCycle;

        gl::NetworkLimits netLimits;
        static gl::ProtHq   clntHq;
        static gl::HttpGet  clntHttpGet;
        static gl::HttpPost clntHttpPost;
        gl::Protocol * clntProt;
        gl::ProxyData pxData;

        int wkrAreaLimSize;
        int wkrAreaJobSize;
        int cedAreaSize;
        int binAreaSize;
        int svtAreaSize;
        int zeroLimit;

        db::DbCfg dbcfg;
        string servantFile;
        string proxyIpport;
        bool noSecretary;

        cfg::Dbg dbg;
        cfg::PublicNetCmd publicNetCmd;

        bool quiet;
        bool listDir;
        string webRoot;

        int logSize;
        bool console;
        bool ignoreLock;
        bool ignoreLog;

        bool dbgUdpW;
        bool dbgUdpR;
        bool dbgUdpA;

        int conCloseSize_ini;
        int conPotSize_ini;
        int conHintSize_ini;

        int actQueSize;

        int lastdataMax;
        int rangeMax;

        string skc_seed;
        std::vector<string> initial_skc_keys;
        string family;

        bool homevalid;
        string webhome;                // default page
        // virtual directories
        std::vector<string> vdirs; // web keys
        std::vector<string> ddirs; // disk values

        string plebDir; // Directory for files

        string xfwd;

    private: int nWorkers;

    public: int getnWorkers() const { return nWorkers; }

        os::IpAddr seIpLink;
        os::IpAddr amIpLink;

        string nodename;

        // "ip:port" list of locked connections to this publisher
        std::vector<string> ipp_locks;

        unsigned workerDelay;

    public:
        Config(int ac, const char * av[], const char * cfgfile = 0);

    private:
        void convert_nodename();
        void operator=(const Config &);
        Config(const Config &);

        void processOptionLetter(char a);
        void processOptionKeyVal(const string & k, const string & v);
        static bool getbool(const string & v);

        void setHomeValid();
        void loadFile(const char * cfgfile, bool forced);
        void oneOption(const string & s);
        void setHttpGetProxy(const string & s);
};

#endif
