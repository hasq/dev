#!/usr/bin/env python

# token_create (name|@file) [password|-]
 
import sys
import urllib2
import getpass
import ts_lib
import ts_cnf
import ts_msg

argv_len = len(sys.argv)

if argv_len == len(sys.argv) < 3:
    msg = ts_msg.get_msg("hlp_usg", sys.argv[0], "hlp_tkn", "hlp_pwd")
    print(msg)
    quit()

CMD = "z"

token = {"s": "", "r": ""}

if sys.argv[1][0] != "@":
    if ts_lib.is_allowed_data(sys.argv[1]) != True:
        msg = ts_msg.get_msg("err_msg", "tkn_err")
        print(msg)
        quit()
        
    dn_or_raw = ts_lib.get_clear_data(sys.argv[1])
else:
    file_name=sys.argv[1][1:]

    if not ts_lib.is_file(file_name):
        msg = ts_msg.get_msg("err_msg", "fil_mng", file_name)
        print(msg)
        quit()
    try:
        f = open(file_name, 'rb')
    except:
        msg = ts_msg.get_msg("err_msg", "fil_err", file_name)
        print(msg)
        quit()
    else:
        dn_or_raw = f.read()
        f.close()

if ts_lib.is_allowed_data(dn_or_raw):
    dn_or_raw = ts_lib.get_clear_data(dn_or_raw)
    msg = ts_msg.get_msg("fil_txt", "fil_txt", file_name)
    print(msg)

token["s"] = ts_lib.get_tok_hash(dn_or_raw, ts_cnf.HASH_NAME)

token["r"] = (dn_or_raw 
        if not ts_lib.get_tok_hash(token["r"], ts_cnf.HASH_NAME) == token["s"]
        else "")
    
print(token["r"])
print(token["s"])

quit()

master_key = (sys.argv[2] 
        if sys.argv[2] != "-" 
        else getpass.getpass(ts_msg.get_msg("key_etr")))

if master_key == "":
    msg = ts_msg.get_msg("err_msg", "key_err")
    print(msg)
    quit()

#print("Token hash: {}".format(ts_lib.get_tok_hash(dn_or_raw, ts_cnf.HASH_NAME)))
#print("Master key: {}".format(master_key))

r = ts_lib.get_record(0, ts_lib.get_tok_hash(dn_or_raw, ts_cnf.HASH_NAME),
        master_key, ts_cnf.MAGIC, ts_cnf.HASH_NAME)
        
d = (dn_or_raw 
        if dn_or_raw != ts_lib.get_tok_hash(dn_or_raw, ts_cnf.HASH_NAME)
        else "")

http_rqst = ts_lib.get_spaced_conc(CMD, "*", ts_cnf.DB, str(r.get("n")), 
        r.get("s"), r.get("k"), r.get("g"), r.get("o"), d)

print(http_rqst)

quit
try:
    http_resp = urllib2.urlopen("http://{}:{}/{}".format(ts_cnf.HOST,
                                        ts_cnf.PORT, http_rqst)).read()
except:
    print (ts_msg.get_msg("err_msg", "fil_mng", ts_cnf.HOST, ts_cnf.PORT))
else:
    print(ts_msg.get_msg("srv_rpl", http_resp))
