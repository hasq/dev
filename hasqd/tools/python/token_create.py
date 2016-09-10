#!/usr/bin/env python

# token_create (name|@file) [password]
 
import sys
import urllib2
import getpass
import ts_lib

HOST_PORT = "TOKENSWAP.COM:80"
HOST = "tokenswap.com"
PORT = "80"
HASH_NAME = "smd"
MAGIC = ""
DB = "smd.db"
CMD = "z"

ask_continue = "Do you wish to continue? [y/N]: "
ask_name = "Enter token name: "
ask_pass = "Enter master key: "


print("This script allows to create a new token on {}.".format(HOST))

join = raw_input(ask_continue)

if join.lower() != "y" and join.lower() != "yes":
    quit()

token_name = raw_input(ask_name)

if token_name.lower() == "":
    quit()

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
    http_resp = urllib2.urlopen("http://" + HOST_PORT + "/" + http_rqst).read()
except:
    print("Error: Unreachable server " + HOST_PORT)
else:
    print http_resp
