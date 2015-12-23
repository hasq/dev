#include <iostream>
#include <vector>
#include <string>

//#define  _POSIX_C_SOURCE 200809L
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <libudev.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <linux/hdreg.h>
#include <errno.h>
#include <sys/mount.h>
#include <unistd.h>
#include <err.h>
#include <blkid/blkid.h>

using std::string;
#include "hdmnt.h"
#include "hqconf.h"
#include "bootut.h"

std::vector<partition> mnt::cds;
std::vector<partition> mnt::hds;
std::vector<partition> mnt::dvs;
string mnt::root_path = "/";

bool cdrom_mounted = false;

using debug::o;

struct blockdev_stats
{
    unsigned long long  read_ops;       /* Number of read I/Os processed */
    unsigned long long  read_merged;    /* Number of read I/Os merged with in-queue I/O */
    unsigned long long  read_512bytes;  /* Number of sectors read */
    unsigned long long  read_waits_ms;  /* Total wait time for read requests, milliseconds */
    unsigned long long  write_ops;      /* Number of write I/Os processed */
    unsigned long long  write_merged;   /* Number of write I/Os merged with in-queue I/O */
    unsigned long long  write_512bytes; /* Number of sectors written */
    unsigned long long  write_waits_ms; /* Total wait time for write requests, milliseconds */
    unsigned long long  in_flight;      /* Number of I/Os currently in flight */
    unsigned long long  active_ms;      /* Total active time, milliseconds */
    unsigned long long  waits_ms;       /* Total wait time, milliseconds */
};

/* Returns nonzero if stats is filled with the above values.
*/
static inline int get_blockdev_stats(struct udev_device * const device, struct blockdev_stats * const stats)
{
    if (device != NULL && stats != NULL)
    {
        const char * const s = udev_device_get_sysattr_value(device, "stat");
        if (s == NULL || *s == '\0')
            return 0;
        if (sscanf(s, "%llu %llu %llu %llu %llu %llu %llu %llu %llu %llu %llu",
                   &(stats->read_ops), &(stats->read_merged), &(stats->read_512bytes), &(stats->read_waits_ms),
                   &(stats->write_ops), &(stats->write_merged), &(stats->write_512bytes), &(stats->write_waits_ms),
                   &(stats->in_flight), &(stats->active_ms), &(stats->waits_ms)) >= 11)
            return 11;
    }
    return 0;
}

/* NULL pointer safe string comparison.
 * Returns 1 if neither pointer is NULL, and the strings they point to match.
*/
static inline int eq(const char * const a, const char * const b)
{
    if (a == NULL || b == NULL)
        return 0;
    else
        return !strcmp(a, b);
}

/* NULL pointer safe string to long long conversion.
*/
static inline long long stoll(const char * const string, const long long error)
{
    if (!string || *string == '\0')
        return error;
    return strtoll(string, NULL, 10);
}

void mnt::init_hdmount()
{
    o("inihd 1 mnt::init_hdmount()");
    struct udev      *      udevhandle;
    struct udev_enumerate * blockdevices;
    struct udev_list_entry * entry;
    const char       *      devicepath;
    struct udev_device   *  device;

    int fd;
    struct hd_driveid hd;
    int ec;
    o("inihd 2");
    /* Get an udev handle. */
    udevhandle = udev_new();
    if (!udevhandle)
        throw string() + "Cannot get udev handle.";

    o("inihd 3");
    /* Enumerate block devices. */
    blockdevices = udev_enumerate_new(udevhandle);
    udev_enumerate_add_match_subsystem(blockdevices, "block");
    udev_enumerate_scan_devices(blockdevices);
    o("inihd 4");

    /* Iterate through the enumerated list. */
    udev_list_entry_foreach(entry, udev_enumerate_get_list_entry(blockdevices))
    {
        o("inihd 5");

        /* Use the devpath in the list to obtain a reference to the device. */
        devicepath = udev_list_entry_get_name(entry);
        device = udev_device_new_from_syspath(udevhandle, devicepath);

        o("inihd 6");
        /* Do the following only for "disk" devtypes in "block" subsystem: */
        if (eq("disk", udev_device_get_devtype(device)))
        {
            const char * const dev = udev_device_get_devnode(device); /* In /dev */
//          const long        size = stoll(udev_device_get_sysattr_value(device, "size"), -2048LL) / 2048LL;
            const long        removable = stoll(udev_device_get_sysattr_value(device, "removable"), -1LL);
//          const long        readonly = stoll(udev_device_get_sysattr_value(device, "ro"), -1LL);
//          struct blockdev_stats stats;

            o("inihd 7");
            if ((fd = open(dev, O_RDONLY | O_NONBLOCK)) >= 0)
            {
                ec = ioctl(fd, HDIO_GET_IDENTITY, &hd);
                if (!ec)
                {
                    if (dev)
                    {
//                      printf("%s:\n", dev);
//                      printf("Hard Disk Model: %.40s\n", hd.model);
//                      if (size > 0L)
//                          printf("\tSize: %ld MiB\n", size);
//                      if (removable == 0L)
//                          printf("\tRemovable: No\n");
//                      else
//                          if (removable == 1L)
//                              printf("\tRemovable: Yes\n");
//                      if (readonly == 0L)
//                          printf("\tRead-only: No\n");
//                      else
//                          if (readonly == 1L)
//                              printf("\tRead-only: Yes\n");

                        o("inihd 8");

                        if (removable == 1L)
                        {
                            o("inihd 81");
                            cds.push_back(partition(dev, "iso9660"));
                        }
                        else
                        {
//Get UUID, label and type
//                          const char *uuid;
//                          const char *label;
                            o("inihd 82");
                            const char * filesystem = NULL;
                            blkid_probe pr = blkid_new_probe_from_filename(dev);
                            if (!pr)
                            {
                                err(1, "Failed to open %s", dev);
                            }
// Get number of partitions
                            blkid_partlist ls;
                            int nparts, i;

                            o("inihd 83");
                            ls = blkid_probe_get_partitions(pr);
                            nparts = blkid_partlist_numof_partitions(ls);
//                          printf("Number of partitions:%d\n", nparts);

                            o("inihd 84");
                            if (nparts > 0)
                            {

                                o("inihd 85");
                                for (i = 0; i < nparts; i++)
                                {
                                    char dev_name[256];
                                    o("inihd 851");
                                    sprintf(dev_name, "%s%d", dev, (i + 1));
                                    o("inihd 852");
                                    pr = blkid_new_probe_from_filename(dev_name);
                                    blkid_do_probe(pr);
//                                  blkid_probe_lookup_value(pr, "UUID", &uuid, NULL);
//                                  blkid_probe_lookup_value(pr, "LABEL", &label, NULL);
                                    o("inihd 853");
                                    filesystem = NULL;
                                    blkid_probe_lookup_value(pr, "TYPE", &filesystem, NULL);
//                                  printf("Name=%s, UUID=%s, LABEL=%s, TYPE=%s\n", dev_name, uuid, label, type);
//                                  printf("Name=%s, TYPE=%s\n", dev_name, filesystem);
                                    o("inihd 854");
                                    if (filesystem == NULL || filesystem[0] == '\0')
                                    {
                                        o("inihd 855");
                                        dvs.push_back(partition(dev_name, "NOT FORMATTED"));
                                    }
                                    else
                                    {
                                        o("inihd 856");
                                        hds.push_back(partition(dev_name, filesystem));
                                    }
                                }
                                blkid_free_probe(pr);
                            }
                            else
                            {
                                o("inihd 86");
                                dvs.push_back(partition(dev, "NO PARTITION"));
                            }
                        }
                    }
//                  else
//                      printf("Unknown device:\n");
                }
                close(fd);
            }
        }
        /* Drop the device reference. */
        udev_device_unref(device);
    }
    o("inihd 9");

    /* Release the enumerator object, and the udev handle. */
    udev_enumerate_unref(blockdevices);
    udev_unref(udevhandle);
}

// param = 0 - mount HDDs
// param = 1 - mount CDs
void mnt::hdmount(int p)
try
{
    o("hdmnt 1 mnt::hdmount");
    size_t sz_size;
    char const * diskname, *fstype;
    char * retpath = NULL;

    unsigned long int flags = (MS_MGC_VAL | MS_NOSUID | MS_NOEXEC);

//    for (size_t i=0; i<cds.size(); i++)
    if (p)
    {
        flags |= MS_RDONLY;
    }

    if (p)
        sz_size = cds.size();
    else
        sz_size = hds.size();

    for (size_t i = 0; i < sz_size; i++)
    {
        char path[256] = "/mnt";
        char dev2[256];

        if (p)
        {
            diskname = cds[i].name.c_str();
            fstype = cds[i].fs.c_str();
        }
        else
        {
            diskname = hds[i].name.c_str();
            fstype = hds[i].fs.c_str();
        }

        strcpy(dev2, diskname);
        strcat(path, strrchr(dev2, '/'));

        retpath = (char *) malloc (strlen (path));
        if (retpath == NULL)
            throw string() + "retpath malloc error";
        strcpy (retpath, path);

        if (access (path, F_OK) == -1)
        {
            if (mkdir(path, 0777) < 0)
                std::cout << "Creating " << path << " failed: " << strerror(errno) << std::endl;
        }

        if (mount(diskname, path, fstype, flags, "") < 0)
	{
            //std::cout << "Mounting " << diskname << " to " << path << " failed: " <<  strerror(errno) << std::endl;
	}
    }
}
catch (...)
{
    std::cout << "mnt::hdmount expection\n";
    throw;
}

