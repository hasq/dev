#!/usr/bin/env python
 
import sys
import urllib2
import ts_cnf

if len(sys.argv) != 2:
    print("Usage: python raw_cmd_tcp.py COMMAND")
    quit()

CRLF_CRLF = 2 * (chr(13) + chr(10))

cmd = sys.argv[1] + CRLF_CRLF

try:
    resp = urllib2.urlopen("http://" + ts_cnf.HOST + ":" + ts_cnf.PORT + "/" + cmd).read()
except:
    print("Error: Unreachable server " + ts_cnf.HOST + ":" + ts_cnf.PORT)
else:
    print("Server reply: " + resp)
