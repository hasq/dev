// Hasq Technology Pty Ltd (C) 2013-2015

#ifndef _MA_DAG_H
#define _MA_DAG_H

#include <string>
#include <vector>
//#include <limits>
#include <climits>

using std::string;

namespace ma
{


struct Node;
typedef std::vector<Node *> Nodes;

struct Node
{
    string name;
    Nodes nbs;
    unsigned level;
    bool locked;

    //static const unsigned TOOBIG = std::numeric_limits<unsigned>::max();
    static const unsigned TOOBIG = UINT_MAX;

    Node(const string & n, bool lc): name(n), locked(lc) {}
    void add(Node * o);
};

class Dag
{
        int numberNbs;
        Nodes nodes;

        Node * find(const string & name);

        struct Modify
        {
            Node * drop;
            Node * gain;
        };

        Modify evaluate1();
        void commit(Modify r);
        void uncommit(Modify r);

    public:

        Dag(const string & name, int nnbs);
        ~Dag();

        void add(const string & name, bool lck);
        void link(const string & n1, const string & n2);

        Node * me() { return nodes[0]; }
        void evaluate();

        struct Value
        {
            unsigned maxLevel;
            int n;
            bool operator<(const Value & v);
        };

        Value setLevels();
        Nodes getNodesAtLevel(unsigned level) const;
        Value claculateValue() const;

    private:
        Dag(const Dag &);
        void operator=(const Dag &);
};

} // ma

#endif


