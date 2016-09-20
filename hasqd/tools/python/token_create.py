#!/usr/bin/python

# token_create (name|@file) [password|-]

import sys
import urllib2
import getpass
import ts_lib
import ts_cnf
import ts_msg

CMD = 'z'
argv_len = len(sys.argv)

if argv_len == len(sys.argv) < 3:
    msg = ts_msg.get_msg('hlp_usg', sys.argv[0], 'hlp_tkn', 'hlp_pwd')
    print msg
    quit()

if sys.argv[1][0] == '@':
    file_name = (sys.argv[1])[1:]

    if not ts_lib.is_file(file_name):
        msg = ts_msg.get_msg('err_msg', 'fil_mng', file_name)
        print msg
        quit()

    try:
        f = open(file_name, 'rb')
    except:
        msg = ts_msg.get_msg('err_msg', 'fil_err', file_name)
        print msg
        quit()
    else:
        dn_or_raw = f.read()

        if ts_lib.is_allowed_data(dn_or_raw):
            msg = ts_msg.get_msg('atn_msg', 'fil_txt', file_name)
            print msg
            dn_or_raw = ts_lib.get_clear_data(dn_or_raw)

        f.close()
else:
    dn_or_raw = sys.argv[1]

    if ts_lib.is_allowed_data(dn_or_raw):
        dn_or_raw = ts_lib.get_clear_data(dn_or_raw)
    else:
        msg = ts_msg.get_msg('err_msg', 'tkn_err')
        print msg
        quit()

token = ts_lib.get_token_obj(dn_or_raw, ts_cnf.HASH_NAME)

master_key = (sys.argv[2] if sys.argv[2] != '-'
               else getpass.getpass(ts_msg.get_msg('key_etr')))

if master_key == '':
    msg = ts_msg.get_msg('err_msg', 'key_err')
    print msg
    quit()

rec = ts_lib.get_record(0, ts_lib.get_tok_hash(dn_or_raw,
                        ts_cnf.HASH_NAME), master_key, ts_cnf.MAGIC,
                        ts_cnf.HASH_NAME)

rec_data = (ts_lib.get_data_to_rec(token['r'])
            if ts_lib.get_data_to_rec_error_level(token['r'],
            ts_cnf.DATALIM) == 0 else '')

http_rqst = ts_lib.get_spaced_conc(
    CMD,
    '*',
    ts_cnf.DB,
    str(rec.get('n')),
    rec.get('s'),
    rec.get('k'),
    rec.get('g'),
    rec.get('o'),
    rec_data,
    )

#print http_rqst

try:
    http_resp = urllib2.urlopen('http://{}:{}/{}'.format(ts_cnf.HOST,
                                ts_cnf.PORT, http_rqst)).read()
except:
    print ts_msg.get_msg('err_msg', 'fil_mng', ts_cnf.HOST, ts_cnf.PORT)
else:
    print ts_msg.get_msg('srv_rpl', http_resp)
