// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_RECORD
#define _HQ_RECORD

#include <string>
#include <istream>
#include <list>

#include "gl_err.h"
#include "gl_defs.h"
#include "gl_utils.h"
#include "hq_hash.h"

using std::string;

namespace db
{
class Traits;

struct keyInfo
{
    string key; // hash or [pwd]
    int rnd;
};

typedef std::list<keyInfo> keyList;

struct parseInfo
{
    gl::intint N;
    string     S;     // hash or [raw DN]
    keyList    K;
    string     D;
};

class Record
{
    public:

        static Record * create(const string & typ);

        virtual Record * clone() const = 0;

        virtual er::Code init(std::istream & is, int nG, const string magic = "") = 0;
        virtual er::Code init(const string & s, int nG, const string magic = "") = 0;

        virtual bool checkSign(const string &) = 0;

        virtual string str(void) const = 0;
        virtual const string & data(void) const = 0;
        virtual ~Record() {}

        virtual const char * type() const = 0;
        virtual gl::intint n() const = 0;
        virtual string dnstr(void) const = 0;

        virtual er::Code validate(const Record & previous, const string & magic) const = 0;

        virtual bool same(const Record * r2, bool onlycore) const = 0;
};

template<class H>
class RecordT : public Record
{
        gl::intint       N;
        H                S;
        H                K;
        std::vector<H>   G;
        H                O;
        string           D;

    private:

        void strCore(std::ostringstream & os) const;

        er::Code parse(std::istream & is, int nG, parseInfo & pi);
        er::Code init(const parseInfo & pi, const string magic);

    public:

        er::Code init(std::istream & is, int nG, const string magic = "");
        er::Code init(const string & s, int nG, const string magic = "");

        RecordT() {}
        bool checkSign(const string &);

        ~RecordT() {};

        string dnstr() const { return S.str(); }
        const H & dn() const { return S; }
        gl::intint n() const { return N; }

        const string & data(void) const { return D; }
        void trimData(int size) { D = D.substr(0, size); }
        string str(void) const;
        string strCore() const;

        const char * type() const { return H::BaseType::name(); }

        er::Code validate(const Record & previous, const string & magic) const;
        er::Code validate(const RecordT<H> & previous, const string & magic) const;

        // these are core functions of record chaining
        static H nsk(gl::intint N, H S, const string & k, const string & magic);
        static string nskstr(gl::intint N, const string S, const string & k, const string & magic);
        static H nsk(gl::intint N, H S, H x, const string & magic) { return nsk(N, S, x.str(), magic); }

        static RecordT<H> makeFromPasswd(gl::intint N, int nG, const string & rawDn, const string & passwd,
                                         const string & magic, const string & data);
        static RecordT<H> makeFromURF(gl::intint N, int nG, const string & hashOrRawDn,
                                      const string & magic, const string & keysAndData);

        bool same(const Record * r2, bool onlycore) const;
        bool same(const RecordT<H> & r, bool onlycore) const;
        bool operator==(const RecordT<H> & b) const { return same(b, false); }

        RecordT<H> * clone() const { return new RecordT<H>(*this); }
};

} // db

#endif
