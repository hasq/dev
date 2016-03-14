// Hasq Technology Pty Ltd (C) 2013-2015

#ifndef _HQ_PLATFORM
#define _HQ_PLATFORM


#ifdef _WIN32

#ifdef _M_X64
#define PLATFORM "Win_x64"
#else

#ifdef __CYGWIN__
#define PLATFORM "Cyg_x86"
#else
#define PLATFORM "Win_x86"
#endif

#endif

#else

#ifdef __linux__
#define PLATFORM " Linux "
#else
#ifdef __FreeBSD__
#define PLATFORM "FreeBSD"
#else

#ifdef __CYGWIN__
#define PLATFORM "Cyg_x86"
#else
#define PLATFORM " Unix  "
#endif

#endif
#endif

#endif

#define VERSION "0.4.0"

#define LOGO "Hasq server " VERSION " (" PLATFORM ") Hasq Technology Pty Ltd (C) 2013-2015"

#define LICENCE \
"Copyright (C) 2013-2015 Hasq Technology Pty Ltd\n" \
"All rights reserved.\n" \
"\n" \
"\n" \
"Redistribution and use in source and binary forms are permitted\n" \
"for personal and commercial use provided that no modifications\n" \
"to source code or binaries are made.\n" \
"\n" \
"Modification of source code and binaries, redistribution and use\n" \
"of modified source code or binaries is allowed for personal use\n" \
"provided that the following conditions are met:\n" \
"\n" \
"1. Redistributions of source code must retain the above copyright\n" \
"   notice, this list of conditions and the following disclaimer.\n" \
"2. Redistributions in binary form must reproduce the above copyright\n" \
"   notice, this list of conditions and the following disclaimer in the\n" \
"   documentation and/or other materials provided with the distribution.\n" \
"\n" \
"THIS SOFTWARE IS PROVIDED BY THE AUTHORS AND CONTRIBUTORS ``AS IS'' AND\n" \
"ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\n" \
"IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE\n" \
"ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHORS OR CONTRIBUTORS BE LIABLE\n" \
"FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\n" \
"DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS\n" \
"OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)\n" \
"HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT\n" \
"LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY\n" \
"OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF\n" \
"SUCH DAMAGE.\n" \
"\n"


#endif
