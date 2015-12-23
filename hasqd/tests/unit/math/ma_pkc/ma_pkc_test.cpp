#include <iostream>
#include <sstream>

#include "gl_except.h"
#include "gl_utils.h"

#include "ma_pkc.h"
#include "ma_utils.h"
#include "os_timer.h"

int main()
try
{
    void test01(); test01();
}
catch (const char * e)
{
    std::cout << "Error: " << e << "\n";
    return 1;
}
catch (string e)
{
    std::cout << "Error: " << e << "\n";
    return 2;
}
catch (gl::Exception e)
{
    std::cout << "Error: " << e.str() << "\n";
    return 2;
}
catch (...)
{
    std::cout << "Unknown error\n";
    return 3;
}

struct Out : ma::Output
{
    virtual Output & operator<<(unsigned u) { return out(u); }
    virtual Output & operator<<(char x) { return out(x); }
    virtual Output & operator<<(const char * x) { return out(x); }
    virtual Output & operator<<(const string & x) { return out(x); }

    template<class T>
    Output & out(T x) { std::cout << x << std::flush; return *this; }
};

void test01()
{
    //std::ostringstream os;
    //os<<os::Timer(0).get();

    for ( int i = 0; i < 1; i++ )
    {
        string seed = "abc";
        Out o;
        ma::Pko pk(seed, 40, o);
        std::cout << pk.strSimple();

        string a = "abcdefghijklmnopqrstuvwxyz";
        std::cout << "Initial message: " << a << '\n';

        string b = pk.enc(a, "abc");
        std::cout << "Encoded message: " << b << '\n';

        string c = pk.dec(b);
        std::cout << "Decoded message: " << c << '\n';
    }
}

