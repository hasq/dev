#ifndef READDIR_CPP
#define READDIR_CPP

#if defined _MSC_VER

#   include "readdir1.cpp"

#elif defined __MINGW32__

#   include "readdir2.cpp"

#elif defined unix || defined __CYGWIN32__

#   include "readdir3.cpp"

#else

#error  platform undefined: provide implementation for readdir.h

#endif

#endif
