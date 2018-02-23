#include <iostream>
#include <sstream>

#include "gl_except.h"
#include "gl_utils.h"

#include "hq_gl_key.h"

using std::cout;

int main(int ac, char * av[])
try
{
    if ( ac > 1 )
    {
        void proc(int, char*[]);
        proc(ac, av);
        return 0;
    }

    void test01();
    test01();
}
catch (const char * e)
{
    cout << "Error: " << e << "\n";
    return 1;
}
catch (string e)
{
    cout << "Error: " << e << "\n";
    return 2;
}
catch (gl::Exception e)
{
    cout << "Error: " << e.str() << "\n";
    return 2;
}
catch (...)
{
    cout << "Unknown error\n";
    return 3;
}

void test01()
{
    std::vector<string> keys;
    keys.push_back("aaa");

    KeyArea ka(keys, "a");

    string m = "aaa";
    string a = ka.skcenc(m, false, true);

    cout << a << '\n';
    a = ka.skcenc("aaa", false, true);
    cout << a << '\n';

    ka.addSkcKey("bbb");

    string b = ka.skcdec(a, false, true);
    cout << b << '\n';

    if ( b != m ) throw "Decryption failed";
}

void proc(int ac, char * av[])
{
    if ( ac < 4 )
    {
        cout << "Use: (enc|dec) key \"data\"";
        return;
    }

    string cry = av[1];
    string key = av[2];
    string dat = av[3];

    std::vector<string> keys;
    keys.push_back(key);

    KeyArea ka(keys, "a");
    string r;

    if ( cry == "enc" ) r = ka.skcenc(dat, false, true);
    if ( cry == "dec" ) r = ka.skcdec(dat, false, true);

    cout << r << '\n';
    if ( r.empty() ) cout << "[EMPTY]\n";
}

