#!/usr/bin/env python
 
import sys
import urllib2

if len(sys.argv) != 2:
    print("Usage: python raw_cmd_tcp.py COMMAND")
    quit()

HOST = "tokenswap.com"
PORT = "13131"
CRLF_CRLF = 2 * (chr(13) + chr(10))

cmd = sys.argv[1] + CRLF_CRLF

try:
    resp = urllib2.urlopen("http://" + HOST + ":" + PORT + "/" + cmd).read()
except:
    print("Error: Unreachable server " + HOST + ":" + PORT)
else:
    print("Server reply: " + resp)
