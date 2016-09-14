def get_msg(data):
    msg = {
        "err_msg" : "ERROR:",
        "srv_err" : "Server unreachable.",
        "srv_rpl" : "Server reply",
        "fil_err" : "File read error",
        "fil_mng" : "File is empty or missing",
        "key_etr" : "Enter master key",
        "key_err" : "Master key is empty.",
        "hlp_usg" : "Usage: python",
        "hlp_tkn" : "(token name|@file)",
        "hlp_pwd" : "[password|-]"        
    }
    
    return msg[data]