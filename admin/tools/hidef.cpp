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

const int SZ = 16;

struct Digit
{
    int x[SZ];
    Digit() { for (int i = 0; i < SZ; i++ ) x[i] = 0; }
    Digit(const int * p) { for (int i = 0; i < SZ; i++ ) x[i] = p[i]; }
    void operator+=(const Digit & d);
    void operator-=(const Digit & d);
    void chk();
    void digest();
    void fluff();
    void unfluff();
};

typedef std::vector<Digit> digs;

int readline = 1;

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
    string name = getname();
    if ( name.empty() ) return 0;

    if ( ac < 2 )
    {
        cout << "\n Welcome " << name << "!\n";
        return 0;
    }

    string file = av[1];

    void crypt(string fin, string fout, bool enc);

    size_t sz = file.size();

    if ( sz > 2 && file.substr(sz - 2) == ".f" )
        crypt(file, file.substr(0, sz - 2), false);
    else
        crypt(file, file + ".f", true);
}

catch (string e)
{
    std::cout << "Error (line:" << readline << ") " << e << "\n";
}
catch (...)
{
    std::cout << "Error\n";
}

void crypt(string fin, string fout, bool enc)
{
    cout << fin << " -> " << fout << '\n';

    std::ifstream in(fin.c_str(), std::ios::binary);
    if ( !in ) throw "cannot open " + fin;

    string r;

    string crline(const string & s, bool e);

    for (string line; (std::getline(in, line), !!in); readline++)
    {
        if ( enc && !line.empty() && line[line.size() - 1] == ' ' )
            throw string() + "Line has trailing spaces";

        if ( line.empty() ) { r += '\n'; continue; }

        if (!enc) line = string(SZ - 1, line[0]) + line;
        string crl = crline(line, enc);
        if (enc) crl = crl.substr(SZ - 1);

        r += crl + '\n';
    }

    std::ofstream of(fout.c_str(), std::ios::binary);
    of << r;
}

std::vector<int> s2v(const string & s)
{
    std::vector<int> v;
    for ( size_t i = 0; i < s.size(); i++ )
    {
        int x = (int)(unsigned char)(s[i]) - 32;

        if ( x < 0 || x > 94 )
            throw string() + "File is not textual, has tabs or dos style";

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

digs s2d(const string & s)
{
    std::vector<int> v = s2v(s);
    while ( v.size() % SZ ) v.push_back(0);

    digs r;
    for ( int i = 0; i < (int)v.size(); i += 16 )
    {
        Digit d(&v[i]);
        r.push_back(d);
    }

    return r;
}

string d2s(const digs & d)
{
    std::vector<int> v;
    for ( int i = 0; i < (int)d.size(); i++ )
        for ( int j = 0; j < SZ; j++ )
            v.push_back(d[i].x[j]);

    while ( !v.empty() && v[v.size() - 1] == 0 ) v.pop_back();

    return v2s(v);
}

string crline(const string & s, bool e)
{
    digs vd = s2d(s);
    digs crdigs(const digs & vd, bool e);
    digs vr = crdigs(vd, e);
    string r = d2s(vr);
    return r;
}

digs crdigs(const digs & s, bool e)
{
    digs v = s;
    string pw = pwd;
    Digit p = s2d(pwd)[0];
    p.digest();

    if (e)
    {
        // apply pwd
        for ( size_t i = 0; i < v.size(); i++ ) v[i] += p;

        Digit sum;
        for ( size_t i = 0; i < v.size(); i++ ) sum += v[i];
        sum.chk();

        // add prefix
        v.insert( v.begin(), p );
        v.insert( v.begin(), sum );

        // fluff
        for ( size_t i = 2; i < v.size(); i++ ) v[i].fluff();

        // in-chain
        for ( size_t i = 1; i < v.size(); i++ ) v[i] += v[i - 1];

        // drop pwd part
        v.erase( v.begin() + 1 );
    }
    else
    {
        // insert pwd
        v.insert(v.begin() + 1, p );

        // in-chain pwd
        v[1] += v[0];

        // un-chain
        for ( size_t i = v.size() - 1; i > 0; i-- ) v[i] -= v[i - 1];

        // unfluff
        for ( size_t i = 2; i < v.size(); i++ ) v[i].unfluff();

        // drop prefix
        v.erase( v.begin() );
        v.erase( v.begin() );

        // de-apply pwd
        for ( size_t i = 0; i < v.size(); i++ ) v[i] -=  p;
    }

    return v;
}


void Digit::operator+=(const Digit & d)
{
    for ( int i = 0; i < SZ; i++ )
    {
        x[i] += d.x[i];
        if ( i < SZ - 1 ) x[i + 1] += x[i] / 95;
        x[i] = x[i] % 95;
    }
}

void Digit::operator-=(const Digit & d)
{
    for ( int i = 0; i < SZ; i++ )
    {
        x[i] -= d.x[i];

        bool b = x[i] < 0;
        if (b) x[i] += 95;

        if ( i < SZ - 1 && b ) --x[i + 1];
    }
}
void Digit::chk()
{
    int j = SZ - 1;
    for ( int i = 0; i < j; i++ ) { x[j] += x[i]; x[i] = 0; }
    x[j] = x[j] % 95;
    for ( int i = 0; i < j; i++ ) x[i] = x[j];
}

void Digit::digest()
{
    int j = 1;
    for ( int i = 0; i < SZ; i++ )
    {
        int & y = x[(i + j) % SZ];
        int & z = x[(i + j + SZ - 1) % SZ];
        y += z + 11;
        y %= 95;
    }
}

void Digit::fluff()
{
    for ( int i = 1; i < SZ; i++ )
    {
        int & y = x[i];
        int & z = x[i - 1];
        y += z + 11;
        y %= 95;
    }
}

void Digit::unfluff()
{
    for ( int i = SZ - 1; i > 0; i-- )
    {
        int & y = x[i];
        int & z = x[i - 1];
        y -= z + 11;
        y += 95 << 1;
        y %= 95;
    }
}
