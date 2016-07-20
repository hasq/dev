// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_HASH
#define _HQ_HASH

#include <vector>
#include <string>
#include <istream>

#include "gl_defs.h"
#include "gl_err.h"

using std::string;

namespace db
{

struct Md5
{
    static const int SIZE = 16 * 2;
    static void calc(const char * in, int inlen, char * out);
    static const char * name() { return "md5"; }
    static const char * nameLong() { return "MD5"; }
};

struct Word
{
    static const int SIZE = 2 * 2;
    static void calc(const char * in, int inlen, char * out);
    static const char * name() { return "wrd"; }
    static const char * nameLong() { return "Md5 - first 2 bytes"; }
};

struct Sha256
{
    static const int SIZE = 32 * 2;
    static void calc(const char * in, int inlen, char * out);
    static const char * name() { return "s22"; }
    static const char * nameLong() { return "SHA2-256"; }
};

struct Sha512
{
    static const int SIZE = 64 * 2;
    static void calc(const char * in, int inlen, char * out);
    static const char * name() { return "s25"; }
    static const char * nameLong() { return "SHA2-512"; }
};

struct RipeMd160
{
    static const int SIZE = 20 * 2;
    static void calc(const char * in, int inlen, char * out);
    static const char * name() { return "r16"; }
    static const char * nameLong() { return "RIPEMD-160"; }
};

struct Sha3
{
    static const int SIZE = 1 * 2;
    static void calc(const char * in, int inlen, char * out);
    static const char * name() { return "s3x"; }
    static const char * nameLong() { return "SHA3"; }
};

struct Smd
{
    static const int SIZE = 16 * 2;
    static void calc(const char * in, int inlen, char * out);
    static const char * name() { return "smd"; }
    static const char * nameLong() { return "SHA256+MD5"; }
};



template<typename T>
class Hash : public T
{
        char val[T::SIZE];
        static void calc(const char * in, int inlen, char * out) 
		{ T::calc(in, inlen, out); }

    public:

        typedef T BaseType;

        Hash() {}

        Hash(const string & str) { init(str, true); }
        er::Code init(const string & str, bool calculate, bool zfill = true);
        void init0();

        string str(void) const { return string(val, T::SIZE); }
        const char * accessVal(void) const { return val; }

        bool operator!=(const Hash<T> & b) const { return !(*this == b); }
        bool operator==(const Hash<T> & b) const;
        bool operator<(const Hash<T> & b) const;

};


template<typename T> 
inline std::ostream & operator<<(std::ostream & os, const Hash<T> & h)
{
    os << h.str(); return os;
}


class Dn
{
    public:
        static Dn * create(const string & type, const string & str,
                           bool calculate = false);

        virtual er::Code init(const string & str, bool calculate = false) = 0;

        virtual int getSize(void) const = 0;
        virtual string str(void) const = 0;
        virtual ~Dn() {}
        virtual const char * hashNameLong() = 0;
};

template<class T>
class DnT : public Dn
{
    public:

        Hash<T> hash;

        DnT() {}
        er::Code init(const string & str, bool calculate = false) { return hash.init(str, calculate); }

        ~DnT() {}

        int getSize(void) const { return T::SIZE; }
        string str(void) const { return hash.str(); }

        const Hash<T> & getH() const { return hash; }
        const char * hashNameLong() { return T::nameLong(); }

        bool operator<(const DnT<T> & b) const { return hash < b.hash; }
};


} // db

#endif
