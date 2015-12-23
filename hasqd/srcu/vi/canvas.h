// Hasq Technology Pty Ltd (C) 2013-2015

#ifndef CANVAS_H
#define CANVAS_H

#include <istream>
#include <ostream>
#include <map>
#include <string>

#include "xy.h"
#include "node.h"

using std::string;

class Canvas
{
    public:
        class Db
        {
                std::vector<string> v;
            public:
                Db() {}
                bool empty() const { return v.empty(); }
                int size() const { return static_cast<int>(v.size()); }
                string name(int i) const { return v.at(i); }
                void add(string s);
                string names() const;
                void unique();
        };


        struct ActivityMap
        {
            typedef std::map<XY, char> mxc;
            mxc m;
            bool operator==(const ActivityMap &) const;
        };

        typedef std::map<XY, Node *> mxn;
        typedef std::map<XY, Db> mxd;
        typedef std::vector<XY> vx;
        typedef std::map<XY, vx > mxvx;

        mxvx conns;

        typedef std::map<XY, PubData> PubdataMap;
        PubdataMap pubdata;

        string hint; // command line to start publishers

    private:

        string base;
        XY sz;

        mxn nodes;
        mxd dbs;

        unsigned short numerator(XY p) const;
        XY numerator(unsigned short x) const;

        void initDbs();
        void initNodes(int nn, std::istream & is);

        XY findNodeOrThrow() const;

    public:

        Canvas(const string & b, XY a);
        Canvas(std::istream & is);
        ~Canvas();

        void save(std::ostream & os);

        XY size() const { return sz; }

        Node * node(XY p);
        const Node * node(XY p) const;
        Db db(XY p) { return dbs[p]; }

        unsigned short xy2port(XY p) const;
        XY port2xy(unsigned short x) const;

        typedef void (*callback)(string);

        void delNode(XY p);
        void addNode(XY p, const string & cmd);
        void addNode(XY p) { addNode( p, hint ); }
        void addDb(XY p, const string & tfile);
        void delDb(XY p) { dbs.erase(p); getCellPath(p).erase(); }
        void addDb(XY p, const string & uN, const string & sN, const string & fN,
                   int nG, const string & mag, int asz, int th);
        void addDb(callback, const string & uN, const string & sN, const string & fN,
                   int nG, const string & mag, int asz, int th);

        string getCmd(XY p, const string & s) const;
        string getCmd(XY p) const { return getCmd(p, hint); }

        os::Path getCellPath(XY p) const;
        ActivityMap stat();
        PubdataMap getPubdata() { return pubdata; }

        string send(XY p, const string & cmd);
        int refreshAllConn();
        int refreshConn(XY p);

        string select(XY p);
        bool areSomeOtherSelected(XY p) const;
        void createConnections(XY p);
        void interconnectSelected();
        void toggleSelected();
        void crossOne(XY p);
        void crossAll(callback);
        void startInAll(callback);
        void stopInAll(callback);
        void dbmak(const string & tfile);
        void dbdel(callback);
        void forceAllReo();
        void forceOneReo(XY p);
        void createConnection(XY p, XY a);

        string recpwd(XY p, const string & un, const string & N, const string & rdn, const string & pwd);

        template <class T>
        void addDbAll(T t)
        {
            addDb(t, "_wrd", "wrd", "Md5-2bytes", 1, "", 100, 0);
            addDb(t, "_md5", "md5", "MD5",        1, "", 100, 0);
            addDb(t, "_s22", "s22", "SHA2-256",   1, "", 100, 0);
            addDb(t, "_s25", "s25", "SHA2-512",   1, "", 100, 0);
            addDb(t, "_r16", "r16", "RIPEMD-160", 1, "", 100, 0);
            //addDb(t,"_s3x","s3x","SHA3",       1,"",100,0);
        }


        void inject(XY p, const string & cmd);


    private:
        Canvas(const Canvas &);
        void operator=(const Canvas &);
};

#endif

