// Hasq Technology Pty Ltd (C) 2013-2015

#include <string>
#include <cstring>
#include <cstdlib>

using std::string;
using std::memset;
using std::memcpy;

#include "ma_utils.h"

using std::string;

bool ma::checkHex(const char * buf, int buflen)
{
    if (buf && buflen > 0)
    {
        for (int i = 0; i < buflen; i++)
        {
            if (isxdigit(buf[i]))
                continue;
            else
                return false;
        }
        return true;
    }
    return false;
}

bool ma::checkDec(const char * buf, int buflen)
{
    if (buf && buflen > 0)
    {
        for (int i = 0; i < buflen; i++)
        {
            if (isdigit(buf[i]))
                continue;
            else
                return false;
        }
        return true;
    }
    return false;
}

void ma::toHex(const char * in, int inlen, char * out)
{
    const char * hexDigits = "0123456789abcdef";
    int index = 0;

    if (in && inlen > 0 && out)
    {
        for (int i = 0; i < inlen; i++)
        {
            out[index++] = hexDigits[(in[i] >> 4) & 0x0F];   // equal to "in[i]/16"
            out[index++] = hexDigits[in[i] & 0x0F];          // equal to "in[i]%16"
        }
    }
}

void ma::toBin(const char * in, int inlen, char * out)
{
    int index = 0;

    if (in && inlen > 0 && out)
    {
        for (int i = 0; i < inlen; i++)
        {
            char a = in[i];
            if ( a >= '0' && a <= '9' ) a -= '0';
            else if ( a >= 'a' && a <= 'f' ) a -= 'a' - char(10);

            if ( i % 2 )
            {
                out[index] <<= 4;
                out[index++] |= a;
            }
            else
                out[index] = a;
        }
    }
}

string ma::toHex(const string & s)
{
    size_t sz = s.size();
    char * buf = new char[sz * 2];
    toHex(s.c_str(), gl::st2i(sz), buf);
    string r(buf, sz * 2);
    delete [] buf;
    return r;
}

string ma::toBin(const string & s)
{
    size_t sz = s.size();
    char * buf = new char[sz];
    toBin(s.c_str(), gl::st2i(sz), buf);
    string r(buf, sz / 2);
    delete [] buf;
    return r;
}

extern string b64_encode(unsigned char const *, unsigned int);
string ma::b64enc(const string & s)
{
    return b64_encode(gl::cp2cp<unsigned char, char>(s.c_str()), gl::st2i(s.size()));
}

extern string b64_decode(string const & );
string ma::b64dec(const string & s)
{
    return b64_decode(s);
}

