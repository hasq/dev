#!/usr/bin/env python

import sys
import socket

if len(sys.argv) < 3 or sys.argv[1].lower() == "-h":
    print("Syntax: host:port command")
    quit()

host_port = sys.argv[1]
host = host_port[:host_port.find(":")]
port = int(host_port[host_port.find(":") + 1:])
cr = chr(13)
lf = chr(10)
cmd = sys.argv[2] + 2 * (cr + lf)

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
buffer_size = 1024

try:
    s.connect((host, port))
    s.send(cmd)
    resp = s.recv(buffer_size)
    s.close()
except:
    print("Error: Unreachable server " + host_port)    
else:
    print "Received data:", resp
