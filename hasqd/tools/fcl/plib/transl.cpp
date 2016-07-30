#ifndef TRANSLIT_CPP
#define TRANSLIT_CPP

// unccomment for standalone translit
//#define main_dummy_translit main

// translit

#include <vector>
#include <string>
#include <iostream>
#include <cstdio>
using std::string;

//#include "ut.h"

#include "transl.h"


struct rus
{
    char * s;
    int i;
};


const int SZ = 94;

static struct rus r[SZ] =
{

    {"SHCH", (217)},
    {"Shch", (217)},
    {"''''", (218)},
    {"shch", (249)},
    {"SCH", (217)},
    {"Sch", (217)},
    {"'''", (220)},
    {"sch", (249)},
    {"ZH", (198)},
    {"Zh", (198)},
    {"CH", (215)},
    {"Ch", (215)},
    {"SH", (216)},
    {"Sh", (216)},
    {"E'", (221)},
    {"YU", (222)},
    {"Yu", (222)},
    {"Ya", (223)},
    {"YA", (223)},
    {"JU", (222)},
    {"Ju", (222)},
    {"Ja", (223)},
    {"JA", (223)},
    {"Jo", (197)},
    {"JO", (197)},
    {"Yo", (197)},
    {"YO", (197)},
    {"zh", (230)},
    {"ch", (247)},
    {"sh", (248)},
    {"''", (250)},
    {"e'", (253)},
    {"yu", (254)},
    {"ju", (254)},
    {"ya", (255)},
    {"ja", (255)},
    {"yo", (229)},
    {"jo", (229)},
    {"A", (192)},
    {"B", (193)},
    {"V", (194)},
    {"G", (195)},
    {"D", (196)},
    {"E", (197)},
    {"Z", (199)},
    {"I", (200)},
    {"J", (201)},
    {"K", (202)},
    {"L", (203)},
    {"M", (204)},
    {"N", (205)},
    {"O", (206)},
    {"P", (207)},
    {"R", (208)},
    {"S", (209)},
    {"T", (210)},
    {"U", (211)},
    {"F", (212)},
    {"H", (213)},
    {"X", (213)},
    {"C", (214)},
    {"Y", (219)},
    {"a", (224)},
    {"b", (225)},
    {"v", (226)},
    {"g", (227)},
    {"d", (228)},
    {"e", (229)},
    {"z", (231)},
    {"i", (232)},
    {"j", (233)},
    {"k", (234)},
    {"l", (235)},
    {"m", (236)},
    {"n", (237)},
    {"o", (238)},
    {"p", (239)},
    {"r", (240)},
    {"s", (241)},
    {"t", (242)},
    {"u", (243)},
    {"f", (244)},
    {"h", (245)},
    {"x", (245)},
    {"c", (246)},
    {"y", (251)},

    {"w", (226)},
    {"W", (194)},
    {"q", (234)},
    {"Q", (202)},
    {"x", (245)},
    {"X", (213)},

    {"'", (252)},
    {"`", (0)}

};

static string unt[256] =
{
    "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",

    "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "", "", "",
    "", "", "A", "B", "V", "G", "D", "E", "Zh", "Z",

    "I", "J", "K", "L", "M", "N", "O", "P", "R", "S",
    "T", "U", "F", "H", "C", "Ch", "Sh", "Sch", "''''", "Y",
    "'''", "E'", "Ju", "Ja", "a", "b", "v", "g", "d", "e",
    "zh", "z", "i", "j", "k", "l", "m", "n", "o", "p",
    "r", "s", "t", "u", "f", "h", "c", "ch", "sh", "sch",
    "''", "y", "'", "e'", "ju" , "ja"

};

int uni[256] =
{
    0x0000, 0x0001, 0x0002, 0x0003, 0x0004, 0x0005, 0x0006, 0x0007, 0x0008, 0x0009,
    0x000A, 0x000B, 0x000C, 0x000D, 0x000E, 0x000F, 0x0010, 0x0011, 0x0012, 0x0013,
    0x0014, 0x0015, 0x0016, 0x0017, 0x0018, 0x0019, 0x001A, 0x001B, 0x001C, 0x001D,
    0x001E, 0x001F, 0x0020, 0x0021, 0x0022, 0x0023, 0x0024, 0x0025, 0x0026, 0x0027,
    0x0028, 0x0029, 0x002A, 0x002B, 0x002C, 0x002D, 0x002E, 0x002F, 0x0030, 0x0031,
    0x0032, 0x0033, 0x0034, 0x0035, 0x0036, 0x0037, 0x0038, 0x0039, 0x003A, 0x003B,
    0x003C, 0x003D, 0x003E, 0x003F, 0x0040, 0x0041, 0x0042, 0x0043, 0x0044, 0x0045,
    0x0046, 0x0047, 0x0048, 0x0049, 0x004A, 0x004B, 0x004C, 0x004D, 0x004E, 0x004F,
    0x0050, 0x0051, 0x0052, 0x0053, 0x0054, 0x0055, 0x0056, 0x0057, 0x0058, 0x0059,
    0x005A, 0x005B, 0x005C, 0x005D, 0x005E, 0x005F, 0x0060, 0x0061, 0x0062, 0x0063,
    0x0064, 0x0065, 0x0066, 0x0067, 0x0068, 0x0069, 0x006A, 0x006B, 0x006C, 0x006D,
    0x006E, 0x006F, 0x0070, 0x0071, 0x0072, 0x0073, 0x0074, 0x0075, 0x0076, 0x0077,
    0x0078, 0x0079, 0x007A, 0x007B, 0x007C, 0x007D, 0x007E, 0x007F, 0x0402, 0x0403,
    0x201A, 0x0453, 0x201E, 0x2026, 0x2020, 0x2021, 0x20AC, 0x2030, 0x0409, 0x2039,
    0x040A, 0x040C, 0x040B, 0x040F, 0x0452, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022,
    0x2013, 0x2014, 0x0000, 0x2122, 0x0459, 0x203A, 0x045A, 0x045C, 0x045B, 0x045F,
    0x00A0, 0x040E, 0x045E, 0x0408, 0x00A4, 0x0490, 0x00A6, 0x00A7, 0x0401, 0x00A9,
    0x0404, 0x00AB, 0x00AC, 0x00AD, 0x00AE, 0x0407, 0x00B0, 0x00B1, 0x0406, 0x0456,
    0x0491, 0x00B5, 0x00B6, 0x00B7, 0x0451, 0x2116, 0x0454, 0x00BB, 0x0458, 0x0405,
    0x0455, 0x0457, 0x0410, 0x0411, 0x0412, 0x0413, 0x0414, 0x0415, 0x0416, 0x0417,
    0x0418, 0x0419, 0x041A, 0x041B, 0x041C, 0x041D, 0x041E, 0x041F, 0x0420, 0x0421,
    0x0422, 0x0423, 0x0424, 0x0425, 0x0426, 0x0427, 0x0428, 0x0429, 0x042A, 0x042B,
    0x042C, 0x042D, 0x042E, 0x042F, 0x0430, 0x0431, 0x0432, 0x0433, 0x0434, 0x0435,
    0x0436, 0x0437, 0x0438, 0x0439, 0x043A, 0x043B, 0x043C, 0x043D, 0x043E, 0x043F,
    0x0440, 0x0441, 0x0442, 0x0443, 0x0444, 0x0445, 0x0446, 0x0447, 0x0448, 0x0449,
    0x044A, 0x044B, 0x044C, 0x044D, 0x044E, 0x044F
};


int match(const char * s, const char * x)
{
    int i = 0;
    while (s[i])
        if ( s[i] != x[i] ) return 0;
        else i++;
    return i;
}

std::pair<int, int> match( string x)
{

    int i;

    for ( i = 0; i < SZ; i++ )
    {
        int k = match( r[i].s, x.c_str() );
        if ( k ) return std::pair<int, int>(k, r[i].i);
    }

    return std::pair<int, int>(0, 0);
}

bool translit_unicode = false;
string translitall(string vch)
{

    vch += "$$$$";
    string r;

    for ( string::size_type i = 0; i < vch.size() - 4; )
    {

        std::pair<int, int> x = match( vch.substr(i, i + 4) );
        if ( x.first == 0 )
            r += vch[i++];
        else
        {
            i += x.first;
            if ( x.second == 0 ) continue;
            if ( x.second == 1 )
            {
                r += vch[i - 1];
            }
            else
            {
                if ( !translit_unicode )
                {
                    r += (char)(x.second);
                }
                else
                {
                    r += "&#";
                    char buf[20];
                    sprintf(buf, "%d", uni[x.second]);
                    r += buf;
                    r += ";";
                }
            }
        }

    }

    return r;
}

void flushb(string & r, string & b, bool mode, bool rus_only)
{
    if ( mode ) r += translitall(b);
    else  if ( !rus_only ) r += b;
    b = "";
}

// mode = entering mode rus or eng
// rus_only = output only russian
string translit(const string & s, bool mode, bool rus_only)
{
    if ( s.size() == 0 ) return "";

    string::size_type i = 0, j = s.size();

    string b, r;
    while (1)
    {
        if ( s[i] == '*' )
        {
            flushb(r, b, mode, rus_only);
            mode = !mode;

            if ( i > 0 && s[i - 1] == '*' ) b += '*';

        }
        else
            b += s[i];

        if ( ++i == j ) break;
    }

    flushb(r, b, mode, rus_only);

    return r;
}

void checkLig(string & s, int last)
// this checks if the last letter is a part of ligature
// then put a tick before it
{
    if ( s.size() - last < 1 ) return;

    string m = s.substr(s.size() - last - 1);

//std::cout<<"["<<m<<' '<<match(m).first<<':'<<match(m).second<<"]";
    if ( match(m).first > 1 ) goto yes;

    if ( s.size() - last < 2 ) return;
    m = s.substr(s.size() - last - 2);
    if ( match(m).first > 2 ) goto yes;

    if ( s.size() - last < 3 ) return;
    m = s.substr(s.size() - last - 3);
    if ( match(m).first > 3 ) goto yes;

    return;
yes:
    s.insert(s.size() - last, "`");
}

string untranslit(const string & s)
{
    bool mode = false;

    string res, rb, sb;
    string::size_type i = 0, j = s.size();
    for ( i = 0; i < j; i++ )
    {
        if ( s[i] == '*' )
        {
            if ( mode ) sb += "**";
            else res += "**";
            continue;
        }

        string un = unt[(unsigned char)s[i]];

        if ( un != "" ) // rus
        {
            // rus
            if ( sb != "" ) { rb += sb; sb = ""; }
            mode = true;

            rb += un;

            checkLig(rb, un.size());
            continue;
        }

        // eng or symbol

        if ( !match(string() + s[i]).first ) // symbol
        {
            if ( mode ) sb += s[i];
            else res += s[i];
            continue;
        }

        // eng

        if ( !mode )
        {
            res += s[i];
            continue;
        }

        mode = false;
        res += string() + '*' + rb + '*' + sb + s[i];
        rb = sb = "";

    }


    if ( mode ) res += string() + '*' + rb + '*' + sb;
    return res;
}

int main_dummy_translit(int ac, char * av[])
{

    string vch;

    while (1)
    {

        char a;
        std::cin.get(a);
        if ( !std::cin ) break;
        vch += (a);

    }

    if ( ac > 1 )
        std::cout << untranslit(vch);
    else
        std::cout << translit(vch);

    return 0;
}

#endif
