#!/usr/bin/env python
 
import sys
import urllib2

if ( len(sys.argv) < 3 ) or ( sys.argv[1].lower() == "-h"):
    print("Syntax: host:port command")
    quit()

host_port = sys.argv[1]
host = host_port[:host_port.find(":")]
port = host_port[host_port.find(":") + 1:]
cmd = sys.argv[2]

try:
    resp = urllib2.urlopen("http://" + host_port + "/" + cmd).read()
except:
    print("Error: Unreachable server " + host_port)
else:
    print resp
