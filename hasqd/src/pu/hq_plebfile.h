// Hasq Technology Pty Ltd (C) 2013-2015

#ifndef _HQ_PLEBFILE
#define _HQ_PLEBFILE

#include "gl_token.h"
#include "os_filesys.h"
#include "hq_globalspace.h"

class Plebfile
{
        GlobalSpace * gs;
        gl::Token & tok;
        er::Code err;
        os::Path root;

    public:
        string process();
        Plebfile(GlobalSpace * g, gl::Token & t);

    private:
        void operator=(const Plebfile &);
        string put(bool app);
        string mkdir();
        string del();
        string app();
        string list();
        string get();
        string exec();
        string clean();
};


#endif
