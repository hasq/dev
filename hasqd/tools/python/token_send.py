#!/usr/bin/python

# token_send (name|@file) (instant|onhold|release) [password|-]
# output: keys

import sys
import urllib2
import getpass
import ts_lib
import ts_cnf
import ts_msg

CMD_LAST = "last"

if len(sys.argv) < 4:
    msg = ts_msg.get_msg("msg_usg", sys.argv[0], "help_tok", "help_meth",
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
    if msg != "":
        print(msg)
    if dn_or_raw["exitcode"] > 1:
        quit()
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

if (sys.argv[2].lower() == "instant" or
        sys.argv[2].lower() == "onhold" or
        sys.argv[2].lower() == "release"):
    keys_v = sys.argv[2].lower()
else:
    msg = ts_msg.get_msg("msg_err", "msg_unk", sys.argv[2])
    print msg
    quit()

http_rqst = ts_lib.get_spaced_concat(CMD_LAST, ts_cnf.DB, token["s"])

try:
    http_resp = urllib2.urlopen(
            "http://{}:{}/{}".format(ts_cnf.HOST, ts_cnf.PORT, http_rqst)
            ).read()
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

lr = ts_lib.get_parsed_rec(http_resp)
nr = ts_lib.get_rec(
        lr["n"],
        token["s"],
        master_key,
        ts_cnf.MAGIC,
        ts_cnf.HASH_NAME)
st = ts_lib.get_tok_status(lr, nr)

if st == 4:
    print(ts_msg.get_msg("msg_err", "mkey_wng", token["s"]))
    quit()

if keys_v == "instant":
    if st != 1:
        print(ts_msg.get_msg("msg_err", "snd_err0", token["s"]))
        quit()

    line = ts_lib.get_instant_key(
            lr,
            master_key,
            ts_cnf.MAGIC,
            ts_cnf.HASH_NAME,
            ts_cnf.ALT_NAME)
elif keys_v == "onhold":
    if st != 1:
        print(ts_msg.get_msg("msg_err", "snd_err0", token["s"]))
        quit()

    line = ts_lib.get_onhold_key(
            lr,
            master_key,
            ts_cnf.MAGIC,
            ts_cnf.HASH_NAME,
            ts_cnf.ALT_NAME)

elif keys_v == "release":
    if st == 1:
        print(ts_msg.get_msg("msg_err", "snd_err1", token["s"]))
        quit()

    line = ts_lib.get_release_key(
            lr,
            master_key,
            ts_cnf.MAGIC,
            ts_cnf.HASH_NAME,
            ts_cnf.ALT_NAME,
            st)

print(line)
