#include <stdio.h>
#include <termios.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <arpa/inet.h>
#include <net/if.h>
#include <net/route.h>
#include <string.h>
#include <iostream>
#include <fstream>
#include "os.h"
#include "hdmnt.h"

int os::kbhit()
{
    struct termios oldt, newt;
    int ch;
    int oldf;

    tcgetattr(STDIN_FILENO, &oldt);
    newt = oldt;
    newt.c_lflag &= ~(ICANON | ECHO);
    tcsetattr(STDIN_FILENO, TCSANOW, &newt);
    oldf = fcntl(STDIN_FILENO, F_GETFL, 0);
    fcntl(STDIN_FILENO, F_SETFL, oldf | O_NONBLOCK);

    ch = getchar();

    tcsetattr(STDIN_FILENO, TCSANOW, &oldt);
    fcntl(STDIN_FILENO, F_SETFL, oldf);

    if (ch != EOF)
    {
        ungetc(ch, stdin);
        return 1;
    }

    return 0;
}

void os::console()
{
    system("bash");
}

/*
   Ustanovka DNS (nameserver) na C ne osobo reshaetsa
   ta he problema s hostname

   Prosche vsego eto sdelat' cherez:

    echo "127.0.0.1" >> /etc/resolv.conf
    eto nameserver

    echo "hasqserver" > /etc/hostname
    eto hostname
*/

void os::set_ip (string sip, string snetmask, string sbroadcast, string sgateway)
try
{
    if ( sip == "default" )
    {
        mnt::need_dhcp = true;
        return;
    }


    const char * ip = sip.c_str();
    const char * netmask = snetmask.c_str();
    const char * broadcast = sbroadcast.c_str();
    const char * gateway = sgateway.c_str();

    if ((*ip == '\0') || (*netmask == '\0') || (*broadcast == '\0') || (*gateway == '\0'))
        throw string() + "Bad ip, netmask, or gateway";

    const char * interface = "eth0";
    struct ifreq ifr;
    struct rtentry rte;
    struct sockaddr_in * sin;
    int sockfd = -1;

    try
    {

        sockfd = socket(AF_INET, SOCK_DGRAM, IPPROTO_IP);
        if (sockfd < 0)
            throw string() + "Cannot open generic socket";

        // set ip address
        if ( sip != "default" )
        {
            memset(&ifr, 0, sizeof(ifr));
            strcpy(ifr.ifr_name, interface);
            sin = (struct sockaddr_in *)&ifr.ifr_addr;
            sin->sin_family = AF_INET;
            inet_pton(AF_INET, ip, &sin->sin_addr);

            if (ioctl(sockfd, SIOCSIFADDR, &ifr) < 0 )
                throw string() + "SIOCSIFADDR " + strerror(errno);
        }

        // set subnet mask
        if ( snetmask != "default" )
        {
            memset(&ifr, 0, sizeof(ifr));
            strcpy(ifr.ifr_name, interface);
            sin = (struct sockaddr_in *)&ifr.ifr_addr;
            sin->sin_family = AF_INET;
            inet_pton(AF_INET, netmask, &sin->sin_addr);
            if (ioctl(sockfd, SIOCSIFNETMASK, &ifr) < 0 )
                std::cout << "booter: Warning SIOCSIFNETMASK failed: " << strerror(errno) << '\n';
        }

        // set broadcast address
        if ( sbroadcast != "default" )
        {
            memset(&ifr, 0, sizeof(ifr));
            strcpy(ifr.ifr_name, interface);
            sin = (struct sockaddr_in *)&ifr.ifr_addr;
            sin->sin_family = AF_INET;
            inet_pton(AF_INET, broadcast, &sin->sin_addr);
            if (ioctl(sockfd, SIOCSIFBRDADDR, &ifr) < 0 )
                std::cout << "booter: Warning SIOCSIFBRDADDR failed: " << strerror(errno) << '\n';
        }

        // set gatewayip
        if ( sgateway != "default" )
        {
            memset(&rte, 0, sizeof(rte));
            rte.rt_flags = (RTF_UP | RTF_GATEWAY);
            sin = (struct sockaddr_in *)&rte.rt_gateway;
            sin->sin_family = AF_INET;
            inet_pton(AF_INET, gateway, &sin->sin_addr);
            sin = (struct sockaddr_in *)&rte.rt_dst;
            sin->sin_family = AF_INET;
            if (ioctl(sockfd, SIOCADDRT, &rte) < 0)
                std::cout << "booter: Warning SIOCADDRT failed: " << strerror(errno) << '\n';
        }

    }
    catch (...)
    {
        if (sockfd >= 0)
            close(sockfd);
        throw;
    }

    close(sockfd);
}
catch (...)
{
    std::cout << "set_ip exception\n";
    throw;
}

/*
    ioctl(fd, SIOCGIFFLAGS, &ifr);
    strncpy(ifr.ifr_name, name, IFNAMSIZ);
    ifr.ifr_flags |= (IFF_UP | IFF_RUNNING);
    ioctl(fd, SIOCSIFFLAGS, &ifr);
*/

void os::restart_network_service ()
{
    if ( !mnt::need_dhcp )
        return;

    std::ofstream of("/tmp/hasqprerun", std::ios::binary);
    of << "udhcpc\n";
}
