#!/usr/bin/python

# token_receive (name|@file) ("keys"|@file|-) [password|-]

import sys
import urllib2
import getpass
import ts_lib
import ts_cnf
import ts_msg

CMD_LAST = "last"
argv_len = len(sys.argv)

if argv_len == len(sys.argv) < 4:
    msg = ts_msg.get_msg("msg_usg", sys.argv[0], "help_tok", "help_meth", "help_pwd")
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

    if dn_or_raw["exitcode"] != 0:
        msg = ts_msg.get_msg("msg_err", "tok_bin")
        print msg
        quit()

token = ts_lib.get_token_obj(dn_or_raw["data"], ts_cnf.HASH_NAME)
master_key = (sys.argv[3] if sys.argv[3] != "-" else
        getpass.getpass(ts_msg.get_msg("mkey_ent")))

if master_key == "":
    msg = ts_msg.get_msg("msg_err", "mkey_empt")
    print msg
    quit()

if sys.argv[2][0] == "@":
    file_name = sys.argv[2][1:]
    tmp_keys = ts_lib.get_data_from_file(file_name)
    msg = ""

    if tmp_keys["exitcode"] == 4:
        msg = ts_msg.get_msg("msg_err", "file_rerr", file_name)
    if tmp_keys["exitcode"] == 3:
        msg = ts_msg.get_msg("msg_err", "file_miss", file_name)
    if tmp_keys["exitcode"] == 2:
        msg = ts_msg.get_msg("msg_err", "file_empt", file_name)
    if tmp_keys["exitcode"] == 1:
        msg = ts_msg.get_msg("msg_wrn", "file_clrd", file_name)

    if msg != "" : print(msg)
    if tmp_keys["exitcode"] > 1: quit()
        
    raw_key = tmp_keys["data"]
elif sys.argv[2] != "-":
    raw_key = ts_lib.get_clear_data(sys.argv[2])
else:
    raw_key = raw_input(ts_msg.get_msg("akey_ent"))

if not ts_lib.is_asgmt_key(raw_key):
    msg = ts_msg.get_msg("msg_err", "akey_err")
    print(msg)
    quit()

asgmt_key = ts_lib.get_asgmt_key(raw_key)
