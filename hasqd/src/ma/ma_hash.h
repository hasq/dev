// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _MA_HASH_H
#define _MA_HASH_H

#include "gl_defs.h"

void calcMd5Hash(const char * in, int inlen, char * out);
void calcSha1Hash(const char * in, int inlen, char * out);
void calcSha256Hash(const char * in, int inlen, char * out);
void calcSha384Hash(const char * in, int inlen, char * out);
void calcSha512Hash(const char * in, int inlen, char * out);
void calcRipeMd160Hash(const char * in, int inlen, char * out);
void calcWhirlpoolHash(const char * in, int inlen, char * out);
void calcSmdHash(const char * in, int inlen, char * out);

#endif
