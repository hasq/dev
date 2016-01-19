// Hasq Technology Pty Ltd (C) 2013-2015

#include <cstring>

#include "gl_defs.h"
#include "gl_err.h"
#include "gl_except.h"

#include "ma_hash.h"
#include "ma_utils.h"
#include "hq_hash.h"


static const bool oldWord = false;
static const bool oldHashes = false;

void db::Sha3::calc(const char * in, int inlen, char * out)
{
    throw gl::ex("Sha3::calc not implemented");
}

void db::Md5::calc(const char * in, int inlen, char * out)
{
    calcMd5Hash(in, inlen, out);
}

void db::Sha256::calc(const char * in, int inlen, char * out)
{
    calcSha256Hash(in, inlen, out);
}

void db::Sha512::calc(const char * in, int inlen, char * out)
{
    calcSha512Hash(in, inlen, out);
}

void db::RipeMd160::calc(const char * in, int inlen, char * out)
{
    calcRipeMd160Hash(in, inlen, out);
}

void db::Smd::calc(const char * in, int inlen, char * out)
{
    calcSmdHash(in, inlen, out);
}

db::Dn * db::Dn::create(const string & type, const string & str, bool calculate)
{
    Dn * r = 0;
    if (type == Md5::name()) r =  new db::DnT<Md5>();
    else if (type == Smd::name()) r =  new db::DnT<Smd>();
    else if (type == Sha256::name()) r =  new db::DnT<Sha256>();
    else if (type == Sha512::name()) r = new db::DnT<Sha512>();
    else if (type == Sha3::name()) r = new db::DnT<Sha3>();
    else if (type == RipeMd160::name()) r = new db::DnT<RipeMd160>();
    else if (type == Word::name()) r = new db::DnT<Word>();

    if (!r) return 0;

    REPORT(r);

    if (r->init(str, calculate) == er::OK)
        return r;

    delete r;
    return 0;
}

void db::Word::calc(const char * in, int inlen, char * out)
{
    if (!oldWord)
    {
        char buf[Md5::SIZE];
        Md5::calc(in, inlen, buf);
        for ( int i = 0; i < 4; i++ )
            out[i] = buf[i];
    }
    else
    {
        unsigned int sum = 0;
        for ( int i = 0; i < inlen; i++ ) sum += gl::c2i(in[i]) * 7 + 1;
        for ( int i = 0; i < 4; i++ )
        {
            unsigned char c = (unsigned char)(sum & 0x0f);
            c += '0';
            if ( c > '9' ) --((c -= '9') += 'a');
            out[i] = c;
            sum >>= 4;
        }
    }
}


template<class T>
er::Code db::Hash<T>::init(const string & str, bool calculate, bool zfill)
{
    int length = gl::st2i(str.length());
    if (calculate) calc(str.c_str(), length, val);
    else
    {
        if ( zfill && str == "0" )
            init0();
        else
        {
            if ( length == T::SIZE && ma::checkHex(str.c_str(), T::SIZE))
                std::memcpy(val, str.c_str(), T::SIZE);
            else return er::HASH_INIT_FAIL;
        }
    }
    return er::OK;
}

template<class T>
void db::Hash<T>::init0()
{
    for ( int i = 0; i < T::SIZE; i++ ) val[i] = '0';
}


template<class T>
bool db::Hash<T>::operator==(const Hash<T> & b) const
{
    return !std::strncmp(val, b.val, T::SIZE);
}

template<class T>
bool db::Hash<T>::operator<(const Hash<T> & b) const
{
    return std::strncmp(val, b.val, T::SIZE) < 0;
}


template class db::Hash<db::Md5>;
template class db::Hash<db::Word>;
template class db::Hash<db::Sha256>;
template class db::Hash<db::Sha512>;
template class db::Hash<db::RipeMd160>;
template class db::Hash<db::Sha3>;
template class db::Hash<db::Smd>;
