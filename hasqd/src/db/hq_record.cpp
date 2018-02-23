// Hasq Technology Pty Ltd (C) 2013-2016

#include <sstream>

#include "gl_defs.h"
#include "gl_err.h"
#include "gl_except.h"

#include "ma_utils.h"

#include "hq_record.h"
#include "hq_db.h"

db::Record * db::Record::create(const string & typ)
{
    Record * r = 0;
    if (typ == Md5::name() )            r = new db::RecordT<Hash<Md5> >();
    else if (typ == Sha256::name() )    r = new db::RecordT<Hash<Sha256> >();
    else if (typ == Sha512::name() )    r = new db::RecordT<Hash<Sha512> >();
    else if (typ == Word::name() )      r = new db::RecordT<Hash<Word> >();
    else if (typ == RipeMd160::name() ) r = new db::RecordT<Hash<RipeMd160> >();
    else if (typ == Smd::name() )      r = new db::RecordT<Hash<Smd> >();
    else return 0;

    REPORT(r);
    return r;
}

template<class H>
er::Code db::RecordT<H>::init(std::istream & is, int nG, const string magic)
{
    parseInfo pi;

    er::Code r = parse(is, nG, pi);
    if ( r != er::OK )
        return r;

    return init(pi, magic);
}

template<class H>
er::Code db::RecordT<H>::init(const string & s, int nG, const string magic)
{
    std::istringstream is(s);
    return init(is, nG, magic);
}

template<class H>
void db::RecordT<H>::strCore(std::ostringstream & os) const
{
    os << N << ' ' << S << ' ' << K;

    typedef typename std::vector<H>::size_type vhi;

    vhi sz = G.size();
    for (vhi i = 0; i < sz; i++)
        os << ' ' << G[i];

    os << ' ' << O;
}

template<class H>
string db::RecordT<H>::strCore() const
{
    std::ostringstream os;
    strCore(os);
    return os.str();
}

template<class H>
er::Code db::RecordT<H>::parse(std::istream & is, int nG, parseInfo & pi)
{
    string token, s;
    string::size_type pos1, pos2;

    is >> token;
    if ( is.fail() || !ma::checkDec(token.c_str(), gl::st2i(token.size())) )
        return er::REC_INIT_BAD_N;
    pi.N = gl::toi(token);
    if ( pi.N < 0 )
        return er::REC_INIT_BAD_N;

    is >> pi.S;
    if ( is.fail() || (pi.S[0] == '[' && pi.S[pi.S.size() - 1] != ']') )
        return er::REC_INIT_BAD_S;

    pi.K.clear();
    while ((int)pi.K.size() < nG + 2)
    {
        keyInfo k;
        int n;

        is >> token;
        if ( is.fail() ) break;

        if ( token[0] == '[' )
        {
            pos1 = token.find_first_of(']');
            if ( pos1 == token.npos || pos1 == 1 )
                return er::URF_BAD_FORMAT;
            k.key = token.substr(0, pos1 + 1);

            pos2 = token.find_first_of(':', ++pos1);
            if ( pos2 == token.npos )
            {
                k.rnd = 0;
                if ( token.size() > pos1 )
                {
                    s = token.substr(pos1, token.size() - pos1);
                    if ( !ma::checkDec(s.c_str(), gl::st2i(s.size())) )
                        return er::URF_BAD_FORMAT;
                    k.rnd = gl::toi(s);
                    if ( k.rnd < 0 )
                        return er::URF_BAD_FORMAT;
                }
                n = nG + 2 - gl::st2i(pi.K.size());
                for ( int i = 0; i < n; i++ )
                    pi.K.push_back(k);
            }
            else
            {
                k.rnd = 0;
                s = token.substr(pos1, pos2 - pos1);
                if ( !s.empty() )
                    if ( !ma::checkDec(s.c_str(), gl::st2i(s.size())) )
                        return er::URF_BAD_FORMAT;
                k.rnd = gl::toi(s);
                if ( k.rnd < 0 )
                    return er::URF_BAD_FORMAT;

                if ( token.size() == ++pos2 )
                    return er::URF_BAD_FORMAT;
                s = token.substr(pos2, token.size() - pos2);
                if ( !ma::checkDec(s.c_str(), gl::st2i(s.size())) )
                    return er::URF_BAD_FORMAT;
                n = gl::toi(s);
                if ( n < 0 )
                    return er::URF_BAD_FORMAT;
                for ( int i = 0; i < n; i++ )
                    pi.K.push_back(k);
            }
        }
        else
        {
            k.key = token;
            k.rnd = 0;
            pi.K.push_back(k);
        }
    }
    if ( (int)pi.K.size() != nG + 2 )
        return er::URF_BAD_FORMAT;

    pi.D.clear();
    while (1)
    {
        is >> token;
        if ( is.fail() ) break;

        if ( pi.D.size() > 0 )
            pi.D.append(" ");
        pi.D.append(token);
    }

    string::size_type sz = pi.D.size();

    for ( string::size_type i = 0; i < sz; i++ )
        if ( pi.D[i] < ' ' || pi.D[i] > '~' )
            pi.D[i] = '.';

    return er::OK;
}

template<class H>
er::Code db::RecordT<H>::init(const parseInfo & pi, const string magic)
{
    N = pi.N;

    er::Code r = er::OK;
    if ( pi.S[0] == '[')
        r = S.init(pi.S.substr(1, pi.S.size() - 2), true);
    else
        r = S.init(pi.S, false, false);
    if ( r )
        return er::REC_INIT_BAD_S;
    string dn = S.str();

    int sz = gl::st2i(pi.K.size());
    if ( sz < 2 ) throw gl::ex("RecordT<H>::init internal error 1");

    keyList::const_iterator iter = pi.K.begin();
    string key;
    H h;

    for ( int i = 0; i < sz; i++ )
    {
        const keyInfo & ki = *iter;

        if ( ki.key[0] != '[' )
        {
            r = h.init(ki.key, false);
            if ( r )
                return er::REC_INIT_BAD_KGO;
            G.push_back(h);
        }
        else
        {
            key = ki.key.substr(1, ki.key.size() - 2);
            for ( int j = 0; j < ki.rnd; j++)
                key.append(1, std::rand() % 10 + 48);
            key = RecordT<H>::nskstr(N + i, dn, key, magic);

            for ( int j = 0; j < i; j++ )
                key = RecordT<H>::nskstr(N + i - j, dn, key, magic);

            r = h.init(key, false);
            if ( r )
                return er::REC_INIT_BAD_KGO;
            G.push_back(h);
        }
        iter++;
    }

    K = G.front(); G.erase(G.begin());
    O = G.back(); G.pop_back();

    D = pi.D;

    return er::OK;
}

template<class H>
string db::RecordT<H>::str(void) const
{
    std::ostringstream os;
    strCore(os);

    if ( !D.empty() )
        os << ' ' << D;

    return os.str();
}

template<class H>
bool db::RecordT<H>::checkSign(const string & s)
{
    if ( s.empty() ) return true;

    std::ostringstream os;
    strCore(os);

    H h(os.str());

    string::size_type sz = s.size();
    const string::size_type bsz = H::BaseType::SIZE;

    if ( sz > bsz ) sz = bsz;
    const char * v = h.accessVal();

    for ( string::size_type i = 0; i < sz; i++ )
        if ( v[i] != s[i] ) return false;

    return true;
}

template<class Hash>
Hash db::RecordT<Hash>::nsk(gl::intint N, Hash S, const string & k, const string & magic)
{
    std::ostringstream os;
    os << N << ' ' << S << ' ' << k;
    if ( !magic.empty() ) os << ' ' << magic;
    return Hash(os.str());
}

template<class Hash>
string db::RecordT<Hash>::nskstr(gl::intint N, const string S, const string & k, const string & magic)
{
    std::ostringstream os;
    string s;
    string::size_type sz;

    os << N;
    sz = os.str().length() + 1 + S.length() + 1 + k.length();
    if ( !magic.empty() )
        sz += 1 + magic.length();
    s.reserve(sz);

    s.append(os.str()).append(" ").append(S).append(" ").append(k);
    if ( !magic.empty() )
        s.append(" ").append(magic);

    return Hash(s).str();
}

template<class H>
er::Code db::RecordT<H>::validate(const Record & previous, const string & magic) const
{
    const RecordT<H> * x = dynamic_cast< const RecordT<H> * >(&previous);

    if (x)
        return validate(*x, magic);

    return er::DB_ADD_BAD_TYPE; // Never
}

template<class H>
er::Code db::RecordT<H>::validate(const RecordT<H> & previous, const string & magic) const
{
    typedef typename std::vector<H>::size_type vhi;

    if ( N != previous.N + 1 )
        return er::WRONG_SEQ_NUMBER;

    std::vector<H> pv = previous.G;
    pv.push_back(previous.O);
    std::vector<H> rv = G;
    rv.insert(rv.begin(), K);

    vhi sz = pv.size();

    if ( rv.size() != sz )
        throw gl::ex("Internal error (validate)");

    for ( vhi i = 0; i < sz; i++ )
    {
        H p = pv[i];
        H x = nsk(N, S, rv[i], magic);
        if ( p != x )
            return er::RECORD_MISMATCH;
    }

    return er::OK;
}

template<class Hash>
db::RecordT<Hash> db::RecordT<Hash>::makeFromPasswd(gl::intint N, int nG,
        const string & rawDn, const string & passwd, const string & magic,
        const string & data)
{
    //NSKGOD
    Hash S(rawDn);

    std::vector<Hash> v;
    int n = nG + 1;

    for ( gl::intint i = N + n; i >= N; i-- )
    {
        std::vector<Hash> u = v;
        v.clear();
        for ( size_t j = 0; j < u.size(); j++ )
        {
            v.push_back( RecordT<Hash>::nsk(i + 1, S, u[j].str(), magic) );
            // +1 means from the next record line
        }
        v.push_back( RecordT<Hash>::nsk(i, S, passwd, magic) );
        // key can be generated with the current N
    }

    if ( N == 0 )
        v.back().init0();

    std::ostringstream os;
    os << N << ' ' << S;
    for ( int i = 0; i <= n; i++ ) os << ' ' << v[n - i];

    if ( !data.empty() )
        os << ' ' << data;

    RecordT<Hash> record;
    er::Code r = record.init(os.str(), nG);

    if ( r ) throw gl::ex("addRecordPwd internal error: " + r.str());

    return record;
}

template<class Hash>
db::RecordT<Hash> db::RecordT<Hash>::makeFromURF(gl::intint N, int nG, const string & hashOrRawDn,
        const string & magic, const string & keysAndData)
{
    RecordT<Hash> record;
    std::ostringstream os;

    os << N << ' ' << hashOrRawDn << ' ' << keysAndData;
    record.init(os.str(), nG, magic);

    return record;
}

template<class H>
bool db::RecordT<H>::same(const Record * r2, bool onlycore) const
{
    const db::RecordT<H> * r = dynamic_cast<const db::RecordT<H> *>(r2);
    if ( !r ) return false;
    return same(*r, onlycore);
}

template<class H>
bool db::RecordT<H>::same(const RecordT<H> & b, bool onlycore) const
{
    if ( N != b.N ) return false;
    if ( S != b.S ) return false;
    if ( K != b.K ) return false;
    if ( O != b.O ) return false;

    if ( !onlycore )
    {
        if ( D != b.D ) return false;
    }

    typedef typename std::vector<H>::size_type vhi;

    vhi sz = b.G.size();
    if ( G.size() != sz ) return false;

    for ( vhi i = 0; i < sz; i++ )
        if ( G[i] != b.G[i] ) return false;

    return true;
}

#include "hq_record.inc"
