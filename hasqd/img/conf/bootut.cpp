#include <string>
#include <iostream>
#include <fstream>
#include <cstdlib>

#include "os_filesys.h"

#include "gl_utils.h"
#include "hq_db.h"

#include "hqconf.h"
#include "hdmnt.h"
#include "os.h"
#include "bootut.h"

using std::string;
using std::cout;

string mnt::cdrom_path = "hasq"; // no leading '/' as it is appended by root_path
bool mnt::need_dhcp = false;
bool debug::flag = false;

using debug::o;

inline os::Path full_cdrom_path()
{
    return os::Path(mnt::root_path) + mnt::cdrom_path;
}

HqConf load_cfg(string cfg_path);

void print_parts (std::vector <partition> p_p)
{
    cout << "-----" << std::endl;
    for (size_t i = 0; i < p_p.size(); i++)
    {
        cout << p_p[i].name << " - " << p_p[i].fs << std::endl;
    }
}

string find_cfg_on_hd()
{
    o("enter find_cfg_on_hd");

    mnt::init_hdmount();

    o("mnt::init_hdmount done");

    print_parts (mnt::hds);
    print_parts (mnt::dvs);

    o("printing done");

    mnt::hdmount(0);

    if ( mnt::hds.empty() )
        return "";

    for ( size_t i = 0; i < mnt::hds.size(); i++ )
    {
        HqConf cfg;
        string mntname = mnt::hds[i].name;
        void mntfx(string &);
        mntfx(mntname);
        os::Path p = mntname;
        p += cfg.filename();
        std::ifstream in(p.str().c_str());
        if ( !in ) continue;
        cfg.loadFromStream(in);
        return mntname;
    }

    return "";
}

void mntfx(string & s)
{
    string::size_type i = s.find("/dev/");
    if ( i == string::npos )
        throw "Path '" + s + "' does not have '/dev/'";

    s.replace(i, 5, "/mnt/");
}

void start_hasq_srv_at(string path_on_hd)
{
    o("start_hasq_srv_at", __LINE__);
    HqConf cfg = load_cfg(path_on_hd);

    o("start_hasq_srv_at", __LINE__);
    os::set_ip (cfg.interface, cfg.subnetmask, cfg.broadcast, cfg.gateway);

    o("start_hasq_srv_at", __LINE__);
    void set_other_network(string namesrv, string hname, std::vector<string> hosts);
    set_other_network(cfg.nameserver, cfg.hostname, cfg.hosts);

    o("start_hasq_srv_at", __LINE__);
    os::restart_network_service();

    o("start_hasq_srv_at", __LINE__);
    void generate_files(const HqConf & cfg, string path);
    generate_files(cfg, path_on_hd);

    o("start_hasq_srv_at", __LINE__);
    string hwd = (os::Path(mnt::root_path) + "tmp" + "hasqworkdir").str();
    std::ofstream of(hwd.c_str());
    if ( !of ) throw "Cannot write to " + hwd;
    of << path_on_hd << '\n';

    o("start_hasq_srv_at", __LINE__);
}

void generate_db_traits(const HqConf::Db & cf, string path)
{

    db::DbCfg dbcfg;

    dbcfg.dir_slice = os::Path(path) + dbcfg.dir_slice;

    db::Database db(dbcfg);

    db::Traits traits(db, cf.dir, cf.hash, cf.text, std::atoi(cf.nG.c_str()),
                      cf.magic, std::atoi(cf.sliceKb.c_str()),
                      std::atoi(cf.thin.c_str()), cf.limit );

    std::cout << ' ' << cf.dir << std::flush;

    traits.save();
}

void generate_files(const HqConf & cfg, string path)
{
    o("generate_files", __LINE__);

    std::cout << "generating db.traits at " << path << " : [";
    for ( size_t i = 0; i < cfg.dbs.size(); i++ )
        generate_db_traits(cfg.dbs[i], path);
    std::cout << " ]\n";

    o("generate_files", __LINE__);
    // generate script
    {
        ///string hasqd = (full_cdrom_path() + "hasqd").str();
        string scrpt = (os::Path(path) + "start_hasqd.sh").str();
        std::ofstream of(scrpt.c_str(), std::ios::binary);
        of << "#!/bin/sh\n";
        of << "hasqd";
        if ( !cfg.clo.empty() ) of << ' ' << cfg.clo;
        of << '\n';
    }
    o("generate_files", __LINE__);
}

string writableHd()
{
    if ( mnt::hds.empty() ) return "";
    string r = mnt::hds[0].name;
    mntfx(r);
    return r;
}

HqConf load_cfg(string cfg_path)
{
    HqConf cfg;

    if (!cfg.loadFromPath(cfg_path))
        throw "Cannot load config from " + cfg_path;

    return cfg;
}

HqConf load_cfg_cd()
{
    print_parts (mnt::cds);

    mnt::hdmount(1);

    return load_cfg(full_cdrom_path().str());
}

void write_cfg(const HqConf & cfg, string path)
{
    cout << "Writing config at " << path << '\n';
    cfg.saveAtPath(path);
}


void set_other_network(string namesrv, string hname, std::vector<string> hosts)
{
    os::Path root(mnt::root_path);

    {
        std::ofstream of( (root + "etc/resolve.conf").str().c_str() );
        if (!of) throw "Cannot open /etc/resolve.conf for writing";
        of << "nameserver " << namesrv << '\n';
    }

    {
        std::ofstream of( (root + "etc/hostname").str().c_str() );
        if (!of) throw "Cannot open /etc/hostname for writing";
        of << hname << '\n';
    }

    {
        std::ofstream of( (root + "etc/hosts").str().c_str() );
        if (!of) throw "Cannot open /etc/hosts for writing";

        for ( size_t i = 0; i < hosts.size(); i++ )
        {
            string line = hosts[i];
            gl::replaceAll(line, "$hostname", hname);
            of << line << '\n';
        }
    }
}

void ask(const string & prompt, string & value, bool word)
{
    cout << prompt << " (" << value << ") : ";
    string line;
    std::getline(std::cin, line);
    if ( line.empty() ) return;

    if (word)
    {
        std::istringstream is(line);
        is >> value;
    }
    else
        value = line;
}

void confirm(const string prompt, const string & value)
{
    cout << prompt << '\t' << value << '\n';
}

void debug::o(const string & s, int ln)
{
    if ( !flag ) return;
    cout << "DBG: [" << s << "]";

    if ( ln >= 0 )
        cout << " line=" << ln;

    cout << "\n";
}

bool formatHd()
{
    if ( mnt::dvs.empty() )
        return false;

    string dev = mnt::dvs[0].name;

    string y = "yes";
    ask("Do you want to create partition on " + dev + "?", y);

    if ( y == "n" || y == "no" )
        return false;

    system( ("sh /hasq/scr/autoformat.sh " + dev).c_str() );

    y = "yes";

    ask("Do you want to reboot [yes: reboot, no: enter shell] ?", y);

    if ( y == "n" || y == "no" )
        return false;

    return true;
}

