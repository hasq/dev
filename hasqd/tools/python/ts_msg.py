#!/usr/bin/env python
import ts_lib

OK = "OK"
IDX_NODN = "IDX_NODN"
JOB_QUEUED = "JOB_QUEUED"

def get_msg(*data):
    msg = {
        "akey_ent" : "Enter assignment key:",
        "akey_err" : "Incorrect keys!",
        "data_empt" : "No data",
        "data_err0" : "Data not changed!",
        "data_err1" : "Empty data.",
        "data_err2" : "Data length is bigger than data field limit:",
        "data_err3" : "Data seems binary.",
        "data_err4" : "Parsed data length is bigger than data field limit:",
        "data_err5" : "Data parsing error (!)",
        "file_clrd" : "Text content has been cleared in file",
        "file_empt" : "File contains nothing:",
        "file_miss" : "File is empty or missing: ",
        "file_rerr" : "Couldn't read file:",
        "job_err" : "Incorrect job id",
        "help_data" : "<data>",
        "help_jid" : "<Job id>",
        "help_meth" : "<instant|onhold|release>",
        "help_pwd" : "<password|->",
        "help_tok" : "<token name|@file>",
        "mkey_empt" : "Master key is empty.",
        "mkey_ent" : "Enter master key:",
        "mkey_bad" : "Password Bad",
        "mkey_inc" : "Incorrect password",
        "mkey_ok" : "Password Ok",
        "mkey_snd" : "Onhold sending",
        "mkey_rcv" : "Onhold receiving",
        "msg_dlm" : "--------",
        "msg_err" : "ERROR:",
        "msg_unk" : "unknown parameter:",
        "msg_usg" : "Usage: python",
        "msg_wrn" : "WARNING:",
        "srv_err" : "Server is unreachable:",
        "srv_rep" : "Server reply:",
        "tok_bin" : "Token name seems binary; please use file instead",
        "tok_dn0" : "No such token",
        "tok_dn1" : "Token exists",
    }

    r = ""
    for i in range(len(data)):
        p = str(data[i]) if msg.get(data[i]) == None else msg[data[i]]
        r = ts_lib.get_spaced_concat(r, p)

    return r