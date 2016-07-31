// Hasq Technology Pty Ltd (C) 2013-2016

#include <cctype>

#include "gl_token.h"

bool gl::Token::next()
{
    const string & s = *mstr;

    if ( s.empty() ) return false;

    head = tail;

    while ( head < s.size() && std::isspace(s[head]) ) head = ++tail;

    if ( head >= s.size() ) return false;

    while ( ++tail < s.size() && !std::isspace(s[tail]) );

    return true;
}

string gl::Token::rest() const
{
    const string & s = *mstr;
    auto t = tail;
    while ( t < s.size() && std::isspace(s[t]) ) ++t;
    return t == s.size() ? "" : s.substr(t);
}


bool gl::Token::is(const char * x) const
{
    const string & s = *mstr;
    size_t i = head, j = 0;
    for ( ; i < tail; i++, j++ )
        if ( s[i] != x[j] ) return false; // ok since x end with '\0'

    return ( x[j] == '\0' );
}

bool gl::Token::next(int x)
{
    for ( int i = 0; i <= x; i++ )
        if ( !next() ) return false;

    return true;
}


