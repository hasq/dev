import sys
import urllib2

if ( len(sys.argv) < 3 ) or ( sys.argv[1].lower() == "-h"):
    print("Syntax: host:port command")
    quit()

host_port = sys.argv[1]
host = host_port[:host_port.find(":")]
port = host_port[host_port.find(":") + 1:]
cmd = sys.argv[2]

def ping(host):
    """
    Returns True if host responds to a ping request
    """
    import os, platform

    # Ping parameters as function of OS
    ping_str = "-n 1 > NUL" if  platform.system().lower()=="windows" else "-c 1 >/dev/null"

    # Ping
    return os.system("ping " + ping_str + " " + host) == 0

if not ping(host):
    print("Error: Unreachable server " + host)
    quit()

try:
    content = urllib2.urlopen("http://" + host_port + "/" + cmd).read()
except:
    print("Error: Unreachable server " + host_port)
else:
    print content
