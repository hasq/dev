// Hasq Technology Pty Ltd (C) 2013-2016

#include <cstdlib>
#include <fstream>

#include "gl_utils.h"

const size_t MAX_FILE_SIZE = 1024u * 1024 * 10; // 10Mb

void gl::replaceAll(string & s, const string & r, const string & to)
{
    while (1)
    {
        size_t i = s.find(r);
        if ( i == string::npos ) return;
        s.replace(i, r.size(), to);
    }
}

bool gl::replaceHexCodes(string & data)
{
    size_t sz = data.size(), i, j;
    char buf[3] = { 0, 0, 0 };

    for (i = 0, j = 0; i < sz; i++, j++)
    {
        if ( data[i] == '%' )
        {
            if ( sz - i < 3 || !isxdigit(data[i + 1]) || !isxdigit(data[i + 2]) )
                return false;
            buf[0] = data[i + 1];
            buf[1] = data[i + 2];
            data[j] = l2c(std::strtol(buf, NULL, 16));
            i += 2;
        }
        else
        {
            if ( i != j )
                data[j] = data[i];
        }
    }
    if ( i != j )
        data.erase(j, i - j);

    return true;
}

int gl::toi(const char * s)
{
    return std::atoi(s);
}

gl::intint gl::toii(const string & s)
{
    std::istringstream is(s);
    gl::intint r = 0;
    is >> r;
    return r;
}


std::vector<string> gl::tokenise(const string & s)
{
    TRACE
    std::istringstream is(s);
    std::vector<string> r;
    r.reserve(100);

    while (1)
    {
        string q;
        is >> q;
        if ( !is ) break;
        if ( q.empty() ) continue;
        if (0) if ( q[0] == '\"' )
            {
                string t;
                std::getline(is, t, '\"');
                q = q.substr(1) + t;
            }
        r.push_back(q);
    }

    return r;
}

string gl::tosHex(int x, size_t length)
{
    std::ostringstream os;
    os << std::hex << x;
    string r = os.str();

    while ( r.size() < length )
        r = "0" + r;

    if ( r.size() > length )
        r = r.substr(0, length);

    return tolower(r);
}

string gl::tolower(const string & s)
{
    string r = s;
    for ( size_t i = 0; i < r.size(); i++ )
        if ( r[i] >= 'A' && r[i] <= 'Z' )
        {
            r[i] -= 'A';
            r[i] += 'a';
        }
    return r;
}

string gl::unslash(const string & s)
{
    string r;
    for ( size_t i = 0; i < s.size(); i++ )
    {
        if ( s[i] != '\\' )
        {
            r += s[i];
            continue;
        }
        string d;
        while ( ++i < s.size() && ( s[i] >= '0' && s[i] <= '9' ) ) d += s[i];
        --i;
        r += char(toi(d));
    }
    return r;
}

string gl::file2str(const string & file)
{
    std::ifstream in(file.c_str(), std::ios::binary);

    if ( !in )
        return "";

    string r;

    in.seekg(0, std::ios::end);

    size_t sz = gl::x2st(in.tellg());

    if ( sz > MAX_FILE_SIZE )
        return "";

    r.reserve( sz );
    in.seekg(0, std::ios::beg);

    r.assign( std::istreambuf_iterator<char>(in), std::istreambuf_iterator<char>() );

    return r;
}

bool gl::isSufx(const std::string & str, const std::string & sufx)
{
    return
        str.size() >= sufx.size() &&
        str.compare(str.size() - sufx.size(), sufx.size(), sufx) == 0;
}

void printStack()
{
#ifdef TEST_MEMORY
    unsigned * p = (unsigned *)&p;

    while ( 1 )
    {
        if ( ( (*p) & 0xFFFFF000 ) == 0x13131000 )
        {
            if ( (*(p + 2)) == 0x83630093 )
            {
                const char * q = (const char *) * (p + 1);
                printf("%p %p %s\n", (void *)(*p), q, q);
                if ( (*p) & 0xFFF ) {}
                else break;
            }
        }
        p++;
    }
#endif
}


int gl::calendarDays(int year, int month)
{
    // returns the number of the days in a month
    int day = 0;

    if (month == 1 || month == 3 || month == 5 || month == 7
            || month == 8 || month == 10 || month == 12)
        day = 31;

    if (month == 4 || month == 6 || month == 9 || month == 11 )
        day = 30;

    if (month == 2)
        day = (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) ? 29 : 28;

    return day;
}

void gl::nextDay(int & year, int & month, int & day)
{
    if ( ++day > calendarDays(year, month) )
    {
        day = 1;
        ++month;
    }

    if ( month > 12 )
    {
        month = 1;
        ++year;
    }
}

string gl::nextDay(const string & date)
{
    size_t sz = date.size();
    int day = toi( date.substr(sz - 2, 2) );
    int month = toi( date.substr(sz - 4, 2) );
    int year = toi( date.substr(0, sz - 4) );

    nextDay(year, month, day);

    string r = tos(year);
    r += (month < 10 ? "0" : "") + tos(month);
    r += (day < 10 ? "0" : "") + tos(day);

    return r;
}
