// Hasq Technology Pty Ltd (C) 2013-2016

#include "gl_utils.h"
#include "gl_except.h"


gl::Exception::Exception(string m, const string & arg1, const string & arg2, const string & arg3)
    : message(m)
{
    replaceAll(message, "$1", arg1);
    replaceAll(message, "$2", arg2);
    replaceAll(message, "$3", arg3);
}


