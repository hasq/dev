// Hasq Technology Pty Ltd (C) 2013-2016


#ifndef _HQ_TOKEN
#define _HQ_TOKEN

#include <string>

using std::string;


namespace gl
{

class Token
{
        const string * mstr;
        size_t head, tail;

    public:
        Token(const string * x): mstr(x), head(0), tail(0) {}

        bool next();
        bool next(int i);
        bool is(const char *) const;
        string sub() const { return mstr->substr(head, tail - head); }
        string end() const { return tail == mstr->size() ? "" : mstr->substr(tail); }
        const string & c_str() const { return *mstr; }
};

} //gl

#endif

