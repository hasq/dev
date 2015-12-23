// Hasq Technology Pty Ltd (C) 2013-2015

#include <string>
#include <cstring>
#include <cstdlib>

#include "md5.h"
#include "sha2.h"
#include "rmd160.h"

using std::string;
using std::memset;
using std::memcpy;

#include "ma_utils.h"
#include "ma_hash.h"

using std::string;

void calcMd5Hash(const char * in, int inlen, char * out)
{
    MD5 m(string(in, inlen));
    ma::toHex(gl::p2p<const char>(m.getDigest()), 16, out);
}

void calcSha256Hash(const char * in, int inlen, char * out)
{
    char buf[SHA256_DIGEST_STRING_LENGTH];

    SHA256_Data((const u_int8_t *)in, inlen, buf);
    memcpy(out, buf, SHA256_DIGEST_STRING_LENGTH - 1);
}

void calcSha384Hash(const char * in, int inlen, char * out)
{
    char buf[SHA384_DIGEST_STRING_LENGTH];

    SHA384_Data((const u_int8_t *)in, inlen, buf);
    memcpy(out, buf, SHA384_DIGEST_STRING_LENGTH - 1);
}

void calcSha512Hash(const char * in, int inlen, char * out)
{
    char buf[SHA512_DIGEST_STRING_LENGTH];

    SHA512_Data((const u_int8_t *)in, inlen, buf);
    memcpy(out, buf, SHA512_DIGEST_STRING_LENGTH - 1);
}

void calcRipeMd160Hash(const char * in, int inlen, char * out)
{
    char * b = gl::p2p<char>(RMD((byte *)in, (dword)inlen));
    if (b)
    {
        ma::toHex(b, 20, out);
        ::free(b);
    }
}

