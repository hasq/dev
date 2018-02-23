#!/usr/bin/env python

import sys
import socket
import ts_cnf

if len(sys.argv) != 2:
    print("Usage: python raw_cmd_tcp.py COMMAND")
    quit()

CRLF_CRLF = 2 * (chr(13) + chr(10))

cmd = sys.argv[1] + CRLF_CRLF

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
buffer_size = 1024

try:
    s.connect((ts_cnf.HOST, ts_cnf.TCP_PORT))
    s.send(cmd)
    resp = s.recv(buffer_size)
    s.close()
except:
    print("Error: Unreachable server " + ts_cnf.HOST + ":" + str(ts_cnf.TCP_PORT))
else:
    print("Server reply: " + resp)
