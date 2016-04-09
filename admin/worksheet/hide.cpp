#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <cctype>
#include <ctime>
#include <map>
#include <set>
#include <algorithm>

using std::string;
using std::cout;
using std::pair;

string pwd;

string getname()
{
    std::ifstream in("myname");
    if ( in )
    {
        string name;
        in >> name >> pwd;
        if ( !name.empty() ) return name;
    }

    in.close();

    string nm, pw;
    cout << "Enter your name: ";
    std::cin >> nm;
    cout << "If you do not know the password, ask your team\n";
    cout << "Enter password : ";
    std::cin >> pw;

    std::ofstream of("myname");
    of << nm << '\n' << pw;

    cout << "Thank you, " << nm << "!\nStart again";
    return "";
}

int main(int ac, char * av[])
try
{
    {
        std::ofstream of("timesheet", std::ios::app);
        if ( !of )
        {
            cout << "Timesheet not accessible. Maybe you forgot to lock it?\n";
            return 1;
        }
    }

    string name = getname();
    if ( name.empty() ) return 0;

    if ( ac < 2 )
    {
        cout << "\n Welcome " << name << "!\n";
        return 0;
    }

    string file = av[1];
    cout << "FILE " << file << '\n';

    void crypt(string fin, string fout, bool enc);

    size_t sz = file.size();

    if ( sz > 2 && file.substr(sz - 2) == ".e" )
        crypt(file, file.substr(0, sz - 2), false);
    else
        crypt(file, file + ".e", true);
}

catch (string e)
{
    std::cout << "Error: " << e << "\n";
}
catch (...)
{
    std::cout << "Error\n";
}

void crypt(string fin, string fout, bool enc)
{
    cout << fin << " -> " << fout << '\n';

    std::ifstream in(fin.c_str());
    if ( !in ) throw "cannot open " + fin;

    string r;

    string crline(const string & s, bool e);
    for (string line; (std::getline(in, line), !!in);)
        r += crline(line, enc) + '\n';

    std::ofstream of(fout.c_str());
    of << r;
}

std::vector<int> s2v(const string & s)
{
    std::vector<int> v;
    for ( size_t i = 0; i < s.size(); i++ )
    {
        int x = (int)(unsigned char)(s[i]) - 32;

        if ( x < 0 || x > 94 )
            throw string()
            + "file is not textual or has tabs\n"
            + "offensive input (" + s[i] + ") [" + s + "]";

        v.push_back( x );
    }
    return v;
}

string v2s(const std::vector<int> & v)
{
    string r;
    for (size_t i = 0; i < v.size(); i++) r += (char)(32 + v[i]);
    return r;
}

string crline(const string & s, bool e)
{
    std::vector<int> v = s2v(s);
    std::vector<int> p = s2v(pwd);

    if (e)
    {
        // apply pwd
        for ( size_t i = 0; i < v.size(); i++ ) v[i] = (v[i] + p[i % p.size()]) % 95;
    }

    return v2s(v);
}


