// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _OS_TIMER
#define _OS_TIMER

#include <string>

#include "gl_defs.h"

using std::string;


namespace os
{


class Timer
{
        gl::intint tv_sec, tv_usec;
        gl::intint adj;

    public:
        void init();
        Timer(): tv_sec(0), tv_usec(0), adj(0) { init(); }
        Timer(int): tv_sec(0), tv_usec(0), adj(0) {} // no init
        gl::intint get(); // get time passed in millisecs
        void set(gl::intint);

        // date +%g%m%d
        static string getGmd();
        static void setGmd(string gmd);
        static string getHms();
        static void setHms(string hms);

};

} // os

#endif



