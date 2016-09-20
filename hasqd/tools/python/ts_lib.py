#!/usr/bin/env python

import hashlib
import os
import re
import sys
import urllib2


def get_rmd160(data):
    r = hashlib.new('ripemd160')
    r.update(data)
    return r.hexdigest()
    
def get_hash(data, hash_name):
    hash_dict = {
        "wrd": lambda x: hashlib.md5(x).hexdigest()[:4],
        "md5": lambda x: hashlib.md5(x).hexdigest(),
        "r16": lambda x: get_rmd160(x),
        "s22": lambda x: hashlib.sha256(x).hexdigest(),
        "s25": lambda x: hashlib.sha512(x).hexdigest(),
        "smd": lambda x: hashlib.md5(hashlib.sha256(x).hexdigest()).hexdigest(),
    }
    
    try:
        return hash_dict[hash_name](data)
    except:
        return None

def is_hash(data, hash_name):
    hash_dict = {
        "wrd": lambda x: len(x) == 4,
        "md5": lambda x: len(x) == 32,
        "r16": lambda x: len(x) == 40,
        "s22": lambda x: len(x) == 64,
        "s25": lambda x: len(x) == 128,
        "smd": lambda x: len(x) == 32,
    }
      
    is_not_hex = lambda x: re.search('[^0-9a-f]', x)
    
    try:
        r = (hash_dict[hash_name](data) and not is_not_hex(data))
    except:
        r = None
        
    return r
    
def get_tok_hash(data, hash_name):
    f = is_hash(data, hash_name)
    
    if f is None:
        r = None
    elif f:
        r = data
    else:
        r = get_hash(data, hash_name)
    
    return r

def get_spaced_conc(*args):
    r = ""
    l = len(args)
    
    for i in range(l):
        if not str(args[i]):
            continue
            
        r = r + " " + str(args[i]) if len(r) > 0 else r + str(args[i])
        
    return r

def get_key(n, s, p, m, hash_name):
    n = str(n)
    raw_key = get_spaced_conc(n, s, p, m) if m else get_spaced_conc(n, s, p)
    
    return get_hash(raw_key, hash_name)

def get_record(n, s, p, m, hash_name):
    n0 = int(n)
    n1 = int(n) + 1
    n2 = int(n) + 2
    
    try:
        k0 = get_key(n0, s, p, m, hash_name)
        k1 = get_key(n1, s, p, m, hash_name)
        k2 = get_key(n2, s, p, m, hash_name)
        g0 = get_key(n1, s, k1, m, hash_name)
        g1 = get_key(n2, s, k2, m, hash_name)
        o0 = get_key(n1, s, g1, m, hash_name)
    
        r = {
            "n": n0,
            "s": s,
            "k": k0,
            "g": g0,
            "o": o0,
        }
    except:
        r = None
        
    return r

def is_file(file_path):
    return os.path.isfile(file_path) and os.path.getsize(file_path) > 0
    
def is_binary_file(filename):
    textchars = bytearray({7,8,9,10,12,13,27} | set(range(0x20, 0x100)) - {0x7f})
    is_binary_string = lambda bytes: bool(bytes.translate(None, textchars))
    return is_binary_string

def get_token_obj(data, hash_name):
    tok = {"s" : "", "r" : ""};

    tok["s"] = get_tok_hash(data, hash_name) if bool(data) else ""
    
    if data != tok["s"] and is_allowed_data(data):
        tok["r"] = data

    return tok

def is_allowed_data(data):
    if len(data) == "":
        return False

    for i in range(len(data)):
        ch = ord(data[i])

        if ch in range(32, 128) or ch == 9 or ch == 10 or ch == 13:
            continue
        else:
            return False
    
    return True
    
def get_clear_data(data):
    # Replaces all tabs by spaces
    # Removes all whitespaces from the end of each line
    # Removes all LF, CR and CRLF from the beginning and from the end of token
    data = data if bool(data) else ""
    data = data.replace("\t", u"\u0020")
    data = data.replace("\r\n", "\n")
    data = data.replace("\r", "\n")    
    data = re.sub(u"(?m)\u0020+$|^\n+|\n+$", "", data)
        
    return data
    
def get_data_to_rec_error_level(data, lim):
    if data == "": return 0;
    if not is_allowed_data(data): return 3
    
    data = get_clear_data(data);
    if len(data) > lim: return 2

    fmd = get_data_to_rec(data)

    if len(fmd) > lim: return 4
    if data != get_data_from_rec(fmd): return 5

    return 0

def get_data_to_rec(data):
    # Replaces all backslashes (\u005c) by two backslashes
    # Replaces all double spaces (\u0020) by " \ " (\u0020\u005c\u0020)
    # Replaces all linefeeds (\u000a) by "\n" (\u005c\u006e)
    
    data = data if bool(data) else ""
    data = get_clear_data(data)
    data = data.replace(u"\u005c", u"\u005c\u005c")
    data = re.sub(u"(\u0020(?=\u0020))", ur"\u0020\\", data)
    data = data.replace(u"\u000a", u"\u005c\u006e")
            
    return data
    
def get_data_from_rec(data):
    # returns parsed data for displaying
    # \u000a is LF;
    # \u0020 is space;
    # \u005c is backslash;
    # \u006e is n
    data = data if bool(data) else ""
    bs = 0
    ln = len(data)
    i = 0
    
    while i < ln:
        bs = bs + 1 if (data[i] == u"\u005c") else 0

        if (data[i] == u"\u005c" 
                and data[i + 1] == u"\u006e"
                and bs > 0
                and bs % 2 == 1):
            data = data[:i] + u"\u000a" + data[i + 2:]
            bs = 0
            ln -= 1
         
        i += 1
                
    #data = re.sub(r" \\(?= )", " ", data)
    data = re.sub(ur"(\u0020\\)(?=\u0020)", u"\u0020", data)
    data = data.replace(u"\u005c\u005c", u"\u005c")
    
    return data
