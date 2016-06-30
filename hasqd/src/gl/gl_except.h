// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_EXCEPT
#define _HQ_EXCEPT

#include <string>

using std::string;


namespace gl
{

class Exception
{
        string message;

    public:
        Exception(string msg): message(msg) {}

        Exception(string msg, const string & arg1, const string & arg2 = "", const string & arg3 = "");

        string str() const { return message; }
};

typedef Exception ex;
typedef Exception Never;

} //gl

#endif

