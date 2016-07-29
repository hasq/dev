// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_SVTTASK
#define _HQ_SVTTASK

#include <string>
#include <vector>

#include "gl_protocol.h"

#include "os_ipaddr.h"

using std::string;

class GlobalSpace;

class SvtTask
{
    protected:
        GlobalSpace * gs;
        string srcText;
        std::vector<SvtTask *> tasks;

        typedef std::vector<string> vs;
        static const string & at(const vs & q, size_t i);
        void clear_tasks();
        void translateIpAddr(string & s);

    public:
        static SvtTask * parse(GlobalSpace * gs, const vs & cmd, size_t & i);
        static SvtTask * parse(GlobalSpace * gs, const vs & cmd) { size_t i = 0; return parse(gs, cmd, i); }
        void setText(const string & txt) { srcText = txt; }

        virtual string process() = 0;

        virtual ~SvtTask() { clear_tasks(); }
        SvtTask(GlobalSpace * g): gs(g) {}
        string text() const { return srcText; }

    private:

        // forbid
        SvtTask(const SvtTask &);
        void operator=(const SvtTask &);
};


class SvtTaskQuit : public SvtTask
{
    public:
        SvtTaskQuit(GlobalSpace * g): SvtTask(g) {}
        string process();
};

class SvtTaskAssign : public SvtTask
{
        string key;
    public:
        SvtTaskAssign(GlobalSpace * g, const vs & cmd, size_t & i, const string & k);
        string process();
};

class SvtTaskVar : public SvtTask
{
        string name;
    public:
        SvtTaskVar(GlobalSpace * g, const vs & cmd, size_t & i);
        string process();
};

class SvtTaskString : public SvtTask
{
        string text;
    public:
        SvtTaskString(GlobalSpace * g, const vs & cmd, size_t & i);
        string process() { return text; }
};

class SvtTaskSeq : public SvtTask
{
        ///string text;
        bool glue;

    public:
        SvtTaskSeq(GlobalSpace * g, const vs & cmd, size_t & i, bool glue);
        string process();
};

class SvtTaskPrint : public SvtTask
{
    public:
        SvtTaskPrint(GlobalSpace * g, const vs & cmd, size_t & i, bool one);
        string process();
};


class SvtTaskShow : public SvtTask
{
    public:
        SvtTaskShow(GlobalSpace * g): SvtTask(g) {}
        string process();
};

class SvtTaskDel : public SvtTask
{
        std::vector<string> keys;
    public:
        SvtTaskDel(GlobalSpace * g, const vs & cmd, size_t & i);
        string process();
};

class SvtTaskRecpwd : public SvtTask
{
        string un, rdn, pass;
        string rdn_index;
        bool number;
        gl::intint N;
        string nvar;

    public:
        SvtTaskRecpwd(GlobalSpace * g, const vs & cmd, size_t & i);
        string process();
};

class SvtTaskTcp : public SvtTask
{
        string saddr;
        ///os::IpAddr makeIpAddr(const string & ip);
    protected:
        string proc(const gl::Protocol & p);
    public:
        SvtTaskTcp(GlobalSpace * g, const vs & cmd, size_t & i);
        string process();
        ///string process() { return proc(gl::ProtHq(gl::Protocol::Client)); }
};

class SvtTaskHash : public SvtTask
{
        string sn;
    public:
        SvtTaskHash(GlobalSpace * g, const vs & cmd, size_t & i);
        string process();
};

class SvtTaskSleep : public SvtTask
{
        int delay;
    public:
        SvtTaskSleep(GlobalSpace * g, const vs & cmd, size_t & i);
        string process();
};

class SvtTaskReplace : public SvtTask
{
    public:
        SvtTaskReplace(GlobalSpace * g, const vs & cmd, size_t & i);
        string process();
};

class SvtTaskFile : public SvtTask
{
        string file;
    public:
        SvtTaskFile(GlobalSpace * g, const vs & cmd, size_t & i);
        string process();
};

class SvtTaskConupdate : public SvtTask
{
    public:
        SvtTaskConupdate(GlobalSpace * g): SvtTask(g) {}
        string process();
};

class SvtTaskNoteB : public SvtTask
{
    protected:

        string dbname;
        gl::intint N;

    public:

        SvtTaskNoteB(GlobalSpace * g, const vs & cmd, size_t & i);
        string process() = 0;
};


class SvtTaskSendNote : public SvtTaskNoteB
{
    public:
        SvtTaskSendNote(GlobalSpace * g, const vs & cmd, size_t & i): SvtTaskNoteB(g, cmd, i) {}
        string process();
};

class SvtTaskNb : public SvtTask
{
        string ipport;
    public:
        SvtTaskNb(GlobalSpace * g, const vs & cmd, size_t & i);
        string process();
};

class SvtTaskFor : public SvtTask
{
        string var;
        int istart, iend;
    public:
        SvtTaskFor(GlobalSpace * g, const vs & cmd, size_t & i);
        string process();
};

class SvtTaskExpect : public SvtTask
{
        string value;
        int index, max_rep;
    public:
        SvtTaskExpect(GlobalSpace * g, const vs & cmd, size_t & i);
        string process();
};

class SvtTaskAddkey : public SvtTask
{
    public:
        SvtTaskAddkey(GlobalSpace * g, const vs & cmd, size_t & i);
        string process();
};

class SvtTaskSkc : public SvtTask
{
        enum { Enc, Dec, Add, Pop, Show } func;
        bool b64, hex;
    public:
        SvtTaskSkc(GlobalSpace * g, const vs & cmd, size_t & i);
        string process();
};

class SvtTaskSave : public SvtTask
{
        string file;
    public:
        SvtTaskSave(GlobalSpace * g, const vs & cmd, size_t & i);
        string process();
};

class SvtTaskSet : public SvtTask
{
        enum Cmd { Date };
        Cmd ecmd;
    public:
        SvtTaskSet(GlobalSpace * g, const vs & cmd, size_t & i);
        string process();
};

class SvtTaskArg : public SvtTask
{
        int index;
    public:
        SvtTaskArg(GlobalSpace * g, const vs & cmd, size_t & i);
        string process();
};

class SvtTaskAgent : public SvtTask
{
        string sub1, sub2, sub3;
    public:
        SvtTaskAgent(GlobalSpace * g, const vs & cmd, size_t & i);
        string process();
};

class SvtTaskNet : public SvtTask
{
        string sub;
        string set_prot(const string & v);
        string show_prot();

    public:
        SvtTaskNet(GlobalSpace * g, const vs & cmd, size_t & i);
        string process();
};

#endif


