#!/usr/bin/env python

import sys
import socket

if ( len(sys.argv) < 3 ) or ( sys.argv[1].lower() == "-h"):
    print("Syntax: host:port command")
    quit()

host_port = sys.argv[1]
host = host_port[:host_port.find(":")]
port = int(host_port[host_port.find(":") + 1:])
crlf_crlf = chr(13) + chr(10) + chr(13) + chr(10)
buffer_size = 1024
cmd = sys.argv[2] + crlf_crlf


s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
try:
    s.connect((host, port))
    s.send(cmd)
    resp = s.recv(buffer_size)
    s.close()
except:
    print("Error: Unreachable server " + host_port)    
else:
    print "received data:", resp
