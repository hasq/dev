// Hasq Technology Pty Ltd (C) 2013-2015

#include <iostream>
#include <sstream>
#include <string>

#include "gl_rnd.h"

#include "unumber/cunum_def_2048.h"
#include "unumber/unumber.h"

// to include other numbers generate headers and
// add function defintions to library
#include "unumber/cunum_def_128.h"
#include "unumber/unumber.h"

#include "unumber/cunum_def_4096.h"
#include "unumber/unumber.h"

typedef Unum_4096 Unumbex;

const double length = 0.995;

gl::Rnd randd;

Unumbex genun()
{
    Unumbex r(0);

//std::cout << "r " << r << "\n";

    for ( int i = 0; i < 5000; i++ )
    {
        double x = randd();
        if ( x > length ) break;
        r <<= 1;
        r += (randd() > 0.5 ? 1 : 0);
    }

    if ( r.iszero() ) return genun();

    return r;
}

int main()
try
{

    std::cout << "Size 128: " << (sizeof(Unum_128) * 8) << '\n';
    std::cout << "Size 2048: " << (sizeof(Unum_2048) * 8) << '\n';
    std::cout << "Size 4096: " << (sizeof(Unum_4096) * 8) << '\n';

    void test01(); test01();
    void test02(); test02();

    // testing bug
    void test03(); test03();
    void test04(); test04();
    void test05(); test05();
    void test06(); test06();
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

void test01()
{
    for ( int i = 0; i < 3000; i++ )
    {
        Unumbex a = genun();
        Unumbex b = genun();

        if ( a < b ) a.swap(b);

        Unumbex q, m;
        m = a.div(b, q);

        if ( !(i % 1000) )
            std::cout << a << ' ' << b << ' ' << q << ' ' << m << "\n";

        if ( a != (b * q + m ) )
        {
            std::cout << "\nERROR: ";
            std::cout << a << ' ' << b << ' ' << q << ' ' << m << "\n";
            throw 1;
        }
    }
}

void test02()
{
    unsigned mod = 31;

    for ( unsigned i = 2; i < mod; i++ )
    {
        for ( unsigned j = 2; j < mod; j++ )
        {
            Unumber m(mod), x(i), y(j);
            Unumber r(x);
            r.pow_c(y, m);

            if ( r == 1 ) std::cout << " (" << i << ',' << j << ',' << r << ")" << std::flush;

            unsigned z = 1;
            for ( unsigned k = 0; k < j; k++ )
                z *= i, z %= mod;

            if ( Unumber(z) != r )
            {
                std::cout << " (" << i << ',' << j << ',' << r << ")" << std::flush;
                throw "Bad power";
            }
        }
    }
    std::cout << '\n';
}


void test03()
{
    Unumber m("944379765203886900486182821", Unumber::Decimal);
    Unumber f("944379765203825339051699692", Unumber::Decimal);

    Unumber x(34), y, z;

    f /= 4;
    x *= x; x *= x;

    y = x;
    if ( f != Unumber ("236094941300956334762924923", Unumber::Decimal))
    {
        std::cout << f.str() << "\n";
        throw 3;
    }

    std::cout << m.str() << ' ' << f.str() << ' ' << y.str() << '\n';
    if ( y != Unumber("1336336", Unumber::Decimal) )
    {
        throw 3;
    }

    y = x;
    y.pow_r(f / 2, m);
    y = y.mul(y, m);
    y = y.mul(x, m);
    std::cout << m.str() << ' ' << f.str() << ' ' << y.str() << '\n';
    if ( y != Unumber("1", Unumber::Decimal))
    {
        throw 3;
    }

    y = x;
    y.pow_c(f / 2, m);
    y = y.mul(y, m);
    y = y.mul(x, m);
    std::cout << m.str() << ' ' << f.str() << ' ' << y.str() << '\n';
    if ( y != Unumber("1", Unumber::Decimal))
    {
        throw 3;
    }

    y = x;
    y.pow_c2(f / 2 * 2, m, x);
    std::cout << m.str() << ' ' << f.str() << ' ' << y.str() << '\n';
    if ( y != Unumber("1", Unumber::Decimal))
    {
        throw 3;
    }

    std::cout << "=====================\n";

    f = f / 2 * 2;
    if ( f != Unumber("236094941300956334762924922", Unumber::Decimal))
    {
        std::cout << f.str();
        throw 3;
    }

    y = x;
    y.pow_c2(f, m, x);
    std::cout << m.str() << ' ' << f.str() << ' ' << y.str() << '\n';
    if ( y != Unumber("1", Unumber::Decimal))
    {
        throw 3;
    }

    y = x;
    y.pow_r(f, m);
    y = y.mul(x, m);
    std::cout << m.str() << ' ' << f.str() << ' ' << y.str() << '\n';
    if ( y != Unumber("1", Unumber::Decimal))
    {
        throw 3;
    }

    std::cout << "=====================\n";

    f /= 2;
    y = x * x;
    y.pow_c2(f, m, x);
    std::cout << m.str() << ' ' << f.str() << ' ' << y.str() << '\n';
    if ( f != Unumber("118047470650478167381462461", Unumber::Decimal))
    {
        throw 3;
    }

    if ( y != Unumber("1", Unumber::Decimal))
    {
        throw 3;
    }

    f /= 2;
    y = x;
    z = x;
    y.pow_r(4, m);
    z.pow_r(3, m);
    y.pow_c2(f, m, z);
    std::cout << m.str() << ' ' << f.str() << ' ' << y.str() << '\n';
    if ( f != Unumber("59023735325239083690731230", Unumber::Decimal))
    {
        throw 3;
    }

    if ( y != Unumber("1", Unumber::Decimal))
    {
        throw 3;
    }

    f /= 2;
    y = x;
    z = x;
    y.pow_r(8, m);
    z.pow_r(3, m);
    y.pow_c2(f, m, z);
    std::cout << m.str() << ' ' << f.str() << ' ' << y.str() << '\n';
    if ( f != Unumber("29511867662619541845365615", Unumber::Decimal))
    {
        throw 3;
    }

    if ( y != Unumber("1", Unumber::Decimal))
    {
        throw 3;
    }

    f /= 2;
    y = x;
    z = x;
    y.pow_r(8, m);
    z.pow_r(3, m);
    z = z.mul(y, m);
    y.pow_r(2, m);
    y.pow_c2(f, m, z);
    std::cout << m.str() << ' ' << f.str() << ' ' << y.str() << '\n';
    if ( f != Unumber("14755933831309770922682807", Unumber::Decimal))
    {
        throw 3;
    }

    if ( y != Unumber("1", Unumber::Decimal))
    {
        throw 3;
    }

    f /= 2;
    y = x;
    z = x;
    y.pow_r(8, m);
    z.pow_r(3, m);
    z = z.mul(y, m);
    y.pow_r(2, m);
    z = z.mul(y, m);
    y.pow_r(2, m);
    y.pow_c2(f, m, z);
    std::cout << m.str() << ' ' << f.str() << ' ' << y.str() << '\n';
    if ( f != Unumber("7377966915654885461341403", Unumber::Decimal))
    {
        throw 3;
    }

    if ( y != Unumber("1", Unumber::Decimal))
    {
        throw 3;
    }

    f /= 2;
    y = x;
    z = x;
    y.pow_r(8, m);
    z.pow_r(3, m);
    z = z.mul(y, m);
    y.pow_r(2, m);
    z = z.mul(y, m);
    y.pow_r(2, m);
    z = z.mul(y, m);
    y.pow_r(2, m);
    y.pow_c2(f, m, z);
    std::cout << m.str() << ' ' << f.str() << ' ' << y.str() << '\n';
    if ( f != Unumber("3688983457827442730670701", Unumber::Decimal))
    {
        throw 3;
    }

    if ( y != Unumber("1", Unumber::Decimal))
    {
        throw 3;
    }

    f = f / (4 * 25);
    y = x;
    z = x;
    y.pow_r(8, m);
    z.pow_r(3, m);
    z = z.mul(y, m);
    y.pow_r(2, m);
    z = z.mul(y, m);
    y.pow_r(2, m);
    z = z.mul(y, m);
    y.pow_r(2, m);
    z = z.mul(y, m);
    y.pow_r(4 * 25, m);
    y.pow_c2(f, m, z);
    std::cout << m.str() << ' ' << f.str() << ' ' << y.str() << '\n';
    if ( f != Unumber("36889834578274427306707", Unumber::Decimal))
    {
        throw 3;
    }

    if ( y != Unumber("1", Unumber::Decimal))
    {
        throw 3;
    }

    f = f / (109465748347);
    f = f / (428206963);
    y = x;
    z = x;
    y.pow_r(8, m);
    z.pow_r(3, m);
    z = z.mul(y, m);
    y.pow_r(2, m);
    z = z.mul(y, m);
    y.pow_r(2, m);
    z = z.mul(y, m);
    y.pow_r(2, m);
    z = z.mul(y, m);
    y.pow_r(Unumber(100) * 109465748347 * 428206963, m);
    y.pow_c2(f, m, z);
    std::cout << m.str() << ' ' << f.str() << ' ' << y.str() << '\n';
    if ( f != Unumber("787", Unumber::Decimal))
    {
        throw 3;
    }

    if ( y != Unumber("1", Unumber::Decimal))
    {
        throw 3;
    }

    f = f / (2 * 131);
    y = x;
    z = x;
    y.pow_r(8, m);
    z.pow_r(3, m);
    z = z.mul(y, m);
    y.pow_r(2, m);
    z = z.mul(y, m);
    y.pow_r(2, m);
    z = z.mul(y, m);
    y.pow_r(2, m);
    z = z.mul(y, m);
    y.pow_r(Unumber(100) * 109465748347 * 428206963, m);
    z = z.mul(y, m);
    y.pow_r(2 * 131, m);
    y.pow_c2(f, m, z);
    std::cout << m.str() << ' ' << f.str() << ' ' << y.str() << '\n';
    if ( f != Unumber("3", Unumber::Decimal))
    {
        throw 3;
    }

    if ( y != Unumber("1", Unumber::Decimal))
    {
        throw 3;
    }

    f = f / (2) * 2;
    y = x;
    z = x;
    y.pow_r(8, m);
    z.pow_r(3, m);
    z = z.mul(y, m);
    y.pow_r(2, m);
    z = z.mul(y, m);
    y.pow_r(2, m);
    z = z.mul(y, m);
    y.pow_r(2, m);
    z = z.mul(y, m);
    y.pow_r(Unumber(100) * 109465748347 * 428206963, m);
    z = z.mul(y, m);
    y.pow_r(2 * 131, m);
    z = z.mul(y, m);
    y.pow_c2(f, m, z);
    std::cout << m.str() << ' ' << f.str() << ' ' << y.str() << '\n';
    if ( f != Unumber("2", Unumber::Decimal))
    {
        throw 3;
    }

    if ( y != Unumber("1", Unumber::Decimal))
    {
        throw 3;
    }

    f = f / (2);
    y = x;
    z = x;
    y.pow_r(8, m);
    z.pow_r(3, m);
    z = z.mul(y, m);
    y.pow_r(2, m);
    z = z.mul(y, m);
    y.pow_r(2, m);
    z = z.mul(y, m);
    y.pow_r(2, m);
    z = z.mul(y, m);
    y.pow_r(Unumber(100) * 109465748347 * 428206963, m);
    z = z.mul(y, m);
    y.pow_r(2 * 131, m);
    z = z.mul(y, m);
    y.pow_r(2, m);
    y = z.mul(y, m);
    std::cout << m.str() << ' ' << f.str() << ' ' << y.str() << '\n';
    if ( f != Unumber("1", Unumber::Decimal))
    {
        throw 3;
    }

    if ( y != Unumber("1", Unumber::Decimal))
    {
        throw 3;
    }

    std::cout << "=====================\n";

    y = x;
    z = x;

    std::cout << m.str() << ' ' << y.str() << ' ' << z.str() << '\n';
    if ( y != Unumber("1336336", Unumber::Decimal))
    {
        throw 3;
    }

    if ( z != Unumber("1336336", Unumber::Decimal))
    {
        throw 3;
    }

    y.pow_r(8, m);
    std::cout << y.str() << ' ' << z.str() << "      y.pow_r(8,m)" << '\n';
    if ( y != Unumber("885209434425461436723530916", Unumber::Decimal))
    {
        throw 3;
    }

    z.pow_r(3, m);
    std::cout << y.str() << ' ' << z.str() << "      z.pow_r(3,m)" << '\n';
    if ( z != Unumber("2386420683693101056", Unumber::Decimal))
    {
        throw 3;
    }

    Unumber z_a11 = ((z / 2).mul(y, m) * 2);
    std::cout << z_a11.str() << "      z*y,m" << '\n';
    if (z_a11 != Unumber("1796304778472732844831305310", Unumber::Decimal))
    {
        throw 3;
    }

    z = z.mul(y, m);
    std::cout << y.str() << ' ' << z.str() << "      z.mul(y,m)" << '\n';
    if ( z != Unumber("851925013268845944345122489", Unumber::Decimal))
    {
        throw 3;
    }

    y.pow_r(2, m);
    std::cout << y.str() << ' ' << z.str() << "      y.pow_r(2,m)" << '\n';
    if ( y != Unumber("117508507250744857852234136", Unumber::Decimal))
    {
        throw 3;
    }

    z = z.mul(y, m);
    std::cout << y.str() << ' ' << z.str() << "      z.mul(y,m)" << '\n';
    if ( z != Unumber("275506643384665060537099281", Unumber::Decimal))
    {
        throw 3;
    }

    y.pow_r(2, m);
    std::cout << y.str() << ' ' << z.str() << "      pow_r(2,m)" << '\n';
    if ( y != Unumber("651680702034734189083039421", Unumber::Decimal))
    {
        throw 3;
    }

    z = z.mul(y, m);
    std::cout << y.str() << ' ' << z.str() << "      z.mul(y,m)" << '\n';
    if ( z != Unumber("457104138203512446204263645", Unumber::Decimal))
    {
        throw 3;
    }

    y.pow_r(2, m);
    std::cout << y.str() << ' ' << z.str() << "      y.pow_r(2,m)" << '\n';
    if ( y != Unumber("319680714595070509180075603", Unumber::Decimal))
    {
        throw 3;
    }

    z = z.mul(y, m);
    std::cout << y.str() << ' ' << z.str() << "      z.mul(y,m)" << '\n';
    if ( z != Unumber("835323363833982524432393326", Unumber::Decimal))
    {
        throw 3;
    }

    y.pow_r(Unumber(100) * 109465748347 * 428206963, m);
    std::cout << y.str() << ' ' << z.str() << "      y.pow_r(Unumber(100)*109465748347*428206963,m)" << '\n';
    if ( y != Unumber("490469137971748369058528566", Unumber::Decimal))
    {
        throw 3;
    }

    z = z.mul(y, m);
    std::cout << y.str() << ' ' << z.str() << "      z.mul(y,m)" << '\n';
    if ( z != Unumber("390993808144497072869219570", Unumber::Decimal))
    {
        throw 3;
    }

    y.pow_r(2 * 131, m);
    std::cout << y.str() << ' ' << z.str() << "      y.pow_r(2*131,m)" << '\n';
    if ( y != Unumber("749457592325513185841879231", Unumber::Decimal))
    {
        throw 3;
    }

    z = z.mul(y, m);
    std::cout << y.str() << ' ' << z.str() << "      z.mul(y,m)" << '\n';
    if ( z != Unumber("907307707588175650530311950", Unumber::Decimal))
    {
        throw 3;
    }

    y.pow_r(2, m);
    std::cout << y.str() << ' ' << z.str() << "      pow_r(2,m)" << '\n';
    if ( y != Unumber("520541207537123959728679957", Unumber::Decimal))
    {
        throw 3;
    }

    z = z.mul(y, m);
    std::cout << m.str() << ' ' << y.str() << ' ' << z.str() << "      z.mul(y,m)" << '\n';
    if ( z != Unumber("1", Unumber::Decimal))
    {
        throw 3;
    }

    f = Unumber("944379765203825339051699692", Unumber::Decimal);
    x = 34;

    std::cout << "=====================\n";

    Unumber u;
    f = f / 50 * 50;
    y = x;
    z = 1;
    u = y;
    u.pow_r(42, m);
    //y.pow_r(2,m);
    z = z.mul(u, m);
    y.pow_c2(f, m, z);
    std::cout << m.str() << ' ' << f.str() << ' ' << y.str() << '\n';
    if ( m != Unumber("944379765203886900486182821", Unumber::Decimal))
    {
        throw 3;
    }

    if ( f != Unumber("944379765203825339051699650", Unumber::Decimal))
    {
        throw 3;
    }

    if ( y != Unumber("1", Unumber::Decimal))
    {
        throw 3;
    }


}

void test04()
{
    Unumber big(50);
    unsigned ctr = 1;
    for ( Unumber m = 2; m < big; ++m )
    {
        for ( Unumber x = 2; x < m; ++x )
        {
            for ( Unumber y = 2; !(x < y); ++y )
            {
                Unumber ar(x); ar.pow_r(y, m);
                Unumber ac(x); ac.pow_c(y, m);
                Unumber br(y); br.pow_r(x, m);
                Unumber bc(y); bc.pow_c(x, m);

                if ( !(ctr++ % 11113) )
                    std::cout << m.str() << ' ' << x.str() << ' ' << y.str() << ' '
                              << ar.str() << ' ' << ac.str() << ' '
                              << br.str() << ' ' << bc.str() << '\n';

                if ( ar != ac ) throw 1;
                if ( br != bc ) throw 1;
            }
        }
    }
}

void test05()
{
    Unumber u1("885209434425461436723530916", Unumber::Decimal);
    Unumber u2("2386420683693101056", Unumber::Decimal);
    Unumber m("944379765203886900486182821", Unumber::Decimal);

    m = 10;

    // 851925013268845944345122489 - correct
    // u2 = 2^12*17^12
    // u1 = 2 2 3 43 929 1846633110591244725769
    Unumber u_a51 = (u1 * u2);
    std::cout << u_a51 << "\n";
    if ( u_a51 != Unumber ("2112482103713192988197380005812692085928247296", Unumber::Decimal))
    {
        throw 5;
    }


    std::cout << "=============================   " << m << "\n";
    Unumber u_a52 = (u1.mul(u2, m));
    std::cout << u_a52 << "\n";
    if ( u_a52 != Unumber("6", Unumber::Decimal))
    {
        throw 5;
    }

    Unumber u_a53 = (u1 * u2).mul(1, m);
    std::cout << u_a53 << "\n";
    if ( u_a53 != Unumber("6", Unumber::Decimal))
    {
        throw 5;
    }

    std::cout << "=============================   " << m << "\n";

    Unumber u_a54 = (u1.mul(u2 / 8, m).mul(8, m));
    std::cout << u_a54 << "\n";
    if ( u_a54 != Unumber("6", Unumber::Decimal))
    {
        throw 5;
    }

    Unumber u_a55 = (u2.mul(u1 / 2, m).mul(2, m));
    std::cout << u_a55 << "\n";
    if ( u_a55 != Unumber("6", Unumber::Decimal))
    {
        throw 5;
    }
}

void test06()
{
    Unumber u("147573952589676412927", Unumber::Decimal);
    Unumber m(10);


    Unumber u_a61 = u.mul(1, m);
    std::cout << u << " " << u_a61 << "\n";
    if ( u_a61 != Unumber("7", Unumber::Decimal))
    {
        throw 6;
    }

    std::cout << "=============================   " << m << "\n";

    Unumber o(1);
    for ( int i = 0; i < 10; i++ )
    {
        o *= 2;
        std::cout << i << ' ' << o << " " << (o - 1).mul(1, m) << "\n";
    }
}
