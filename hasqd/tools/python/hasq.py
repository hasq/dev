import hashlib
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
        r = "Error: Wrong hash function"
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
