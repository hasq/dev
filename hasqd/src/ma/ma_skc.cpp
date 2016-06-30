// Hasq Technology Pty Ltd (C) 2013-2016

#include <cstring>

#include "gl_defs.h"
#include "gl_except.h"
#include "gl_utils.h"

#include "ma_skc.h"
#include "ma_utils.h"

namespace ma
{
namespace skc
{

struct Block
{
    char buf[HashBteSz];
    enum InpType { Hex, Bin };
    Block(const string & s, InpType tp);
    string str(size_t sz = HashBteSz) const { return string(buf, sz); }

    void Xor(const Block & x);
    bool isZero() const;

    static std::vector<Block> str2seq(const string & s);
    static string seq2str(const std::vector<Block> & b);

};

} // skc
} // ma

ma::skc::Block::Block(const string & s, InpType tp)
{
    if ( tp == Hex )
    {
        if ( s.size() != HashBteSz * 2 )
            throw gl::Never("ma::skc::Block - bad hex $1 $2", gl::tos(s.size()), gl::tos(HashBteSz * 2) );

        toBin(s.c_str(), gl::st2i(s.size()), buf);
    }
    else if ( tp == Bin )
    {
        if ( s.size() != HashBteSz )
            throw gl::Never("ma::skc::Block - bad size $1 expect:$2", gl::tos(s.size()), gl::tos(HashBteSz) );

        std::memcpy(buf, s.c_str(), s.size());
    }
}

std::vector<ma::skc::Block> ma::skc::Block::str2seq(const string & s)
{
    std::vector<Block> r;

    size_t sz = s.size() / HashBteSz;
    for ( size_t i = 0; i < sz; i++ )
        r.push_back( Block( s.substr( i * HashBteSz, HashBteSz ), Block::Bin ) );

    return r;
}

string ma::skc::Block::seq2str(const std::vector<ma::skc::Block> & b)
{
    string r;
    for ( size_t i = 0; i < b.size(); i++ )
        r += b[i].str();

    return r;
}

void ma::skc::Block::Xor(const Block & x)
{
    for ( size_t i = 0; i < HashBteSz; i++ )
        buf[i] ^= x.buf[i];
}

bool ma::skc::Block::isZero() const
{
    for ( size_t i = 0; i < HashBteSz; i++ )
        if ( buf[i] ) return false;

    return true;
}

string ma::skc::enc(
    const string & key,
    const string & message,
    const string & salt,
    const string & iv)
{
    if ( salt.size() != HashHexSz || iv.size() != HashHexSz )
        throw gl::Never("Salt or IV - bad size");
    string s = message;

    // 1 add size
    s = s + ":" + gl::tos(s.size());

    // 2 think block
    Block bsalt(salt, Block::Hex);
    Block biv(iv, Block::Hex);

    // 3 check minimal padding and pad
    {
        size_t pad = HashBteSz - s.size() % HashBteSz;
        if ( pad < SaltPadSz ) s = bsalt.str() + s;
        s = bsalt.str(pad) + s;
    }

    // 4 break into blocks
    if ( s.size() % HashBteSz ) throw gl::Never("skc::enc - bad padding");

    std::vector<Block> C, P = Block::str2seq(s);

    // 5 encoding
    C.push_back( Block(iv, Block::Hex) );

    size_t sz = s.size() / HashBteSz;
    for ( size_t i = 0; i <= sz; i++ )
    {
        Block H(hashHex(key + toHex(C[i].str())), Block::Hex);
        if ( i < sz ) H.Xor(P[i]);

        C.push_back( H );
    }
    return Block::seq2str(C);
}

string ma::skc::dec(const string & key, const string & message)
{
    if ( message.size() % HashBteSz )
        return ""; // "+gl::tos(message.size());

    std::vector<Block> P, C = Block::str2seq(message);

    size_t sz = C.size();

    if ( sz-- < 3 )
        return "";

    for ( size_t i = 0; i < sz; i++ )
    {
        Block H(hashHex(key + toHex(C[i].str())), Block::Hex);
        H.Xor(C[i + 1]);

        P.push_back( H );
    }

    if ( !P[sz - 1].isZero() )
        return "";

    P.pop_back();

    string s = Block::seq2str(P);

    size_t col_pos = s.rfind(":");

    if ( col_pos == string::npos )
        return "";

    int msg_size = gl::toi(s.substr(col_pos + 1));

    if ( msg_size < 1 || msg_size > gl::st2i(col_pos) )
        return "";

    return s.substr(col_pos - msg_size, msg_size);
}

