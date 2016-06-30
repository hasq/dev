// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_CONFLICT
#define _HQ_CONFLICT

#include <vector>
#include <map>
#include <string>

#include "hq_record.h"

#include "hq_globalspace.h"
#include "hq_connector.h"


class Branch
{
        std::vector<db::Record *> recs;

    public:
        // default
        //Branch(const Branch &);
        //void operator=(const Branch &);

    public:
        Branch() {}
        ~Branch() {}
        void destroy();

        bool empty() const { return recs.empty(); }
        size_t size() const { return recs.size(); }
        void push_back(db::Record * r) { recs.push_back(r); }

        void setv(const std::vector<db::Record *> & vr) { destroy(); recs = vr; }
        void set0() { destroy(); recs.clear(); }

        db::Record * at(size_t i) { return recs[i]; }
        const db::Record * at(size_t i) const { return recs[i]; }
        void setNormalOrder();

        bool match(const Branch & b) const;
        bool grow(const Branch & b);
};


class CflGroups
{
        struct Group
        {
            Branch branch;
            std::set<string> nids;
        };

        GlobalSpace * gs;
        std::vector<Group> groups;
        const std::vector<Connection> * family;


        CflGroups(const CflGroups &);
        void operator=(const CflGroups &);

    public:
        CflGroups(GlobalSpace * g, const std::vector<Connection> * f): gs(g), family(f) {}

        bool add(const Branch & br, const string & nid); // returns modifies
        size_t getHighestGroup() const;
        std::vector<size_t> getHighGroups() const;

        bool isin(const string & nid, size_t idx) const;
        void flatten();

        string getHighestNid(const std::vector<size_t> & vih) const;
        string translate2nodename(const string &) const;

        Branch getBranch(size_t i) const { return groups[i].branch; }
};


class Conflictor
{
        GlobalSpace * gs;
        const int idx;
        const string sdn;
        Connector connector;

        Branch mine; // has at least one last record
        typedef std::map<string, Branch> msb;
        msb nodes; // have at least one different or new record

        std::vector<Connection> family;

        CflGroups groups;
        size_t winner;

        std::vector<db::Record *> toadd;

    public:
        Conflictor(GlobalSpace * g, int i, const string & s);
        ~Conflictor();

        bool empty() const { return mine.empty(); }

        void tree();
        void vote();
        bool iwin() const;
        void cut();

        void addrecords();
        void sendconflict();

        static bool compare2recs(const db::Record * r1, const db::Record * r2);

    private:
        void tree_node_behind(const string & nid);
        void tree_node_descent(const string & nid, db::Record * r, size_t bk);

        db::Record * cached(size_t i);

    private:
        Conflictor(const Conflictor &);
        void operator=(const Conflictor &);

};


#endif
