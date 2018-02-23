#include <string>
#include <iostream>
#include <fstream>
#include <cstdlib>
#include <cctype>

#include "os_filesys.h"

#include "hqconf.h"
#include "hdmnt.h"
#include "os.h"

#include "hq_db.h"
#include "bootut.h"

using std::string;
using std::cout;

string hosts2str(std::vector<string> hosts)
{
    string r;
    for ( size_t i = 0; i < hosts.size(); i++ )
    {
        string h = hosts[i];
        if ( i ) r += "; ";
        r += h;
    }
    return r;
}

std::vector<string> str2hosts(string shosts)
{
    std::istringstream is(shosts);
    std::vector<string> r;
    while (1)
    {
        string line;
        std::getline(is, line, ';');
        while ( !line.empty() )
        {
            size_t j = line.size() - 1;
            if ( std::isspace(line[0]) )
                line = line.substr(1);
            else if ( std::isspace(line[j]) )
                line = line.substr(0, j);
            else
                break;
        }

        if ( line.empty() )
            break;

        r.push_back(line);
    }
    return r;
}

bool isok()
{
    string y = "yes";
    ask("Correct? ", y);
    if ( y == "y" || y == "yes" ) return true;
    return false;
}

void ask_net(HqConf & cfg)
{
    cout << string(20, '-') << '\n';
    cout << "\nSetting up network server options\n";

    while (1)
    {
        ask("Network interface", cfg.interface);
        ask("Subnetmask", cfg.subnetmask);
        ask("Broadcast", cfg.broadcast);
        ask("Gateway", cfg.gateway);
        ask("Nameserver", cfg.nameserver);
        ask("Hostname", cfg.hostname);

        string shosts = hosts2str(cfg.hosts);
        ask("Enter hosts, semicolon separated list", shosts, false);
        cfg.hosts = str2hosts(shosts);

        cout << string(20, '-') << '\n';

        confirm("Network interface", cfg.interface);
        confirm("Subnetmask       ", cfg.subnetmask);
        confirm("Broadcast        ", cfg.broadcast);
        confirm("Gateway          ", cfg.gateway);
        confirm("Nameserver       ", cfg.nameserver);
        confirm("Hostname         ", cfg.hostname);
        confirm("Hosts file", "");

        for ( size_t i = 0; i < cfg.hosts.size(); i++ )
            confirm("\t", cfg.hosts[i]);

        if ( isok() ) break;
    }
}

void ask_clo(HqConf & cfg)
{
    cout << string(20, '-') << '\n';
    while (1)
    {
        ask("Enter hasqd command line options", cfg.clo);
        confirm("Command line options : ", cfg.clo);
        if ( isok() ) break;
    }
}

void ask_db(HqConf & cfg);
void ask_questions(HqConf & cfg)
{
    ask_net(cfg);
    ask_clo(cfg);
    ask_db(cfg);
}

void run_console()
{
    string y = "no";
    ask("Do you want to use unix shell to set any other system settings?", y);

    if ( y == "n" || y == "no" )
        return;

    cout << "To exit unix shell, type 'exit'\n";
    os::console();
}

// returns 0,1,1000-1idx,2000-2idx
int show_dbs(const HqConf::Dbs & dbs)
{
    cout << "List of databases:\n";
    for ( size_t i = 0; i < dbs.size(); i++ )
        cout << '\t' << (i + 1) << '\t' << dbs[i].dir
             << " (" << dbs[i].hash << ")\n";

    string r = "q";
    ask("Add [a], Show [s], Remove [r], or Quit [q]", r);
    if ( r == "q" ) return 0;
    if ( r == "a" ) return 1;

    if ( r == "s" || r == "r" )
    {
        string a = "1";
        ask("\tEnter database index", a);
        int i = std::atoi(a.c_str()) - 1;
        if ( i < 0 || i >= (int)dbs.size() )
        {
            cout << "Index must have value from 1 to " << dbs.size() << '\n';
            return 3;
        }
        return 1000 + i + (r == "r" ? 1000 : 0);
    }

    cout << "Please enter a,s,r, or q\n";
    return 3;
}

HqConf::Db add_db(const HqConf::Dbs & dbs);
void show_db(HqConf::Db db);

void ask_db(HqConf & cfg)
{
    cout << string(20, '-') << '\n';
    while (1)
    {
        int reply = show_dbs(cfg.dbs);

        if ( !reply )
            return;

        if ( reply == 3 ) continue;

        if ( reply == 1 )
        {
            HqConf::Db db = add_db(cfg.dbs);

            if ( !db.dir.empty() )
                cfg.dbs.push_back(db);

            continue;
        }

        if ( reply >= 1000 && reply < 2000 ) // show
        {
            show_db(cfg.dbs[reply - 1000]);
            continue;
        }

        if ( reply >= 2000 && reply < 3000 ) // show
        {
            cfg.dbs.erase(cfg.dbs.begin() + (reply - 2000));
            continue;
        }

        if ( isok() ) break;
    }
}

void show_db(HqConf::Db db)
{
    confirm("Database name : ", db.dir);
    confirm("Hash type     : ", db.hash);
    confirm("Description   : ", db.text);
    confirm("nG            : ", db.nG);
    confirm("Magic         : ", db.magic);
    confirm("SliceKb       : ", db.sliceKb);
    confirm("Thinness      : ", db.thin);
    confirm("Data limit    : ", db.limit);
}

HqConf::Db add_db(const HqConf::Dbs & dbs)
{
    HqConf::Db db; // db.dir empty - return error

    string hashType = "md5";
    string hlongName;
    ask("Enter database hash type, one of wrd/md5/s22/s25/r16", hashType);

    {
        db::Dn * r = db::Dn::create(hashType, "", true);
        if (!r)
        {
            cout << "This hash type is not supported [" << hashType << "]\n";
            return db;
        }

        hlongName = r->hashNameLong();
    }

    string longName;
    ask("Enter hash descriprion", hlongName);
    longName = hlongName;

    string uniqueName = hashType;
    ask("Enter unique name for the database", uniqueName);

    for ( size_t i = 0; i < dbs.size(); i++ )
        if ( dbs[i].dir == uniqueName )
        {
            cout << "No multiple databases with the same unique name allowed\n";
            return db;
        }

    db.dir = uniqueName;
    db.hash = hashType;
    db.text = hlongName;

    db.nG = "1";
    ask("Enter number of G's", db.nG);

    db.sliceKb = "100";
    ask("Enter slice size in Kb", db.sliceKb);

    db.magic = "";
    ask("Enter magic string", db.magic);

    db.thin = "0";
    ask("Enter database thinness", db.thin);

    db.limit = "5H";
    ask("Enter record data limit [-1 (unlimited) or suffix: b,K,M,H]", db.limit);

    // now calculate alternative name
    string alt = db.nG + db.magic + db.hash;
    db::Dn * dn = db::Dn::create(db.hash, alt, true);
    alt = dn->str();
    delete dn;

    cout << "Database hash name calculated as : " << alt << '\n';

    db.isValid();
    return db;
}


