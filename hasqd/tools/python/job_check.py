#!/usr/bin/python

# job_id_check (jobId)

import sys
import urllib2
import getpass
import ts_lib
import ts_cnf
import ts_msg

CMD = "job"

if len(sys.argv) < 2:
    msg = ts_msg.get_msg("msg_usg", sys.argv[0], "help_jid")
    print msg
    quit()

if int(sys.argv[1]) >= 1000:
    jid = sys.argv[1]
else:
    msg = ts_msg.get_msg("msg_err", "job_err")
    print msg
    quit()

http_rqst = ts_lib.get_spaced_concat(CMD, jid)

try:
    http_resp = urllib2.urlopen("http://{}:{}/{}".format(ts_cnf.HOST,
                                ts_cnf.PORT, http_rqst)).read()
except:
    print ts_msg.get_msg("msg_err", "srv_err", ts_cnf.HOST, ts_cnf.PORT)
else:
    print ts_msg.get_msg("srv_rep", http_resp)
