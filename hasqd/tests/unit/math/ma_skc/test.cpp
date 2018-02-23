#include <iostream>
#include <sstream>

#include "gl_except.h"
#include "gl_utils.h"

#include "ma_skc.h"
#include "ma_utils.h"
#include "os_timer.h"

int main()
try
{
    void test01(); test01();
    void test02(); test02();
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

void test01()
{
    std::ostringstream os;
    os << os::Timer(0).get();

    for ( int i = 0; i < 1; i++ )
    {
        string salt = ma::skc::hashHex("a");
        string iv = ma::skc::hashHex("a");
        std::cout << "salt/iv [" << salt << '/' << iv << "]\n";
        string s = ma::skc::enc("a", "abc", salt, iv);

        if ( s != ma::b64dec( ma::b64enc(s) ) )
            throw gl::Never("base64 bad encoder");

        std::cout << "Encoded [" << ma::b64enc(s) << "] size=" << s.size() << "\n";
        std::cout << "Decoded [" << ma::skc::dec("a", s) << "]\n";
    }
}

void test02()
{

    string iv = ma::skc::hashHex("a");
    string key = "abc";
    string msg = "a";

    for ( int i = 0; i < 3000; i++ )
    {
        string salt = ma::skc::hashHex(iv);
        iv = ma::skc::hashHex(iv);
        msg += gl::tos(i);

        string msg_c = ma::skc::enc(key, msg, salt, iv);
        string msg_p = ma::skc::dec(key, msg_c);

        if ( msg_p != msg )
            throw "Bad SKC algorithm";

        if ( !(i % 100) ) std::cout << " " << msg.size() << std::flush;
    }
}
