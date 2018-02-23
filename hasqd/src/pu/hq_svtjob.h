// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_SVTJOB
#define _HQ_SVTJOB

//#include <istream>
#include <string>

#include "gl_protocol.h"

using std::string;

class GlobalSpace;

class SvtJob
{
    public:
        enum Type
        {
            None, Conupdate, Noterecv,
            Sendnote, SetConfl, ChkConfl, Reorg
        };

    private:
        GlobalSpace * gs;
        int i_arg1;
        gl::intint n_arg1;
        string s_arg1, s_arg2;

        void init(Type t);

        typedef void (SvtJob::*func_proc)();
        typedef const char * (SvtJob::*func_text)();
        func_proc process_ptr;
        func_text text_ptr;

    public:
        SvtJob(): gs(0) { init(None); }
        SvtJob(GlobalSpace * g, Type t): gs(g) { init(t); }
        SvtJob(GlobalSpace * g, Type t, int i): gs(g), i_arg1(i) { init(t); }
        SvtJob(GlobalSpace * g, Type t, int i, gl::intint n, const string & s)
            : gs(g), i_arg1(i), n_arg1(n), s_arg1(s) { init(t); }

        SvtJob(GlobalSpace * g, Type t, int i, gl::intint n, const string & s1, const string & s2)
            : gs(g), i_arg1(i), n_arg1(n), s_arg1(s1), s_arg2(s2) { init(t); }

        void process() { (this->*this->process_ptr)(); }
        const char * text() { return (this->*this->text_ptr)(); }

        void none_proc() {}
        const char * none_text() { return ""; }

        void conupdate_proc();
        const char * conupdate_text() { return "conupdate"; }

        void noterecv_proc();
        const char * noterecv_text() { return "noterecv"; }

        void sendnote_proc();
        const char * sendnote_text() { return "sendnote"; }

        void setconfl_proc();
        const char * setconfl_text() { return "setconfl"; }

        void chkconfl_proc();
        const char * chkconfl_text() { return "chkconfl"; }

        void reorg_proc();
        const char * reorg_text() { return "reorg"; }
};


#endif


