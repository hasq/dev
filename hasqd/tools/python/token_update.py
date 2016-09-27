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
argv_len = len(sys.argv)

if argv_len == len(sys.argv) < 4:
    msg = ts_msg.get_msg("m_usg", sys.argv[0], "h_tok", "h_dat", "h_pwd")
    print msg
    quit()

if sys.argv[1][0] == "@":
    file_name = sys.argv[1][1:]
    dn_or_raw = ts_lib.get_data_from_file(file_name)
    msg = ""
    
    if dn_or_raw["exitcode"] == 4: 
        msg = ts_msg.get_msg("m_err", "f_err", file_name)
    if dn_or_raw["exitcode"] == 3: 
        msg = ts_msg.get_msg("m_err", "f_mis", file_name)
    if dn_or_raw["exitcode"] == 2:
        msg = ts_msg.get_msg("m_err", "f_emp", file_name)
    if dn_or_raw["exitcode"] == 1:
        msg = ts_msg.get_msg("m_wrn", "f_chd", file_name)
    
    if msg != "" : print(msg)
    if dn_or_raw["exitcode"] > 1: quit()
else:
    dn_or_raw = ts_lib.get_tok_from_cmdline(sys.argv[1])
    
    if dn_or_raw["exitcode"] != 0: 
        msg = ts_msg.get_msg("m_err", "t_bin")
        print msg
        quit()

token = ts_lib.get_token_obj(dn_or_raw["data"], ts_cnf.HASH_NAME)
master_key = (sys.argv[3] if sys.argv[3] != "-"
        else getpass.getpass(ts_msg.get_msg("k_ent")))

if master_key == "":
    msg = ts_msg.get_msg("m_err", "k_emp")
    print msg
    quit()

rec_data = (ts_lib.get_data_to_rec(sys.argv[2])
        if ts_lib.get_data_to_rec_error_level(sys.argv[2],
                ts_cnf.DATALIM) == 0 else "")

if rec_data == "":
    print ts_msg.get_msg("m_err", "d_err")
    quit()
    
http_rqst = ts_lib.get_spaced_concat(CMD_LAST, ts_cnf.DB, token["s"])

try:
    http_resp = urllib2.urlopen("http://{}:{}/{}".format(ts_cnf.HOST,
                                ts_cnf.PORT, http_rqst)).read()
except:
    print ts_msg.get_msg("m_err", "s_err", ts_cnf.HOST, ts_cnf.PORT)
    quit()

if ts_lib.get_response_header(http_resp) == ts_msg.IDX_NODN:
    msg = ts_msg.get_msg("m_err", "s_dn0")
    print msg
    quit()   
elif ts_lib.get_response_header(http_resp) != ts_msg.OK:
    msg = ts_msg.get_msg("m_err", http_resp)
    print msg
    quit()
    
last_rec = ts_lib.get_parsed_rec(http_resp)

new_rec = ts_lib.get_rec(last_rec["n"] + 1, ts_lib.get_tok_hash(token["s"], ts_cnf.HASH_NAME),
        master_key, ts_cnf.MAGIC, ts_cnf.HASH_NAME)
    
http_rqst = ts_lib.get_spaced_concat(
    CMD_ADD,
    "*",
    ts_cnf.DB,
    str(new_rec.get("n")),
    new_rec.get("s"),
    new_rec.get("k"),
    new_rec.get("g"),
    new_rec.get("o"),
    rec_data,
    )

try:
    http_resp = urllib2.urlopen("http://{}:{}/{}".format(ts_cnf.HOST,
                                ts_cnf.PORT, http_rqst)).read()
except:
    print ts_msg.get_msg("m_err", "s_err", ts_cnf.HOST, ts_cnf.PORT)
    quit()
else:
    print ts_msg.get_msg("s_rep", http_resp)
