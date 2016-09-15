#!/usr/bin/env python
import ts_lib

def get_msg(*data):
    r = ""
    msg = {
        "err_msg" : "ERROR:",
        "srv_err" : "Server unreachable.",
        "srv_rpl" : "Server reply",
        "fil_err" : "File read error",
        "fil_mng" : "File is empty or missing",
        "key_etr" : "Enter master key:",
        "key_err" : "Master key is empty.",
        "hlp_usg" : "Usage: python",
        "hlp_tkn" : "(token name|@file)",
        "hlp_pwd" : "[password|-]",
        "tok_err" : "Token name have a non-ASCII symbols - use file."
    }
    
    for i in range(len(data)):
        p = str(data[i]) if msg.get(data[i]) == None else msg[data[i]]
        r = ts_lib.get_spaced_conc(r, p)
        
    return r