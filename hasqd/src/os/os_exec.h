// Hasq Technology Pty Ltd (C) 2013-2015

#ifndef _OS_EXEC
#define _OS_EXEC

#include <string>
#include <vector>
#include <cstdlib>

using std::string;

namespace os
{

namespace ac
{
struct Pum;
class Process;
class ProcessLocal;
class ProcessOmf;
class ProcessLocal_Impl;
} // ac


struct ac::Pum
{
    string proj;
    string udir;
    string model;

    bool operator<(const Pum &) const;
    string str() const { return proj + "  " + model + "  " + udir; }
};

class ac::Process
{
    protected:
        bool mRunning;
        bool mAborted;
        string mId;
        string mProgress;

    public:
        bool getRunningStatus() const { return mRunning; }
        bool getAbortedStatus() const { return mAborted; }
        string getId() const { return mId; }
        string getProgress() const { return mProgress; }
        void setProgress(const string & s) { mProgress = s; }

        // update status too
        virtual bool isRunning() = 0;

        virtual void die() = 0;

        Process(): mRunning(true), mAborted(false) {}
        virtual ~Process() {}
};

class ac::ProcessLocal : public ac::Process
{
        ProcessLocal_Impl * mImpl;

        ProcessLocal(const ProcessLocal &);
        void operator=(const ProcessLocal &) const;

    public:
        ProcessLocal(const string & cmd, const string & dir = "", bool output = false, bool * ok = 0);
        ~ProcessLocal();
        virtual bool isRunning();
        virtual void die();

        void wait(int) const;
        int getCode() const;
        string getOutput() const;
};


inline bool execSystem(const string & cmd)
{
    return (std::system(cmd.c_str()) == 0);
}

inline bool execProc(const string & cmd, const string & dir)
{
    bool ok;
    ac::ProcessLocal p(cmd, dir, false, &ok);
    return ok;
}

inline bool execWait(const string & cmd, const string & dir)
{
    bool ok;
    ac::ProcessLocal p(cmd, dir, false, &ok);
    if ( !ok ) return false;
    p.wait(-1);
    return (p.getCode() == 0);
}

inline string execOut(const string & cmd)
{
    ac::ProcessLocal p(cmd, "", true);
    string r = p.getOutput();
    //int k = p.getCode();
    return r;
}

bool execInShell(const string & cmd, const string & dir);


} // os


#endif
