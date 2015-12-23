// Hasq Technology Pty Ltd (C) 2013-2015

// memory manager viewer

#include <map>
#include <string>
#include <vector>
#include <cstdio>

using namespace std;

typedef map<string, string> mss;

int main()
{
    mss ms;
    vector<int> v(100);

    char * a = new char[3];

    ms["aaa"] = "bbb";
    ms["ccc"] = "ddd";

    for ( mss::iterator i = ms.begin(); i != ms.end(); ++i )
        ///cout << "[" << i->first << "]=" << i->second << "\n";
        std::printf("[%s]=%s\n", i->first.c_str(), i->second.c_str());

    ++*a;
}

#ifndef TEST_MEMORY
#define TEST_MEMORY
#endif

#include "sg_mem.cpp"
