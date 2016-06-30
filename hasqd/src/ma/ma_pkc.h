// Hasq Technology Pty Ltd (C) 2013-2016

#include <string>

#include "gl_rnd.h"

#include "ma_utils.h"

#include "unumber/cunum_def_4096.h"
#include "unumber/unumber.h"

const int UnumMax = 4000;

using std::string;

namespace ma
{

class PubKeyObject
{
        static const unsigned MaxPrimeCheck = 70;

        Unumber mod;
        Unumber pk;
        Unumber sk;
        unsigned BlockBteSzL; // this is max number of bytes which fit into mod
        unsigned BlockBteSzU; // this is max number of bytes representing mod

        static string simplify(const string & s);
        static Unumber prime(string & seed, int length, Output & out);
        static Unumber genNumber(string & seed, int length);

    public:
        static bool isPrime(const Unumber & n);
        static bool isEuler(const Unumber & m, const Unumber & phi, unsigned max);

    public:
        PubKeyObject(string seed, int length, Output & out) { init(seed, length, out); }
        void init(string seed, int length, Output & out);

        PubKeyObject(): mod(0), pk(0), sk(0), BlockBteSzL(0), BlockBteSzU(0) {}

        string str() const;
        string strSimple() const;

        string enc(const string & msgp, const string & salt) const;
        string dec(const string & msgc) const;
};

typedef PubKeyObject Pko;

} // skc ma
