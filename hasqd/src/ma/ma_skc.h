// Hasq Technology Pty Ltd (C) 2013-2016

#include <string>

#include "gl_defs.h"
#include "ma_hash.h"

using std::string;

namespace ma
{

namespace skc
{

const size_t HashBitSz = 256;
const size_t HashBteSz = HashBitSz / 8;
const size_t HashHexSz = HashBteSz * 2;
const size_t SaltPadSz = 4; // must be not greater than HashBteSz

inline string hashHex(const string & s)
{
    char b[HashHexSz];
    calcSha256Hash(s.c_str(), gl::st2i(s.size()), b);
    return string(b, HashHexSz);
}

string enc(const string & key, const string & message, const string & salt, const string & iv);

// return empty on error
string dec(const string & key, const string & message);

}
} // skc ma
