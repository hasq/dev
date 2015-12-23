// Hasq Technology Pty Ltd (C) 2013-2015

#include <iostream>
#include <sstream>
#include <string>

#include "unumber/cunum_def_4096.h"
#include "unumber/unumber.h"

typedef Unum_4096 Unumbex;

int main()
try
{
    void test01(); test01();
}
catch (char * param)
{
    std::cout << "Error: " << param << "\n";
    return 1;
}

catch (...)
{
    std::cout << "Error!\n";
    return 1;
}


void f(Unumber & x, const Unumber & m)
{
    x = x.mul(x, m);
    if ( x.getbit(0) )
    {
        std::cout << '\'';
        --x;
    }
}

void test01()
{
    Unumber m("13843", Unumber::Decimal);

    Unumber a(4), b(2);

    while (a != b)
    {
        f(a, m);
        std::cout << ' ' << a << ' ';
        f(a, m);
        std::cout << a << std::flush;
        f(b, m);
    }

    std::cout << "\na=" << a << '\n';
}

