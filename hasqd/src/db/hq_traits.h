// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_TRAITS
#define _HQ_TRAITS

#include <string>
#include <ostream>

using std::string;

#include "hq_dbcfg.h"

namespace db
{

class Database;

struct RecDataLimit
{
    static const int RD_MAX = 10000000;
    string ssize;
    int    isize;

    bool norm(const string & hashName);
};

struct TraitsData
{
    string uniqueName;    // dir name (used in comm) [maybe different at diff publishers]
    string hashNameShort; // hash working name, i.g. md5, s25 [same in all publishers]
    string hashNameFull;  // readable explanation of hash type
    int    nG;
    string magic;
    int    sliceKb;
    int    thinness;
    RecDataLimit dl;
};

bool loadTraitsData(const string & filename, TraitsData & data);

class Traits
{
        db::TraitsData data;

        string altName;       // alternative name - hash of nG+magic+hashNameShort

        void generateAltName();
        void operator=(const Traits &);

        void save(std::ostream & os) const;

    public:

        const DbCfg * const config;

        Traits(const Database & db, string un, string hns, string hnf,
               int ng, string mag, int size, int thin, string datalimit);

        Traits(const Database & db);
        bool load(const string & filename);

        void save(const string & filename) const;
        void save() const;
        string str() const;

        os::Path getSlicePath() const { return config->dir_slice + data.uniqueName; }
        os::Path getMetaPath() const { return getSlicePath() + config->meta; }
        os::Path getIndexPath() const { return config->dir_index + data.uniqueName; }
        const string & getAltName() const { return altName; }

        string sn() const { return data.hashNameShort; }
        const string & mag() const { return data.magic; }
        int nG() const { return data.nG; }
        int skb() const { return data.sliceKb; }
        int dls() const { return data.dl.isize; }
        string un() const { return data.uniqueName; }
        int thinness() const { return data.thinness; }
};


} // db

#endif
