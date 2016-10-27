#!/usr/bin/python

# token_receive (name|@file) ("keys"|@file|-) [password|-]

import sys
import urllib2
import getpass
import ts_lib
import ts_cnf
import ts_msg

CMD_ADD = "add"
CMD_LAST = "last"

if len(sys.argv) < 4:
    msg = ts_msg.get_msg("msg_usg", sys.argv[0], "help_tok", "help_keys",
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

    if dn_or_raw["exitcode"] == 1:
        msg = ts_msg.get_msg("msg_wrn", "file_clrd", file_name)
        print msg
    elif dn_or_raw["exitcode"] == 2:
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
    if msg != "":
        print(msg)
    if tmp_keys["exitcode"] > 1:
        quit()

    raw_key = tmp_keys["data"]
elif sys.argv[2] != "-":
    raw_key = ts_lib.get_clear_data(sys.argv[2])
else:
    raw_key = raw_input(ts_msg.get_msg("akey_ent"))

if not ts_lib.is_asgmt_key(raw_key):
    msg = ts_msg.get_msg("msg_err", "akey_err")
    print(msg)
    quit()

http_rqst = ts_lib.get_spaced_concat(CMD_LAST, ts_cnf.DB, token["s"])

try:
    http_resp = urllib2.urlopen("http://{}:{}/{}".format(
            ts_cnf.HOST,
            ts_cnf.PORT,
            http_rqst)).read()
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
        lr["n"], token["s"], master_key, ts_cnf.MAGIC, ts_cnf.HASH_NAME)
st = ts_lib.get_tok_status(lr, nr)
asgmt_key = ts_lib.get_asgmt_key(raw_key)

if asgmt_key["n"] == -1:
    asgmt_key["n"] = lr["n"]

prc = asgmt_key.get("prc")

# 0 - "OK"
# 1 - "PWD_SNDNG"
# 2 - "PWD_RCVNG"
if st == 1:
    print ts_msg.get_msg("msg_err", "rcv_err0", token["s"])
    quit()
elif st == 4:
    if prc not in [ts_lib.INSTANT_CODE, ts_lib.INSTANT_CODE_N,
                   ts_lib.ONHOLD_CODE, ts_lib.ONHOLD_CODE]:
        print ts_msg.get_msg("msg_err", "rcv_err1", token["s"])
        quit()
elif st == 3:
    if prc not in [ts_lib.RELEASE_S_CODE, ts_lib.RELEASE_S_CODE_N]:
        print ts_msg.get_msg("msg_err", "rcv_err2", prc, token["s"])
        quit()
elif prc not in [ts_lib.RELEASE_R_CODE, ts_lib.RELEASE_R_CODE_N]:
    print ts_msg.get_msg("msg_err", "rcv_err2", prc, token["s"])
    quit()


title_rec = ts_lib.get_title_rec(
        asgmt_key,
        master_key,
        ts_cnf.MAGIC,
        ts_cnf.HASH_NAME)

http_rqst1 = ts_lib.get_spaced_concat(
        CMD_ADD,
        "*",
        ts_cnf.DB,
        str(title_rec.get("n1")),
        title_rec.get("s"),
        title_rec.get("k1"),
        title_rec.get("g1"),
        title_rec.get("o1"))

if prc in ([ts_lib.INSTANT_CODE, ts_lib.INSTANT_CODE_N, ts_lib.RELEASE_R_CODE,
           ts_lib.RELEASE_R_CODE_N]):
    http_rqst2 = ts_lib.get_spaced_concat(
            CMD_ADD,
            "*",
            ts_cnf.DB,
            str(title_rec.get("n2")),
            title_rec.get("s"),
            title_rec.get("k2"),
            title_rec.get("g2"),
            title_rec.get("o2"))
else:
    http_rqst2 = ""


# elif prc == ts_lib.ONHOLD_CODE or prc == ts_lib.ONHOLD_CODE_N:
# elif prc == ts_lib.RELEASE_S_CODE or prc == ts_lib.RELEASE_S_CODE_N:
# elif prc == ts_lib.RELEASE_R_CODE_N or prc == ts_lib.RELEASE_R_CODE_N:

try:
    http_resp = urllib2.urlopen(
            "http://{}:{}/{}".format(ts_cnf.HOST, ts_cnf.PORT, http_rqst1)
            ).read()
except:
    print ts_msg.get_msg("msg_err", "srv_err", ts_cnf.HOST, ts_cnf.PORT)
    quit()
else:
    print ts_msg.get_msg("srv_rep", http_resp)

if bool(http_rqst2):
    try:
        http_resp = urllib2.urlopen(
                "http://{}:{}/{}".format(ts_cnf.HOST, ts_cnf.PORT, http_rqst2)
                ).read()
    except:
        print ts_msg.get_msg("msg_err", "srv_err", ts_cnf.HOST, ts_cnf.PORT)
        quit()
    else:
        print ts_msg.get_msg("srv_rep", http_resp)

quit()
