#!/usr/bin/env python
import ts_lib

OK = "OK"
IDX_NODN = "IDX_NODN"
JOB_QUEUED = "JOB_QUEUED"

def get_msg(*data):
    msg = {
        "d_zer" : "No data",
        "d_er0" : "Data not changed!",
        "d_er1" : "Empty data.",
        "d_er2" : "Data length is bigger than data field limit:",
        "d_er3" : "Data seems binary.",
        "d_er4" : "Parsed data length is bigger than data field limit:",
        "d_er5" : "Data parsing error (!)",
        "f_chd" : "Text content has been cleared in file",
        "f_emp" : "File contains nothing: ",
        "f_err" : "Couldn't read file: ",
        "j_err" : "Incorrect job id",
        "h_dat" : "<data>",
        "h_jid" : "<Job id>",
        "h_met" : "<instant|onhold|release>",
        "h_pwd" : "<password|->",
        "h_tok" : "<token name|@file>",
        "k_emp" : "Master key is empty.",
        "k_ent" : "Enter master key:",
        "m_dlm" : "--------",
        "m_err" : "ERROR:",
        "m_unk" : "unknown parameter:",
        "m_usg" : "Usage: python",
        "m_wrn" : "WARNING:",
        "s_err" : "Server is unreachable:",
        "s_rep" : "Server reply:",
        "f_mis" : "File is empty or missing: ",
        "t_bin" : "Token name seems binary; please use file instead",
        "s_dn0" : "No such token",
        "s_dn1" : "Token exists",
        "p_bad" : "Password Bad",
        "p_ok" : "Password Ok",
        "p_snd" : "Onhold sending",
        "p_rcv" : "Onhold receiving",
    }
    
    r = ""    
    for i in range(len(data)):
        p = str(data[i]) if msg.get(data[i]) == None else msg[data[i]]
        r = ts_lib.get_spaced_concat(r, p)
        
    return r