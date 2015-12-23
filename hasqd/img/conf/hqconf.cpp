#include <iostream>
#include <fstream>
#include <sstream>
#include <cctype>

#include "os_filesys.h"

#include "hqconf.h"

string HqConf::filename()
{
    static const char s[] = "hasqd.conf";
    return s;
}

string HqConf::mazconst()
{
    string r;
    int a = 1, b = 1;
    for ( int i = 0; i < 60; i++ )
    {
        r += char(a + '0');
        int x = a + b;
        a = b;
        b = x % 10;
    }
    return r;
}

bool HqConf::loadFromFile()
{
    std::ifstream in(filename().c_str());
    if ( !in ) return false;
    loadFromStream(in);
    if ( !in ) throw "Config file " + filename() + " is corrupted";
    return true;
}

bool HqConf::loadFromPath(std::string & path)
{
    string file = (os::Path(path) + filename()).str();

    std::ifstream in(file.c_str());
    if ( !in ) return false;
    loadFromStream(in);
    if ( !in ) throw "Config file " + filename() + " is corrupted";
    return true;
}

void HqConf::loadFromStream(std::istream & in)
{

    string s;
    in >> s;
    if ( s != mazconst() ) throw "Config " + filename() + " must start with constant";

    while (in >> s)
    {
        if ( s.empty() ) break;
        if ( s[0] == '#' ) {}

        else if ( s == "interface") { in >> interface; }
        else if ( s == "subnetmask") { in >> subnetmask; }
        else if ( s == "broadcast") { in >> broadcast; }
        else if ( s == "gateway") { in >> gateway; }
        else if ( s == "nameserver") { in >> nameserver; }
        else if ( s == "hostname") { in >> hostname; }
        else if ( s == "hosts") { loadHosts(in); }
        else if ( s == "CLO") { std::getline(in, clo); eatSpaces(clo); }
        else if ( s == "DB") { loadDb(in); }
        else if ( s == mazconst() ) break;

        else throw "Config " + filename() + " unknown parameter " + s;
    }
}


void HqConf::loadHosts(std::istream & in)
{
    string line;
    in >> line;
    eatSpaces(line);
    if ( line != "{" ) throw "Config file " + filename() + " hosts must start with '{'";

    while (1)
    {
        std::getline(in, line);
        eatSpaces(line);
        if ( line.empty() ) continue;
        if ( line == "}" ) break;
        hosts.push_back(line);
    }

    if ( !in ) throw "Config file " + filename() + " is corrupted";
}

void HqConf::loadDb(std::istream & in)
{
    string line;
    in >> line;
    eatSpaces(line);
    if ( line != "{" ) throw "Config file " + filename() + " DB must start with '{'";

    while (1)
    {
        std::getline(in, line);
        eatSpaces(line);
        if ( line.empty() ) continue;
        if ( line == "}" ) break;

        Db db;


        std::istringstream is(line);

        is >> db.dir >> db.hash >> db.text;
        is >> db.nG >> db.magic >> db.sliceKb;
        is >> db.thin >> db.limit;

        string::size_type i = db.magic.find("[");
        string::size_type j = db.magic.find("]");

        if ( i == string::npos || j == string::npos || j <= i )
            throw "Config file " + filename() + " - bad magic";

        db.magic = db.magic.substr(i + 1, j - i - 1);
        db.isValid();
        dbs.push_back(db);

    }

    if ( !in ) throw "Config file " + filename() + " is corrupted";
}

void HqConf::eatSpaces(string & s)
{
    while ( !s.empty() && std::isspace(s[0]) ) s = s.substr(1);
    while ( !s.empty() && std::isspace(s[s.size() - 1]) ) s = s.substr(0, s.size() - 1);
}

void HqConf::patchStr(string & s) const
{
    size_t i = findOffset(s);
    const string c = saveToStr();

    for ( size_t j = 0; j < c.size(); j++ )
        s[i + j] = c[j];
}

size_t HqConf::findOffset(const string & s)
{
    string mc = mazconst();
    size_t k, j, i = s.find(mc);

    if ( i == string::npos ) { std::cout << "No config found\n"; goto bad; }

    j = s.find(mc, i + 1);

    if ( j == string::npos ) { std::cout << "Config is not recognised\n"; goto bad; }

    k = i + Size - mc.size() - 1; // -1 for EOL
    if ( j != k )
    {
        std::cout << "Config has incorrect size "
                  << i << ' ' << j << ' ' << Size << ' ' << mc.size() << ' ' << k << "\n";
        goto bad;
    }

    return i;

bad:
    throw string() + "Config is not found in file";
}

string HqConf::saveToStr() const
{
    string r = mazconst() + '\n';

    r += "interface " + interface + '\n';
    r += "subnetmask " + subnetmask + '\n';
    r += "broadcast " + broadcast + '\n';
    r += "gateway " + gateway + '\n';
    r += "nameserver " + nameserver + '\n';
    r += "hostname " + hostname + '\n';
    r += "CLO " + clo + '\n';

    r += "hosts\n{\n";
    for ( size_t i = 0; i < hosts.size(); i++ )
        r += hosts[i] + '\n';
    r += "}\n";

    r += "DB\n{\n";
    for ( size_t i = 0; i < dbs.size(); i++ )
    {
        r += dbs[i].dir;
        r += " " + dbs[i].hash;
        r += " " + dbs[i].text;
        r += " " + dbs[i].nG;
        r += " [" + dbs[i].magic + ']';
        r += " " + dbs[i].sliceKb;
        r += " " + dbs[i].thin;
        r += " " + dbs[i].limit + '\n';
    }
    r += "}\n";

    string mc = mazconst();
    size_t msz = Size - mc.size() - 1;
    while (r.size() < msz - 60 ) r += "#                                                    #\n";
    while (r.size() < msz - 4 ) r += "# #\n";
    while (r.size() < msz ) r += "\n";

    r += mc + '\n';

    if ( r.size() != Size )
        throw "Config is too big";

    return r;
}

void HqConf::loadFromStr(const string & s)
{
    size_t i = findOffset(s);
    string c = s.substr(i, Size);
    std::istringstream is(c);
    loadFromStream(is);
}

void HqConf::saveToFile() const
{
    std::ofstream of(filename().c_str(), std::ios::binary);
    of << saveToStr();
}

void HqConf::saveAtPath(string path) const
{
    string fpath = (os::Path(path) + filename()).str();
    std::ofstream of(fpath.c_str(), std::ios::binary);
    of << saveToStr();
}


void HqConf::Db::isValid() const
{
    string s;
    if ( dir.empty() ) throw s + "Config 'dir' is not specified";
    if ( hash.empty() ) throw s + "Config 'hash' is not specified";
    if ( nG.empty() ) throw s + "Config 'nG' is not specified";
    if ( sliceKb.empty() ) throw s + "Config 'sliceKb' is not specified";
    if ( thin.empty() ) throw s + "Config 'thin' is not specified";
    if ( limit.empty() ) throw s + "Config 'limit' is not specified";
}

