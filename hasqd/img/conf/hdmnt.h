#include <vector>
#include <string>

using std::string;

struct partition
{
    string name;
    string fs;
    partition(const string & n, const string & f): name(n), fs(f) {}
};

namespace mnt
{
extern std::vector<partition> cds; // read-only FS
extern std::vector<partition> hds; // hard disks, can write files
extern std::vector<partition> dvs; // hard disk devices, no access to FS

void init_hdmount();
void hdmount(int);

extern string root_path;
extern string cdrom_path;
extern bool need_dhcp;
} // mnt
