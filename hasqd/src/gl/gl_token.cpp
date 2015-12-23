// Hasq Technology Pty Ltd (C) 2013-2015

#include <cctype>

#include "gl_token.h"

bool gl::Token::next()
{
    const string & s = *mstr;

    if ( s.empty() ) return false;

    head = tail;

    while ( head < s.size() && std::isspace(s[head]) ) { head = ++tail; }

    if ( head >= s.size() ) return false;

    while ( ++tail < s.size() && !std::isspace(s[tail]) );

    return true;
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


