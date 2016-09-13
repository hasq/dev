#!/usr/bin/env python

# token_create (name|@file) [password]
 
import sys
import urllib2
import getpass
import ts_lib

argv_len = len(sys.argv)

if argv_len == len(sys.argv) < 2 or argv_len == len(sys.argv) > 3:
    print("Usage: python token_create.py (token name|@file) [password|-]")
    quit()
    
HOST = "tokenswap.com"
PORT = "80"
HASH_NAME = "smd"
MAGIC = ""
DB = "smd.db"
MAX_FILE_SIZE = 10000000


CMD = "z"
    
if sys.argv[1][0] != "@":
    token_name = sys.argv[1]
else:
    file_name=sys.argv[1][1:]

    if not ts_lib.is_file(file_name):
        print("ERROR: file \"{}\" is missing or empty.".format(file_name))
        quit()
  
    try:
        f = open(file_name, 'rb')
    except:
        print("Incorrect file \"{}\"".format(file_name))
        quit()
    else:
        token_name = ts_lib.get_tok_hash(f.read(), HASH_NAME)
        print(token_name)
        f.close()
        
quit()
    
    
ask_pass = "Enter master key: "

master_key = getpass.getpass(ask_pass)

if master_key.lower() == "":
    quit()

print("Token hash: {}".format(ts_lib.get_tok_hash(token_name, HASH_NAME)))
print("Master key: {}".format(master_key))

r = ts_lib.get_record(0, ts_lib.get_tok_hash(token_name, HASH_NAME), master_key, MAGIC, HASH_NAME)
d = token_name if token_name != ts_lib.get_tok_hash(token_name, HASH_NAME) else ""

http_rqst = ts_lib.get_spaced_conc(CMD, "*", DB, str(r.get("n")), r.get("s"), r.get("k"), r.get("g"), r.get("o"), d)

print(http_rqst)

try:
    http_resp = urllib2.urlopen("http://{}:{}/{}".format(HOST, PORT, http_rqst)).read()
except:
    print("Error: Unreachable server {}:{}".format(HOST, PORT))
else:
    print("Server reply: {}".format(http_resp))
