// Hasq Technology Pty Ltd (C) 2013-2015

#include <algorithm>

#include "gl_except.h"
#include "gl_utils.h"

#include "ma_dag.h"


ma::Dag::Dag(const string & name, int nnbs): numberNbs(nnbs) { add(name, false); }

ma::Dag::~Dag()
{
    while ( !nodes.empty() )
    {
        delete nodes.back();
        nodes.pop_back();
    }
}

void ma::Dag::add(const string & name, bool lck)
{
    Node * n = find(name);
    if (!n)
        nodes.push_back(new Node(name, lck));
    else
        n->locked = lck;
}

ma::Node * ma::Dag::find(const string & name)
{
    for ( size_t i = 0; i < nodes.size(); i++ )
        if ( name == nodes[i]->name ) return nodes[i];

    return 0;
}

void ma::Dag::link(const string & n1, const string & n2)
{
    Node * o1 = find(n1);
    Node * o2 = find(n2);

    if ( !o1 || !o2 ) return;

    o1->add(o2);
}

void ma::Dag::uncommit(Dag::Modify vs)
{
    Modify r = { vs.gain, vs.drop };
    commit(r);
}

void ma::Dag::commit(Dag::Modify vs)
{
    if ( !vs.drop && !vs.gain ) return;

    Nodes & nbs = me()->nbs;

    if ( vs.drop && vs.gain )
    {
        for ( size_t i = 0; i < nbs.size(); i++ )
        {
            if ( nbs[i] != vs.drop ) continue;

            nbs[i] = vs.gain;
            return;
        }
    }

    else if ( !vs.drop )
    {
        nbs.push_back(vs.gain);
    }

    else if ( !vs.gain )
    {
        for ( size_t i = 0; i < nbs.size(); i++ )
        {
            if ( nbs[i] != vs.drop ) continue;

            nbs.erase( nbs.begin() + i );
            return;
        }
    }

    else
        throw gl::Never(__FUNCTION__);
}

ma::Dag::Modify ma::Dag::evaluate1()
{
    Value value0 = setLevels();

    Nodes & nbs = me()->nbs;
    Nodes farns = getNodesAtLevel(value0.maxLevel);

    Modify m_min = {0, 0};
    Value value_min = value0;

    if ( (int)nbs.size() < numberNbs )
    {
        for ( size_t j = 0; j < farns.size(); j++ )
        {
            Modify r = { 0, farns[j] };

            commit(r);
            Value value = setLevels();
            uncommit(r);

            if ( value < value_min )
            {
                value_min = value;
                m_min = r;
            }
        }
    }

    for ( size_t i = 0; i < nbs.size(); i++ )
    {
        if ( nbs[i]->locked ) continue;

        for ( size_t j = 0; j < farns.size(); j++ )
        {
            Modify r = { nbs[i], farns[j] };
            if ( r.drop == r.gain ) continue;

            commit(r);
            Value value = setLevels();
            uncommit(r);

            if ( value < value_min )
            {
                value_min = value;
                m_min = r;
            }
        }
    }

    return m_min;
}

void ma::Dag::evaluate()
{
    while (1)
    {
        Modify m = evaluate1();
        if ( !m.gain ) return;
        commit(m);
    }
}

bool ma::Dag::Value::operator<(const Value & v)
{
    if ( maxLevel < v.maxLevel ) return true;
    if ( maxLevel > v.maxLevel ) return false;
    return n < v.n;
}

ma::Nodes ma::Dag::getNodesAtLevel(unsigned level) const
{
    Nodes ns;

    for ( size_t i = 0; i < nodes.size(); i++ )
        if ( level == nodes[i]->level ) ns.push_back(nodes[i]);

    return ns;
}

namespace ma { void flood(ma::Node *); }

ma::Dag::Value ma::Dag::setLevels()
{
    for ( size_t i = 0; i < nodes.size(); i++ )
        nodes[i]->level = Node::TOOBIG;

    me()->level = 0;
    flood(me());

    return claculateValue();
}


ma::Dag::Value ma::Dag::claculateValue() const
{
    Value v = { 0, 0 };

    for ( size_t i = 0; i < nodes.size(); i++ )
    {
        unsigned lev = nodes[i]->level;
        if ( lev < v.maxLevel ) continue;
        if ( lev == v.maxLevel ) { ++v.n; continue; }

        v.maxLevel = lev;
        v.n = 1;
    }

    return v;
}

void ma::flood(ma::Node * n)
{
    const unsigned lev = n->level + 1;
    ma::Nodes & nbs = n->nbs;

    for ( size_t i = 0; i < nbs.size(); i++ )
    {
        ma::Node * b = nbs[i];
        if ( b->level <= lev ) continue;
        b->level = lev;
        flood(b);
    }
}


void ma::Node::add(Node * o)
{
    if ( gl::isin(nbs, o) )
        return;

    nbs.push_back(o);
}
