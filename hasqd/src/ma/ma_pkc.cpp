// Hasq Technology Pty Ltd (C) 2013-2015

///#include <iostream> // debug FIX

#include <cstring>

#include "gl_except.h"
#include "gl_utils.h"

#include "ma_pkc.h"
#include "ma_utils.h"

#include "ma_skc.h"

namespace ma
{
//using Extended Modular Euclidian algorithm for inversion
bool invert(const Unumber & x, const Unumber & mod, Unumber * xm1);
}

void ma::PubKeyObject::init(string seed, int length, Output & out)
{
    if ( length < 8 )
        throw gl::ex("PubKeyObject cannot construct small key");

    int len1 = length / 2;
    int len2 = length - len1;

start:
    out << "Generating prime P ";
    Unumber p = prime(seed, len1, out);
    out << "\nP=" << p.str() << "\n";
    out << "Generating prime Q ";
    Unumber q = prime(seed, len2, out);
    while ( p == q ) q = prime(seed, len2, out);
    out << "\nQ=" << q.str() << "\n";

    mod = p * q;

    Unumber p1 = p - 1;
    Unumber q1 = q - 1;

    Unumber phi = p1 * q1;

    out << "P/Q/MOD/PHI " << p.str() << ' ' << q.str() << ' '
        << mod.str() << ' ' << phi.str() << '\n';

    out << "Validating Euler function [";

    unsigned umax = MaxPrimeCheck;

    if ( p1 < Unumber(umax) )
        umax = (unsigned)p1.to_ull();

    if ( q1 < Unumber(umax) )
        umax = (unsigned)q1.to_ull();

    if ( !isEuler(mod, phi, umax) )
        throw gl::Never("PubKeyObject: bad primes");

    out << "]\n";

    out << "Search for public exponent\n";

    pk = Unumber(65537u);
    while ( p1 < pk ) { pk >>= 1; pk += 1; }
    while ( q1 < pk ) { pk >>= 1; pk += 1; }

    sk = 0;
    while ( !invert(pk, phi, &sk) )
    {
        pk -= 1;
        if ( pk.iszero() )
        {
            out << "Public exponent is not found. Need new P and Q ...\n";
            goto start;
        }
    }

    // calculate BlockBteSz
    {
        Unumber a(mod);
        BlockBteSzU = 0;
        while ( !a.iszero() )
        {
            BlockBteSzU++;
            a >>= 8;
        }
        BlockBteSzL = BlockBteSzU - 1;
    }

    out << "PK/SK/MOD/PHI/MSZ "
        << pk.str() << ' ' << sk.str() << ' '
        << mod.str() << ' ' << phi.str() << ' '
        << BlockBteSzU << '\n';

    out << "Testing keys ";
    for ( unsigned i = 2; i < umax; i++ )
    {
        Unumber u(i);
        u.pow_c(pk, mod);
        u.pow_c(sk, mod);
        if ( u != Unumber(i) )
        {
            out << "Test failed for " << i << ". Regenerating new P and Q ...\n";
            goto start;
        }
        out << '.';
    }
    out << "\n";

    out << "Keys have been successfuly generated\n";
}

string ma::PubKeyObject::str() const
{
    return mod.str() + "," + pk.str();
}

string ma::PubKeyObject::strSimple() const
{
    string m = simplify(mod.str());
    string p = simplify(pk.str());
    string s = simplify(sk.str());
    return "m=" + m + "\np=" + p + "\ns=" + s + "\n";
}
string ma::PubKeyObject::simplify(const string & s)
{
    size_t sz = s.size();
    if ( sz <= 10 ) return s;
    return s.substr(0, 4) + ".." + s.substr(sz - 4) + "(" + gl::tos(sz) + ")";
}

Unumber ma::PubKeyObject::prime(string & seed, int length, Output & out)
{
    Unumber r;
    //std::cout << "Generating prime\n";
    r = genNumber(seed, length);

    while (1)
    {
        if ( isPrime(r) ) break;
        out << ".";
        //std::cout << simplify(r.str()) << ' ' << std::flush;
        r += 4;
    }

    //std::cout << '\n';
    return r;
}

Unumber ma::PubKeyObject::genNumber(string & seed, int length)
{
    Unumber r(0);

    unsigned hash_cntr = 0;
    seed = skc::hashHex(seed);
    string seedbin = toBin(seed);
    for ( int i = 0; i < length; i++, hash_cntr++ )
    {
        if ( i == 0 || i == 1 || i == length - 1 )
        {
            r.setbit1(i);
            continue;
        }

        if ( hash_cntr >= skc::HashBitSz )
        {
            seed = skc::hashHex(seed);
            seedbin = toBin(seed);
            hash_cntr = 0;
        }

        char a = seedbin[hash_cntr / 8];
        char b(1);
        b <<= (hash_cntr % 8);
        a &= b;
        if ( a )
            r.setbit1(i);
    }

    return r;
}

bool ma::PubKeyObject::isPrime(const Unumber & n)
{
    Unumber p = n - 1;

    unsigned max = MaxPrimeCheck;
    if ( p < Unumber(max) )
        max = (unsigned)p.to_ull();

    unsigned lowprimes[] = { 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101,
                             103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227,
                             229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359,
                             367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491,
                             499, 503, 509
                           };

    unsigned lpsz = sizeof(lowprimes) / sizeof(lowprimes[0]);
    if ( lowprimes[lpsz - 1] < n )
        for ( unsigned i = 0; i < lpsz; i++ )
            if ( n % lowprimes[i] == 0 )
                return false;

    return isEuler(n, p, max);
}

bool ma::PubKeyObject::isEuler(const Unumber & m, const Unumber & p, unsigned max)
{
    Unumber one(1);

    for ( unsigned i = 2; i < max; i++ )
    {
        Unumber u(i);
        u.pow_c(p, m);
        if ( u != one )
            return false;

        //std::cout << 'x' << std::flush; // this is used in other places - cannot print
    }
    return true;
}


string ma::PubKeyObject::enc(const string & msgp, const string & bsalt) const
{
    string s = msgp;

    // add size
    s = s + ":" + gl::tos(s.size());

    // 3 check minimal padding and pad
    for ( unsigned i = 0; i < skc::SaltPadSz || (s.size() % BlockBteSzL); i++ )
    {
        s = bsalt[i % bsalt.size()] + s;
    }

    size_t nblocks = s.size() / BlockBteSzL;

    string C;

    for ( size_t i = 0; i < nblocks; i++ )
    {
        string block = s.substr( i * BlockBteSzL, BlockBteSzL );
        Unumber a(block, Unumber::Binary);
        a.pow_c(pk, mod);
        string sa = a.raw(BlockBteSzU);
        if ( sa.size() != BlockBteSzU ) throw gl::Never("PubKeyObject::enc raw");
        C += sa;
    }

    return b64enc(C);
}

string ma::PubKeyObject::dec(const string & msgc) const
{
    string blks = b64dec(msgc);

    if ( (blks.size() % BlockBteSzU) )
        return "";

    size_t nblocks = blks.size() / BlockBteSzU;

    string s;
    for ( size_t i = 0; i < nblocks; i++ )
    {
        string block = blks.substr( i * BlockBteSzU, BlockBteSzU );
        Unumber a(block, Unumber::Binary);
        a.pow_c(sk, mod);
        string sa = a.raw(BlockBteSzL);
        if ( sa.size() != BlockBteSzL ) throw gl::Never("PubKeyObject::enc raw");
        s += sa;
    }

    size_t col_pos = s.rfind(":");

    if ( col_pos == string::npos )
        return "";

    int msg_size = gl::toi(s.substr(col_pos + 1));

    if ( msg_size < 1 || msg_size > gl::st2i(col_pos) )
        return "";

    return s.substr(col_pos - msg_size, msg_size);

}

