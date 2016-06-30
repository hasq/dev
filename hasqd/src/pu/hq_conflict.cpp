// Hasq Technology Pty Ltd (C) 2013-2016

#include "gl_utils.h"

#include "hq_conflict.h"

Conflictor::~Conflictor()
{
    while ( !nodes.empty() )
    {
        msb::iterator i = nodes.begin();
        i->second.destroy();
        nodes.erase(i);
    }

    mine.destroy();
}

void Branch::destroy()
{
    for ( size_t i = 0; i < recs.size(); i++ )
    {
        delete recs[i];
    }
}

Conflictor::Conflictor(GlobalSpace * g, int i, const string & s)
    : gs(g), idx(i), sdn(s), connector(g), groups(g, &family)
{
    db::Record * r = gs->database.getLast(idx, sdn);
    if ( !r ) return;

    std::vector<db::Record *> vr;
    vr.push_back(r);

    mine.setv(vr);
}


void Conflictor::tree()
{
    family = connector.getFamily_safe();

    for ( size_t i = 0; i < family.size(); i++ )
    {
        const string & nid = family[i].ipport;
        gl::intint N = mine.at(0)->n();
        bool alive = false;

        std::vector<db::Record *> recs = connector.getRangeFrom(nid, idx, sdn, N, N, &alive);

        if ( !alive )
            continue;

        if ( recs.empty() )
        {
            tree_node_behind(nid);
            continue;
        }

        if ( recs.size() != 1 )
        {
            gs->logger(Logger::Critical, "Node unexpected reply from " + nid);
            for ( size_t j = 0; j < recs.size(); j++ ) delete recs[j];
            continue;
        }

        {
            gl::Remover<db::Record> rem_rec0(recs[0]);

            if ( recs[0]->n() != N )
            {
                gs->logger(Logger::Critical, "Node bad N reply from " + nid);
                continue;
            }

            if ( compare2recs( recs[0], mine.at(0) ) )
            {
                nodes[nid].set0();
                continue;
            }

            tree_node_descent(nid, recs[0], 1);
        }
    }
}

bool Conflictor::compare2recs(const db::Record * r1, const db::Record * r2)
{
    bool onlycore = true;
    return r1->same(r2, onlycore);
}

void Conflictor::tree_node_behind(const string & nid)
{
    gl::intint last = 0; --last;
    std::vector<db::Record *> recs = connector.getRangeFrom(nid, idx, sdn, last, last, 0);
    gl::Removec<db::Record> del_recs(recs);

    if ( recs.empty() ) return;

    if ( recs.size() != 1 )
    {
        gs->logger(Logger::Critical, "Node (tree_node_behind) unexpected reply from " + nid);
        return;
    }

    gl::intint N = mine.at(0)->n();
    if ( recs[0]->n() >= N )
    {
        gs->logger(Logger::Critical, "Node (tree_node_behind) bad N reply from " + nid);
        return;
    }

    size_t n = gl::ii2st(N - recs[0]->n());

    db::Record * r = cached(n);
    if ( !r ) return; // we have no such record

    if ( compare2recs( recs[0], r ) )
    {
        nodes[nid].set0();
        return;
    }

    tree_node_descent(nid, recs[0], 1);
}

// i: 0  1   2   3  ... N-2  N-1  N
// n: N N-1 N-2 N-3 ...  2    1   0
db::Record * Conflictor::cached(size_t i)
{
    size_t sz = mine.size();
    if ( i < sz ) return mine.at(i);
    gl::intint N = mine.at(0)->n();
    gl::intint N2 = N - sz;
    gl::intint N1 = N - i;

    gl::intint wbc;
    std::vector<db::Record *> vr = gs->database.getRange(idx, sdn, N1, N2, -1, wbc);

    for ( size_t k = 0; k < vr.size(); k++ )
    {
        const size_t & j = vr.size() - k - 1;
        mine.push_back( vr[j] );
    }

    sz = mine.size();
    if ( i < sz ) return mine.at(i);

    // we have no such record
    return 0;
}

void Conflictor::tree_node_descent(const string & nid, db::Record * s, size_t bk)
{
    // at this point we know that at nid record r does not match ours
    // we have to go down until we
    // 1. reach the matching record
    // 2. reach the end in our chain
    // 3. reach the end at nid
    // Note that the state of nid may change because it may resolve its own conflict
    // record r may even disappear from nid

    gl::intint last = 0; --last;
    gl::intint n1 = s->n() - bk;
    if ( n1 < 0 ) n1 = 0;

    bool alive = true;
    std::vector<db::Record *> recs = connector.getRangeFrom(nid, idx, sdn, n1, last, 0);
    gl::Removec<db::Record> del_recs(recs);

    if ( !alive ) return;

    if ( recs.empty() ) return;

    for ( size_t j = 0; j < recs.size(); j++ )
    {

        db::Record * r = recs[j];
        gl::intint iin = (mine.at(0)->n() - r->n());

        if ( iin < 0 ) { nodes[nid].set0(); break; } // all match upto N

        db::Record * m1 = cached(gl::ii2st(iin));

        if ( !m1 ) continue;

        if ( compare2recs( m1, r ) ) continue;

        // no match

        if ( j == 0 )
        {
            // this is the first fetched record and it does not match

            if ( n1 > 0 && r->n() == n1 ) // we can go back further
            {
                bk = 13 * bk / 10 + 2;
                tree_node_descent(nid, r, bk);
                return;
            }

            // we cannot go back further - the whole chain must be set
        }

        // add all from j and on
        del_recs.disable();

        std::vector<db::Record *> vr;
        for ( size_t k = 0; k < recs.size(); k++ )
        {
            if ( k < j ) delete recs[k];
            else vr.push_back( recs[k] );
        }
        nodes[nid].setv(vr);

        break;
    }
}

void Branch::setNormalOrder()
{
    size_t sz = size();
    if ( sz < 2 ) return;

    if ( at(0)->n() < at(sz - 1)->n() ) return;

    std::vector<db::Record *> vr;

    for ( size_t i = 0; i < sz; i++ )
    {
        vr.push_back( recs[sz - i - 1] );
    }

    recs.swap(vr);
}

void Conflictor::vote()
{
    mine.setNormalOrder();

again:
    groups.flatten();
    groups.add(mine, ""); // 1st mine so matching(empty) branches would match mine

    for ( msb::iterator i = nodes.begin(); i != nodes.end(); i++ )
    {
        const string & nid = i->first;
        if ( groups.add(i->second, nid) )
            goto again;
    }

    winner = groups.getHighestGroup();
}


bool Conflictor::iwin() const
{
    return groups.isin("", winner);
}

bool CflGroups::add(const Branch & br, const string & nid)
{
    for ( size_t i = 0; i < groups.size(); i++ )
    {
        if ( !groups[i].branch.match(br) ) continue;
        groups[i].nids.insert(nid);
        return groups[i].branch.grow(br);
    }

    Group g;
    g.branch = br;
    g.nids.insert(nid);
    groups.push_back(g);
    return true;
}

bool Branch::match(const Branch & b) const
{
    if ( b.empty() ) return true;

    gl::intint n11 = recs[0]->n();
    gl::intint n12 = recs[recs.size() - 1]->n();

    gl::intint n21 = b.recs[0]->n();
    gl::intint n22 = b.recs[b.recs.size() - 1]->n();

    if ( n22 < n11 ) return false;
    if ( n12 < n21 ) return false;

    gl::intint n1 = n11;
    if ( n21 < n1 ) n1 = n21;

    gl::intint n2 = n12;
    if ( n22 > n2 ) n2 = n22;

    for ( gl::intint n = n1; n <= n2; ++n )
    {
        if ( n < n11 || n > n12 || n < n21 || n > n22 ) continue;
        size_t i1 = gl::ii2st( n - n11 );
        size_t i2 = gl::ii2st( n - n21 );

        if ( i1 >= size() ) return true;
        if ( i2 >= b.size() ) return true;

        if ( Conflictor::compare2recs( at(i1), b.at(i2) ) ) continue;
        return false;
    }

    return true;
}

bool Branch::grow(const Branch & b)
{
    if ( b.empty() ) return false;

    gl::intint n11 = recs[0]->n();
    gl::intint n12 = recs[recs.size() - 1]->n();

    gl::intint n21 = b.recs[0]->n();
    gl::intint n22 = b.recs[b.recs.size() - 1]->n();

    if ( n22 < n11 ) return false;
    if ( n12 < n21 ) return false;

    bool ret = false;

    if ( n21 < n11 )
    {
        ret = true;

        std::vector<db::Record *>::const_iterator ib = b.recs.begin(), ie = ib;

        for ( ; ie != b.recs.end(); ++ie )
            if ( (*ie)->n() == n11 ) break;

        recs.insert(recs.begin(), ib, ie);
    }

    if ( n12 < n22 )
    {
        ret = true;

        std::vector<db::Record *>::const_iterator ib = b.recs.begin(), ie = b.recs.end();

        for ( ; ib != ie; ++ib )
            if ( (*ib)->n() == n12 ) break;

        ++ib;

        recs.insert(recs.end(), ib, ie);
    }

    return ret;
}

void CflGroups::flatten()
{
again:
    for ( size_t k = 0; k < groups.size(); k++ )
    {
        size_t ibr = groups.size() - k - 1;

        for ( size_t i = 0; i < ibr; i++ )
        {
            const Branch & br = groups[ibr].branch;
            if ( !groups[i].branch.match(br) ) continue;
            // [ibr] group matches [i] group - need to merge
            std::set<string> & br_nids = groups[ibr].nids;
            groups[i].nids.insert(br_nids.begin(), br_nids.end());
            groups[i].branch.grow(br);

            for ( size_t j = ibr + 1; j < groups.size(); j++ )
                groups[j - 1] = groups[j];

            groups.pop_back();

            goto again;
        }
    }
}

size_t CflGroups::getHighestGroup() const
{
    std::vector<size_t> vih = getHighGroups();

    if ( vih.empty() ) return 0;
    if ( vih.size() == 1 ) return vih[0];

    string hn = getHighestNid(vih);

    for ( size_t i = 0; i < vih.size(); i++ )
        if ( isin(hn, vih[i]) )
            return vih[i];

    return vih[0];
}

std::vector<size_t> CflGroups::getHighGroups() const
{
    std::vector<size_t> v;

    size_t max = 0;

    for ( size_t j = 0; j < groups.size(); j++ )
    {
        size_t sz = groups[j].nids.size();
        if ( sz > max )
        {
            v.clear();
            v.push_back(j);
            max = sz;
        }
        else if ( sz == max )
            v.push_back(j);
        else {}
    }

    return v;
}

string CflGroups::getHighestNid(const std::vector<size_t> & vih) const
{
    std::set<string> nid_names;

    for ( size_t i = 0; i < vih.size(); i++ )
    {
        const std::set<string> & nids = groups[vih[i]].nids;
        nid_names.insert( nids.begin(), nids.end() );
    }

    std::set<string> node_names;
    string sw;
    for ( std::set<string>::iterator i = nid_names.begin(); i != nid_names.end(); ++i )
    {
        string tnn = translate2nodename(*i);
        node_names.insert( tnn );
        if ( tnn == *node_names.begin() ) sw = *i;
    }

    return sw;
}

string CflGroups::translate2nodename(const string & nid) const
{
    if ( nid == "" )
    {
        // myself
        return gs->config->nodename;
    }

    for ( size_t i = 0; i < family->size(); i++ )
    {
        if ( (*family)[i].ipport == nid )
            return (*family)[i].name;
    }

    return "";
}


bool CflGroups::isin(const string & nid, size_t idx) const
{
    if ( groups[idx].nids.find(nid) == groups[idx].nids.end() )
        return false;

    return true;
}

void Conflictor::cut()
{
    Branch wb = groups.getBranch(winner);

    gl::intint N = wb.at(0)->n(), last = 0; --last;

    gl::intint wbc;
    std::vector<db::Record *> vr = gs->database.getRange(idx, sdn, N, last, -1, wbc);
    gl::Removec<db::Record> del_vr(vr);

    if ( vr.empty() ) return;

    size_t i, j = 0;

    for ( i = 0; i < wb.size(); ++i )
    {
        N = wb.at(i)->n();
        if ( N < vr[0]->n() ) continue;
        if ( N > vr[0]->n() ) ++j;

        if ( !compare2recs( wb.at(i), vr[j] ) ) break;
    }

    if ( i == wb.size() ) return;

    N = wb.at(i)->n();

    gs->database.cutIndexAt(idx, sdn, N);

    for ( ; i < wb.size(); ++i )
        toadd.push_back( wb.at(i)->clone() );
}

void Conflictor::addrecords()
{
    for ( size_t i = 0; i < toadd.size(); i++ )
    {
        gs->cedArea.addJob_safe(toadd[i], idx);
    }
}

void Conflictor::sendconflict()
{
    connector.sendConflict(idx, sdn);
}


