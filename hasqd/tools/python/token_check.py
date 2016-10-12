#!/usr/bin/python


# token_check (name|@file) [password|-]
# - ask for password
# reply
# 1 status tokena exists or not
# 2 ownership, only if password provided
# 3 data

# 1 Token exists | No token
# 2 Password OK | Password Bad | Onhold sending | Onhold receiving
# 3 No data
# ===========
# my data
# ===========

import sys
import urllib2
import getpass
import ts_lib
import ts_cnf
import ts_msg

CMD = "last"

if len(sys.argv) < 3:
    msg = ts_msg.get_msg("msg_usg", sys.argv[0], "help_tok", "help_pwd")
    
    print msg
    quit()

if sys.argv[1][0] == "@":
    file_name = sys.argv[1][1:]
    dn_or_raw = ts_lib.get_data_from_file(file_name)
    msg = ""

    if dn_or_raw["exitcode"] == 4:
        msg = ts_msg.get_msg("msg_err", "file_rerr", file_name)
    if dn_or_raw["exitcode"] == 3:
        msg = ts_msg.get_msg("msg_err", "file_miss", file_name)
    if dn_or_raw["exitcode"] == 2:
        msg = ts_msg.get_msg("msg_err", "file_empt", file_name)
    if dn_or_raw["exitcode"] == 1:
        msg = ts_msg.get_msg("msg_wrn", "file_clrd", file_name)

    if msg != "" : print(msg)
    if dn_or_raw["exitcode"] > 1: quit()
else:
    dn_or_raw = ts_lib.get_tok_from_cmdline(sys.argv[1])

    if dn_or_raw["exitcode"] == 1:
        msg = ts_msg.get_msg("msg_wrn", "file_clrd", file_name)
        print msg
    elif dn_or_raw["exitcode"] == 2:
        msg = ts_msg.get_msg("msg_err", "tok_bin")
        print msg
        quit()

token = ts_lib.get_token_obj(dn_or_raw["data"], ts_cnf.HASH_NAME)
master_key = (sys.argv[2] if sys.argv[2] != "-"
               else getpass.getpass(ts_msg.get_msg("mkey_ent")))

if master_key == "":
    msg = ts_msg.get_msg("msg_err", "mkey_empt")
    print msg
    quit()

http_rqst = ts_lib.get_spaced_concat(CMD, ts_cnf.DB, token["s"])

try:
    http_resp = urllib2.urlopen("http://{}:{}/{}".format(ts_cnf.HOST,
                                ts_cnf.PORT, http_rqst)).read()
except:
    msg = ts_msg.get_msg("msg_err", "srv_err", ts_cnf.HOST, ts_cnf.PORT)
    print msg
    quit()
else:
    r = ts_lib.get_response_header(http_resp)
    if r == ts_msg.IDX_NODN:
        print ts_msg.get_msg("tok_dn0")
        quit()
    elif r == ts_msg.OK:
        print ts_msg.get_msg("tok_dn1")

        lr = ts_lib.get_parsed_rec(http_resp)
        nr = ts_lib.get_rec(
                lr["n"],
                token["s"],
                master_key,
                ts_cnf.MAGIC,
                ts_cnf.HASH_NAME
                )

        if ts_lib.get_tok_status(lr, nr) == 0:
            print(ts_msg.get_msg("mkey_ok"))
        elif ts_lib.get_tok_status(lr, nr) == 1:
            print(ts_msg.get_msg("mkey_snd"))
        elif ts_lib.get_tok_status(lr, nr) == 2:
            print(ts_msg.get_msg("mkey_rcv"))
        else:
            print(ts_msg.get_msg("mkey_bad"))

        if lr["d"] == "":
            print(ts_msg.get_msg("data_empt"))
        else:
            print(ts_msg.get_msg("msg_dlm"))
            print(lr["d"])
            print(ts_msg.get_msg("msg_dlm"))

quit()
