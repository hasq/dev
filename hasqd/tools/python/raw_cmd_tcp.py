#!/usr/bin/env python

import sys
import socket

if len(sys.argv) < 2:
    print("Usage: python raw_cmd_tcp.py COMMAND")
    quit()

HOST = "tokenswap.com"
PORT = 13131
CRLF_CRLF = 2 * (chr(13) + chr(10))

cmd = sys.argv[1] + CRLF_CRLF

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
buffer_size = 1024

try:
    s.connect((HOST, PORT))
    s.send(cmd)
    resp = s.recv(buffer_size)
    s.close()
except:
    print("Error: Unreachable server " + HOST + ":" + str(PORT))    
else:
    print("Server reply: " + resp)
