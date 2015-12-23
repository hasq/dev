// Hasq Technology Pty Ltd (C) 2013-2015

#include <iostream>
#include <sstream>
#include <string>
#include <initializer_list>

#include "ma_dag.h"

string printnbs(ma::Dag & r)
{
    const std::vector<ma::Node *> & nbs = r.me()->nbs;

    string rt =  r.me()->name + ":";

    for ( size_t i = 0; i < nbs.size(); i++ )
        rt += " " + nbs[i]->name;

    return rt;
}

int main()
try
{
    void test01(); test01();
    void test02(); test02();
    void test03(); test03();
    void test04(); test04();
}
catch (const char * e)
{
    std::cout << "Error: " << e << "\n";
    return 1;
}
catch (...)
{
    std::cout << "Unknown error\n";
    return 2;
}

typedef const char * name_t;
struct Link { name_t fr, to; };
struct Nodb { name_t n; bool lck; };

typedef std::initializer_list<Nodb> Nodbs;
typedef std::initializer_list<Link> Links;

// cl16 does not yet support initializer_list
string proc_i(int mx, Nodbs n, Links s)
{
    ma::Dag r(n.begin()[0].n, mx);

    for ( size_t i = 1; i < n.size(); i++ )
    {
        Nodb a = n.begin()[i];
        r.add(a.n, a.lck);
    }

    for ( size_t i = 0; i < s.size(); i++ )
    {
        Link a = s.begin()[i];
        r.link(a.fr, a.to);
    }

    return printnbs(r);
}

string proc(int mx, const char ** v, bool eval)
{
    ma::Dag r(*v, mx);

    while ( *++v )
    {
        const char * p = *v;
        bool lck = false;
        if ( p && p[0] == 'x' ) lck = true;
        r.add(*v, lck);
    }

    while ( *++v )
    {
        const char * p = *v;
        r.link(p, *++v);
    }

    if (eval) r.evaluate();
    return printnbs(r);
}

void test01()
{
    const char * v[] = { "1", "2", "3", "4", "5", "6", "7", nullptr,
                         "1", "2",
                         "1", "4",
                         "2", "3",
                         "3", "4",
                         "7", "6",
                         "6", "5",
                         nullptr
                       };

    std::cout << proc(3, v, 0) << '\n';
    string rt = proc(3, v, 1);
    std::cout << rt << '\n';
    if ( rt != "1: 2 4 7" ) throw __FUNCTION__;
}

void test03()
{
    const char * v[] = { "1", "2", "x3", "4", "5", "6", "7", nullptr,
                         "1", "x3",
                         "1", "4",
                         "2", "x3",
                         "x3", "4",
                         "7", "6",
                         "6", "5",
                         nullptr
                       };

    std::cout << proc(3, v, 0) << '\n';
    string rt = proc(3, v, 1);
    std::cout << rt << '\n';
    if ( rt != "1: x3 2 7" ) throw __FUNCTION__;
}

void test02()
{
    const char * v[] = { "1", "2", "3", "4", "5", "6", "7", nullptr,
                         "1", "2",
                         "2", "3",
                         "3", "4",
                         "4", "5",
                         "5", "6",
                         "6", "7",
                         nullptr
                       };

    std::cout << proc(3, v, 0) << '\n';
    string rt = proc(3, v, 1);
    std::cout << rt << '\n';
    if ( rt != "1: 2 4 6" ) throw __FUNCTION__;
}

void test04()
{
    const char * v[] = { "1", "2", "3", "4", "5", "6", "7", nullptr,
                         "1", "4",
                         "2", "3",
                         "3", "4",
                         "4", "7",
                         "5", "6",
                         "6", "7",
                         nullptr
                       };

    std::cout << proc(3, v, 0) << '\n';
    string rt = proc(3, v, 1);
    std::cout << rt << '\n';
    if ( rt != "1: 4 2 5" ) throw __FUNCTION__;
}

