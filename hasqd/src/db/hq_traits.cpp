// Hasq Technology Pty Ltd (C) 2013-2015

#include <fstream>
#include <sstream>
#include <limits.h>

#include "gl_except.h"
#include "gl_protocol.h" // CRLF for str()

#include "hq_traits.h"
#include "hq_db.h"

bool db::normRecDataLimit(const string & hashName, RecDataLimit & dl)
{
    if ( dl.ssize.empty() || dl.ssize[0] == '-' )
    {
        dl.size = INT_MAX;
        dl.ssize = "-1";
    }
    else
    {
        char sk = dl.ssize[dl.ssize.size() - 1];
        int k = 1, n = -1;
        db::Dn * dn = 0;
        switch (sk)
        {
            case 'k' : sk = 'K';
            case 'K' : k = 1024; break;
            case 'm' : sk = 'M';
            case 'M' : k = 1024 * 1024; break;
            case 'h' : sk = 'H';
            case 'H' : dn = db::Dn::create(hashName, "1", true);
                if ( !dn ) return false;
                k = dn->getSize() + 1;
                delete dn;
                break;
            case 'b' :
            case 'B' : sk = 'B'; break;
            default  : sk = 'B'; n = gl::toi(dl.ssize);
        }
        if ( n == -1 ) n = gl::toi(dl.ssize.substr(0, dl.ssize.size() - 1));
        if ( n > INT_MAX / k ) dl.size = INT_MAX;
        else dl.size = n * k;
        dl.ssize = gl::tos(n) + sk;
    }
    return true;
}

bool db::loadTraitsData(const string & filename, TraitsData & data)
{
    std::ifstream in(filename.c_str());

    if ( !in ) return false;

    in >> data.uniqueName >> data.hashNameShort >> data.hashNameFull;

    if ( !in ) return false;

    string snG, mag, sK, sT;

    in >> snG >> mag >> sK >> sT;
    if ( !in ) return false;

    string::size_type msz = mag.size();

    if ( msz < 2 || mag[0] != '[' || mag[msz - 1] != ']' ) return false;

    data.nG = gl::toi(snG);
    data.magic = mag.substr(1, mag.size() - 2);
    data.sliceKb = gl::toi(sK);
    data.thinness = gl::toi(sT);

    in >> data.dl.ssize;

    return db::normRecDataLimit(data.hashNameShort, data.dl);
}

db::Traits::Traits(const Database & db): config(db.cfg()) {}

void db::Traits::generateAltName()
{
    string alt = gl::tos(data.nG) + data.magic + data.hashNameShort;
    db::Dn * dn = db::Dn::create(data.hashNameShort, alt, true);
    if ( !dn )
        throw gl::ex("Cannot create DN for type [$1]", data.hashNameShort);
    alt = dn->str();
    delete dn;
    altName = alt;
}

db::Traits::Traits(const Database & db, string un, string hns, string hnf, int ng, string mag,
                   int size, int thin, string datalimit)
    : altName(), config(db.cfg())
{
    data.uniqueName = un;
    data.hashNameShort = hns;
    data.hashNameFull = hnf;
    data.nG = ng;
    data.magic = mag;
    data.sliceKb = size;
    data.thinness = thin;

    data.dl.ssize = datalimit;
    db::normRecDataLimit(hns, data.dl);

    generateAltName();
}

bool db::Traits::load(const string & filename)
{
    if ( !db::loadTraitsData(filename, data) )
        return false;

    generateAltName();
    return true;
}

void db::Traits::save(std::ostream & of) const
{
    of << data.uniqueName << '\n';
    of << data.hashNameShort << '\n';
    of << data.hashNameFull << '\n';
    of << data.nG << '\n';
    of << "[" << data.magic << "]" << '\n';
    of << data.sliceKb << '\n';
    of << data.thinness << '\n';
    of << data.dl.ssize << '\n';
    of << altName << '\n';
}

string db::Traits::str() const
{
    std::ostringstream os;
    os << "{" << gl::CRLF;
    os << "name=" << data.uniqueName << gl::CRLF;
    os << "hash=" << data.hashNameShort << gl::CRLF;
    os << "description=" << data.hashNameFull << gl::CRLF;
    os << "nG=" << data.nG << gl::CRLF;
    os << "magic=" << "[" << data.magic << "]" << gl::CRLF;
    os << "size=" << data.sliceKb << gl::CRLF;
    os << "thin=" << data.thinness << gl::CRLF;
    os << "datalimit=" << data.dl.ssize << gl::CRLF;
    os << "altname=" << altName << gl::CRLF;
    os << "}" << gl::CRLF;
    return os.str();
}

void db::Traits::save(const string & filename) const
{
    std::ofstream of(filename.c_str(), std::ios::binary);

    save(of);

    if ( !of )
    {
        throw gl::ex("Error while writing file " + filename);
    }
}

void db::Traits::save() const
{
    using namespace os;
    Path file(config->dir_slice);
    file += data.uniqueName;
    FileSys::trymkdir(file);
    file += config->fil_trait;
    save(file.str());
}

