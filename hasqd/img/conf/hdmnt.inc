#include <fstream>

#include "os_filesys.h"

#include "hdmnt.h"

std::vector<partition> mnt::cds;
std::vector<partition> mnt::hds;
std::vector<partition> mnt::dvs;
string mnt::root_path = "sim_root/";

string getfs(os::Path);

void mnt::hdmount(int) {}
void mnt::init_hdmount()
{
    os::Path dev(root_path);
    dev += "dev";

    os::Dir dir = os::FileSys::readDirEx(dev, true, true);

    for ( size_t i = 0; i < dir.dirs.size(); i++)
    {
        os::Path pi = dev + dir.dirs[i];
        string fs = getfs(pi);

        if ( fs.empty() )
            dvs.push_back(partition(pi.str(), "none"));
        else
            hds.push_back(partition(pi.str(), fs));
    }
}

string getfs(os::Path p)
{
    p += "fs";
    std::ifstream in(p.str().c_str());

    if ( !in ) return "";

    string r;
    in >> r;
    return r;
}


