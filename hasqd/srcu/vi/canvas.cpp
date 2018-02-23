// Hasq Technology Pty Ltd (C) 2013-2015

#include <algorithm>
#include <iostream>

#include "os_filesys.h"

#include "hq_config.h"

#include "canvas.h"

Canvas::Canvas(const string & b, XY a): base(b), sz(a)
{
    os::Path p(base);

    if ( p.isdir() )
        throw gl::ex("Directory exists: " + base);

    p.mkdir();

    hint = "-lnqc tcp_port=$port_xy db=$db_xy";
}

void Canvas::initDbs()
{
    for ( int i = 0; i < sz.x(); i++ )
    {
        for ( int j = 0; j < sz.y(); j++ )
        {
            XY a(i, j);
            if ( getCellPath( a ).isdir() )
            {
                db::DbCfg cfg;
                cfg.addBase( getCellPath( a ) );
                db::Database d(cfg);
                d.initFromDisk();
                db::Database::vtraits vt = d.getTraits();
                for ( unsigned k = 0; k < vt.size(); k++ )
                {
                    dbs[a].add(vt[k]->sn());
                }
            }
        }
    }
}

void Canvas::initNodes(int nn, std::istream & is)
{
    for ( int i = 0; i < nn; i++ )
    {
        XY xy;
        is >> xy;
        string cmd; is >> cmd;
        if ( cmd != "[" ) throw gl::ex("File corrupted: expected [cmd]");
        cmd.clear();
        while (1)
        {
            string s;
            is >> s;
            if ( s == "]" ) break;
            if ( !is ) throw gl::ex("File corrupted: bad [cmd]");
            if ( cmd.empty() ) cmd = s;
            else cmd += " " + s;
        }

        nodes[xy] = new Node(cmd);
        REPORT(nodes[xy]);
    }
}

Canvas::Canvas(std::istream & is)
{
    std::getline(is, base);
    std::getline(is, hint);

    os::Path p(base);

    if ( !p.isdir() )
        throw gl::ex("Directory access denied: " + base);

    is >> sz;
    int nn = -1;
    is >> nn;
    if ( nn < 0 ) ;
    else if ( !is ) ;
    else if ( sz.x() < 0 || sz.x() > 1000000 ) ;
    else if ( sz.y() < 0 || sz.y() > 1000000 ) ;
    else
    {
        initDbs();
        initNodes(nn, is);
        return;
    }

    throw gl::ex("File corrupted: bad sz or nn");
}



void Canvas::save(std::ostream & os)
{
    os << base << '\n';
    os << hint << '\n';
    os << sz << '\n';

    os << nodes.size() << '\n';

    mxn::iterator i = nodes.begin();

    for ( ; i != nodes.end(); i++ )
    {
        os << i->first << '\n';
        os << "[ " << i->second->getCmd() << " ]\n";
    }
}


Node * Canvas::node(XY p)
{
    std::map<XY, Node *>::iterator i = nodes.find(p);

    if ( i == nodes.end() ) return 0;
    return i->second;
}

const Node * Canvas::node(XY p) const
{
    std::map<XY, Node *>::const_iterator i = nodes.find(p);

    if ( i == nodes.end() ) return 0;
    return i->second;
}

unsigned short Canvas::numerator(XY p) const
{
    int x = p.x() + p.y() * sz.x();
    return static_cast<unsigned short>(x);
}

unsigned short Canvas::xy2port(XY p) const
{
    return Config(0, 0).seIpLink.getPort() + numerator(p);
}

void Canvas::addNode(XY p, const string & s)
{
    if ( node(p) ) return;
    nodes[p] = new Node( getCmd(p, s) );
}

Canvas::~Canvas()
{
    while ( !nodes.empty() )
    {
        delete nodes.begin()->second;
        nodes.erase(nodes.begin());
    }
}

string Canvas::getCmd(XY x, const string & s) const
{
    string r = s;
    gl::replaceAll(r, "$port_xy", gl::tos(xy2port(x)));
    gl::replaceAll(r, "$db_xy", getCellPath(x).str());
    return r;
}


os::Path Canvas::getCellPath(XY p) const
{
    os::Path r = base;
    r += "db_" + gl::tos(p.x()) + "_" + gl::tos(p.y());
    return r;
}

void Canvas::addDb(XY p, const string & tfile)
{

    db::DbCfg cfg;
    cfg.addBase( getCellPath(p) );

    db::Database db(cfg);

    db::Traits t(db);

    if ( !t.load(tfile) )
        throw gl::ex("Bad traits file " + tfile);

    t.save();

    dbs[p].add(t.sn());
}

void Canvas::addDb(XY p, const string & uN, const string & sN, const string & fN,
                   int nG, const string & mag, int asz, int th)
{
    db::DbCfg cfg;
    cfg.addBase( getCellPath(p) );

    db::Database db(cfg);

    db::Traits t(db, uN, sN, fN, nG, mag, asz, th, "-1");
    // "-1" - unlimited data

    t.save();

    dbs[p].add(t.sn());
    dbs[p].unique();
}

void Canvas::Db::unique()
{
    std::sort( v.begin(), v.end() );
    std::vector<string>::iterator it = std::unique( v.begin(), v.end() );
    v.resize( std::distance(v.begin(), it) );
}


void Canvas::delNode(XY p)
{
    if ( !node(p) ) return;
    delete nodes[p];
    nodes[p] = 0;
    nodes.erase(p);
    conns[p].clear();
}

Canvas::ActivityMap Canvas::stat()
{
    ActivityMap s;

    for ( int i = 0; i < sz.x(); i++ )
    {
        for ( int j = 0; j < sz.y(); j++ )
        {
            XY a(i, j);
            Node * n = node(a);
            if ( !n ) continue;
            char c = n->activity();
            if ( !c ) continue;

            pubdata[a] = n->getPubdata();
            s.m[a] = c;
        }
    }

    return s;
}

bool Canvas::ActivityMap::operator==(const Canvas::ActivityMap & s) const
{
    std::map<XY, char>::size_type asz = m.size();
    if ( asz != s.m.size() ) return false;

    std::map<XY, char>::const_iterator i = m.begin();
    std::map<XY, char>::const_iterator j = s.m.begin();

    for ( ; i != m.end() && j != s.m.end(); i++, j++ )
    {
        if ( i->first != j->first ) return false;
        if ( i->second != j->second ) return false;
    }

    return true;
}

string Canvas::send(XY p, const string & cmd)
{
    Node * n = node(p);
    if ( !n ) throw gl::ex("Bad node");
    return n->send(cmd);
}

int Canvas::refreshAllConn()
{
    int sum = 0;

    for ( int i = 0; i < sz.x(); i++ )
    {
        for ( int j = 0; j < sz.y(); j++ )
        {
            sum += refreshConn(XY(i, j));
        }
    }

    return sum;
}

int Canvas::refreshConn(XY p)
{
    Node * n = node(p);
    if ( !n )
    {
        conns[p].clear();
        return 0;
    }

    if ( !n->refreshConn() )
    {
        if ( n->exited() )
            delNode(p);
        else
            throw gl::ex("Canvas::refreshConn: bad reply x:$1 y:$2"
                         , gl::tos(p.x()), gl::tos(p.y()));
    }

    Node::vus & ports = n->port_friends;
    vx & xys = conns[p];
    xys.clear();

    for ( Node::vus::size_type i = 0; i < ports.size(); i++ )
    {
        XY a = port2xy( ports[i] );
        xys.push_back(a);
    }

    return static_cast<int>(xys.size());
}

XY Canvas::port2xy(unsigned short x) const
{
    x -= Config(0, 0).seIpLink.getPort();
    return numerator(x);
}

XY Canvas::numerator(unsigned short n) const
{
    int x = n % sz.x();
    int y = n / sz.x();

    if ( y >= sz.y() )
        throw gl::ex("Canvas::numerator: index out of bounds");

    return XY(x, y);
}


string Canvas::select(XY p)
{
    Node * n = node(p);
    if ( !n ) return "";
    n->select();
    n->selected();
    string r;
    if ( n->selected() ) r = "Selected ";
    r += gl::tos(p.x()) + "x" + gl::tos(p.y());
    r += "  port=" + gl::tos( xy2port(p) );
    return r;
}

bool Canvas::areSomeOtherSelected(XY p) const
{
    for ( int i = 0; i < sz.x(); i++ )
    {
        for ( int j = 0; j < sz.y(); j++ )
        {
            XY a(i, j);
            if ( a == p) continue;
            const Node * n = node(a);
            if ( !n ) continue;
            if ( n->selected() ) return true;
        }
    }

    return false;
}

void Canvas::createConnection(XY p, XY a)
{
    Node * me = node(p);
    if ( !me ) throw gl::Never("createConnections: bad input");
    const Node * na = node(a);
    if ( !na ) return;

    string cmd = "connect 127.0.0.1:" + gl::tos(na->port_mine);
    me->send(cmd);
}

void Canvas::createConnections(XY p)
{

    Node * me = node(p);
    if ( !me ) throw gl::Never("createConnections: bad index");

    for ( int i = 0; i < sz.x(); i++ )
    {
        for ( int j = 0; j < sz.y(); j++ )
        {
            XY a(i, j);
            if ( a == p) continue;
            const Node * n = node(a);
            if ( !n ) continue;
            if ( !n->selected() ) continue;
            createConnection(p, a);
        }
    }
}

void Canvas::interconnectSelected()
{
    for ( int i = 0; i < sz.x(); i++ )
    {
        for ( int j = 0; j < sz.y(); j++ )
        {
            XY a(i, j);
            const Node * n = node(a);
            if ( !n ) continue;
            if ( !n->selected() ) continue;
            createConnections(a);
        }
    }
}

void Canvas::toggleSelected()
{
    for ( int i = 0; i < sz.x(); i++ )
    {
        for ( int j = 0; j < sz.y(); j++ )
        {
            XY a(i, j);
            Node * n = node(a);
            if ( n ) n->select();
        }
    }
}

void Canvas::crossOne(XY p)
{
    if ( p.x() > 0 ) createConnection(p, XY( p.x() - 1, p.y() ));
    if ( p.y() > 0 ) createConnection(p, XY( p.x(), p.y() - 1 ));
    if ( p.x() + 1 < sz.x() ) createConnection(p, XY( p.x() + 1, p.y() ));
    if ( p.y() + 1 < sz.y() ) createConnection(p, XY( p.x(), p.y() + 1 ));
}

void Canvas::crossAll(callback cb)
{
    for ( int i = 0; i < sz.x(); i++ )
    {
        for ( int j = 0; j < sz.y(); j++ )
        {
            XY a(i, j);
            const Node * n = node(a);
            if ( !n ) continue;
            crossOne(a);
            if ( cb ) (*cb)( gl::tos(i) + 'x' + gl::tos(j) + " (" + n->id() + ")");
        }
    }
}


void Canvas::startInAll(callback cb)
{
    for ( int j = 0; j < sz.y(); j++ )
    {
        for ( int i = 0; i < sz.x(); i++ )
        {
            XY a(i, j);
            Node * n = node(a);
            if ( n ) continue;

            try { n = new Node( getCmd(a) ); }
            catch (gl::ex e)
            {
                throw gl::ex( e.str() + " Position: " + gl::tos(i) + 'x' + gl::tos(j) );
            }

            nodes[a] = n;
            if ( cb ) (*cb)( gl::tos(i) + 'x' + gl::tos(j) + " (" + n->id() + ")");
        }
    }
}

void Canvas::stopInAll(callback cb)
{
    for ( int j = 0; j < sz.y(); j++ )
    {
        for ( int i = 0; i < sz.x(); i++ )
        {
            delNode(XY(i, j));
            if ( cb ) (*cb)( gl::tos(i) + 'x' + gl::tos(j) );
        }
    }
}

void Canvas::dbmak(const string & tfile)
{
    if ( !nodes.empty() )
        throw gl::ex("Cannot create databases when nodes are running; shutdown all nodes first");

    for ( int i = 0; i < sz.x(); i++ )
    {
        for ( int j = 0; j < sz.y(); j++ )
        {
            addDb(XY(i, j), tfile);
        }
    }
}

void Canvas::dbdel(callback cb)
{
    if ( !nodes.empty() )
        throw gl::ex("Cannot create databases when nodes are running; shutdown all nodes first");

    for ( int i = 0; i < sz.x(); i++ )
    {
        for ( int j = 0; j < sz.y(); j++ )
        {
            delDb(XY(i, j));
            if ( cb ) (*cb)( gl::tos(i) + 'x' + gl::tos(j) );
        }
    }
}

string Canvas::recpwd(XY p, const string & un, const string & N,
                      const string & rdn, const string & pwd)
{
    if ( p.x() < 0 )
        return recpwd( findNodeOrThrow(), un, N, rdn, pwd);

    Node * n = node(p);
    if ( !n ) throw gl::ex("Canvas::recpwd: null node");
    return n->recpwd(un, N, rdn, pwd);
}

XY Canvas::findNodeOrThrow() const
{
    for ( int j = 0; j < sz.y(); j++ )
    {
        for ( int i = 0; i < sz.x(); i++ )
        {
            XY a(i, j);
            if ( node(a) ) return a;
        }
    }
    throw gl::ex("No node exist");
}

void Canvas::addDb(callback cb, const string & uN, const string & sN, const string & fN,
                   int nG, const string & mag, int kb, int th)
{
    for ( int j = 0; j < sz.y(); j++ )
    {
        for ( int i = 0; i < sz.x(); i++ )
        {
            XY a(i, j);
            addDb(a, uN, sN, fN, nG, mag, kb, th);
            if ( cb ) (*cb)( gl::tos(i) + 'x' + gl::tos(j) );
        }
    }
}

string Canvas::Db::names() const
{
    string r;
    for ( unsigned i = 0; i < v.size(); i++ ) r += " " + v[i];
    return r;
}

void Canvas::Db::add(string s)
{
    v.push_back(s);
    std::sort(v.begin(), v.end());
}

void Canvas::inject(XY p, const string & cmd)
{
    Node * n = node(p);
    if ( !n ) throw gl::Never("Canvas::inject: Bad position");
    n->inject_list(cmd);
}

void Canvas::forceAllReo()
{
    for ( int i = 0; i < sz.x(); i++ )
    {
        for ( int j = 0; j < sz.y(); j++ )
        {
            XY a(i, j);
            forceOneReo(a);
        }
    }
}

void Canvas::forceOneReo(XY p)
{
    Node * n = node(p);
    if ( n ) n->reorg();
}


