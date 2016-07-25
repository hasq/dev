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

    string outf;
    if ( ac > 2 ) outf = av[2];

    string file = av[1];

    void crypt(string fin, string fout, bool enc);

    size_t sz = file.size();

    if ( sz > 2 && file.substr(sz - 2) == ".g" )
        crypt(file, outf.empty() ? file.substr(0, sz - 2) : outf, false);
    else
        crypt(file, outf.empty() ? (file + ".g") : outf, true);
}

catch (string e)
{
    std::cout << "Error (line:" << readline << ") " << e << "\n";
}
catch (...)
{
    std::cout << "Error\n";
}

bool testbin(const string & s)
{
    if ( s[s.size() - 1] == ' ' ) return true;

    for ( size_t i = 0; i < s.size(); i++ )
    {
        int x = (int)(unsigned char)(s[i]) - 32;

        if ( x < 0 || x > 94 )
            return true;
    }

    return false;
}

string b64enc(const string & s);
string b64dec(const string & s);

void crypt(string fin, string fout, bool enc)
{
    cout << fin << " -> " << fout << '\n';

    std::ifstream in(fin.c_str(), std::ios::binary);
    if ( !in ) throw "cannot open " + fin;

    string r;

    string crline(const string & s, bool e);

    bool textual = true;
    for (string line; std::getline(in, line); readline++)
    {
        if ( line.empty() ) { r += '\n'; continue; }
        string crl;

        if (enc)
        {
            ///if ( line[line.size() - 1] == ' ' )
            ///    throw string() + "Line has trailing spaces";
            bool isbin = testbin(line);
            if ( isbin ) { textual = false; line = b64enc(line); }

            crl = crline(line, enc);
            crl = crl.substr(SZ - 1);

            if ( isbin ) { crl = '\t' + crl; }
        }
        else
        {
            bool isbin = (line[0] == '\t');
            if ( isbin ) line = line.substr(1);
            line = string(SZ - 1, line[0]) + line;
            crl = crline(line, enc);
            if ( isbin ) crl = b64dec(crl);
        }

        r += crl + ( in.eof() ? "" : "\n" );
    }

    std::ofstream of(fout.c_str(), std::ios::binary);
    of << r;

    if ( !textual )
        std::cout << "File is not textual, has tabs, trailing spaces or dos style";
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

// BASE64 iface ===================================

template <class T, class U>
inline const T * cp2cp(const U * p) { return reinterpret_cast<const T *>( p ); }
inline int st2i(size_t x) { return static_cast<int>( x ); }

extern string b64_encode(unsigned char const *, unsigned int);
string b64enc(const string & s)
{
    return b64_encode(cp2cp<unsigned char, char>(s.c_str()), st2i(s.size()));
}

extern string b64_decode(string const & );
string b64dec(const string & s)
{
    return b64_decode(s);
}

// BASE64 code ====================================
#include <iostream>
#include <string>

//using std::string;
using namespace std;

static const string b64_table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";


static inline void fill2encode(unsigned char * in, unsigned char * out)
{
    out[0] = (in[0] & 0xfc) >> 2;
    out[1] = ((in[0] & 0x03) << 4) + ((in[1] & 0xf0) >> 4);
    out[2] = ((in[1] & 0x0f) << 2) + ((in[2] & 0xc0) >> 6);
    out[3] = in[2] & 0x3f;
}

static inline void fill2decode(unsigned char * in, unsigned char * out)
{
    out[0] = (in[0] << 2) + ((in[1] & 0x30) >> 4);
    out[1] = ((in[1] & 0xf) << 4) + ((in[2] & 0x3c) >> 2);
    out[2] = ((in[2] & 0x3) << 6) + in[3];
}

string b64_encode(unsigned char const * data, unsigned int data_length)
{
    int i = 0;
    int j = 0;
    string encoded_data;
    unsigned char data_block[3];
    unsigned char encoded_block[4];

    while (data_length--)
    {
        data_block[i++] = *(data++);
        if (i == 3)
        {
            fill2encode(data_block, encoded_block);
            for (i = 0; (i < 4) ; i++)
                encoded_data += b64_table[encoded_block[i]];
            i = 0;
        }
    }

    if (i)
    {
        for (j = i; j < 3; j++)
            data_block[j] = '\0';

        fill2encode(data_block, encoded_block);

        for (j = 0; (j < i + 1); j++)
            encoded_data += b64_table[encoded_block[j]];

        while ((i++ < 3))
            encoded_data += '=';

    }

    return encoded_data;

}

string b64_decode(string const & data)
{
    int data_length = (int)data.size();
    int i = 0;
    int j = 0;
    int k = 0;
    unsigned char data_block[4], decoded_block[3];
    string decoded_data;

    while (data_length-- && ( data[k] != '=') && (isalnum(data[k]) || (data[k] == '+') || (data[k] == '/')))
    {
        data_block[i++] = data[k];
        k++;
        if (i == 4)
        {
            for (i = 0; i < 4; i++)
                data_block[i] = (unsigned char)b64_table.find(data_block[i]);

            fill2decode (data_block, decoded_block);

            for (i = 0; (i < 3); i++)
                decoded_data += decoded_block[i];
            i = 0;
        }
    }

    if (i != 0)
    {
        for (j = i; j < 4; j++)
            data_block[j] = '\0';

        for (j = 0; j < 4; j++)
            data_block[j] = (unsigned char)b64_table.find(data_block[j]);

        fill2decode (data_block, decoded_block);
        for (j = 0; (j < i - 1); j++) decoded_data += decoded_block[j];
    }

    return decoded_data;
}
