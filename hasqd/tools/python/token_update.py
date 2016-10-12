#!/usr/bin/python

# token_update (name|@file) ("data"|@file|-) [password]

import sys
import urllib2
import getpass
import ts_lib
import ts_cnf
import ts_msg

CMD_ADD = "add"
CMD_LAST = "last"

if len(sys.argv) < 4:
    msg = ts_msg.get_msg("msg_usg", sys.argv[0], "help_tok", "help_data",
            "help_pwd")
            
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
master_key = (sys.argv[3] if sys.argv[3] != "-"
        else getpass.getpass(ts_msg.get_msg("mkey_ent")))

if master_key == "":
    msg = ts_msg.get_msg("msg_err", "mkey_empt")
    print msg
    quit()

err_lvl = ts_lib.get_data_to_rec_error_level(sys.argv[2], ts_cnf.DATALIM)

if err_lvl == 1:
    msg = ts_msg.get_msg("msg_err", "data_err1")
elif err_lvl == 2:
    msg = ts_msg.get_msg("msg_err", "data_err2")
elif err_lvl == 3:
    msg = ts_msg.get_msg("msg_err", "data_err3")
elif err_lvl == 4:
    msg = ts_msg.get_msg("msg_err", "data_err4")
elif err_lvl == 5:
    msg = ts_msg.get_msg("msg_err", "data_err5")

if err_lvl != 0:
    print(msg)
    quit()

new_data = ts_lib.get_data_to_rec(sys.argv[2])
http_rqst = ts_lib.get_spaced_concat(CMD_LAST, ts_cnf.DB, token["s"])

try:
    http_resp = urllib2.urlopen("http://{}:{}/{}".format(ts_cnf.HOST,
                                ts_cnf.PORT, http_rqst)).read()
except:
    print ts_msg.get_msg("msg_err", "srv_err", ts_cnf.HOST, ts_cnf.PORT)
    quit()

if ts_lib.get_response_header(http_resp) == ts_msg.IDX_NODN:
    msg = ts_msg.get_msg("msg_err", "tok_dn0")
    print msg
    quit()
elif ts_lib.get_response_header(http_resp) != ts_msg.OK:
    msg = ts_msg.get_msg("msg_err", http_resp)
    print msg
    quit()

last_rec = ts_lib.get_parsed_rec(http_resp)

if last_rec["d"] == new_data:
    print ts_msg.get_msg("msg_wrn", "data_err0")
    quit()

new_rec = ts_lib.get_rec(
        last_rec["n"] + 1,
        ts_lib.get_tok_hash(token["s"],
        ts_cnf.HASH_NAME),
        master_key,
        ts_cnf.MAGIC,
        ts_cnf.HASH_NAME
        )

http_rqst = ts_lib.get_spaced_concat(
        CMD_ADD,
        "*",
        ts_cnf.DB,
        str(new_rec.get("n")),
        new_rec.get("s"),
        new_rec.get("k"),
        new_rec.get("g"),
        new_rec.get("o"),
        new_data,
        )

try:
    http_resp = urllib2.urlopen("http://{}:{}/{}".format(ts_cnf.HOST,
                                ts_cnf.PORT, http_rqst)).read()
except:
    print ts_msg.get_msg("msg_err", "srv_err", ts_cnf.HOST, ts_cnf.PORT)
    quit()
else:
    print ts_msg.get_msg("srv_rep", http_resp)
