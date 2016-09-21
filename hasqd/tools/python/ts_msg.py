#!/usr/bin/env python
import ts_lib

def get_msg(*data):
    msg = {
        "m_err" : "ERROR:",
        "m_wrn" : "ATTENTION:",
        "s_err" : "Server unreachable.",
        "s_rep" : "Server reply",
        "f_err" : "Couldn't read file: ",
        "f_mis" : "File is empty or missing: ",
        "f_emp" : "File contains nothing: ",
        "f_chd" : "Text content has been cleared in file",
        "k_ent" : "Enter master key:",
        "k_emp" : "Master key is empty.",
        "m_usg" : "Usage: python",
        "h_tok" : "(token name|@file)",
        "h_pwd" : "[password|-]",
        "t_bin" : "Token name seems binary; please use file instead",
        "j_jid" : "(Job id)",
        "j_err" : "Incorrect job id"
    }
    
    r = ""    
    for i in range(len(data)):
        p = str(data[i]) if msg.get(data[i]) == None else msg[data[i]]
        r = ts_lib.get_spaced_concat(r, p)
        
    return r