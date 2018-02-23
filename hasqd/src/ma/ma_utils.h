// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _MA_UTILS_H
#define _MA_UTILS_H

#include <string>

#include "gl_defs.h"

using std::string;

namespace ma
{

bool checkHex(const char * buf, int buflen);
bool checkDec(const char * buf, int buflen);
void toHex(const char * in, int inlen, char * out);
void toBin(const char * in, int inlen, char * out);

string toHex(const string & s);
string toBin(const string & s);

string b64enc(const string & s);
string b64dec(const string & s);

struct Output
{
    virtual Output & operator<<(unsigned) = 0;
    virtual Output & operator<<(char) = 0;
    virtual Output & operator<<(const char *) = 0;
    virtual Output & operator<<(const string &) = 0;
};

}

#endif
