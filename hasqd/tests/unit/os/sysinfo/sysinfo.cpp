// Hasq Technology Pty Ltd (C) 2013-2015

#include <iostream>

#include "os_sysinfo.h"

int main()
{
    os::Info i;

    std::cout << "Disk use Mb: " << i.diskUseMb << '\n';
    std::cout << "Disk tot Mb: " << i.diskTotMb << '\n';
    std::cout << "Mem use Mb: " << i.memUseMb << '\n';
    std::cout << "Mem tot Mb: " << i.memTotMb << '\n';
}
