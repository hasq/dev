#!/usr/bin/env python

import hashlib
import os
import re
import sys
import urllib2
import ts_msg

INSTANT_CODE = "23132"
INSTANT_CODE_N = "123132"
ONHOLD_CODE = "23141"
ONHOLD_CODE_N = "123141"
RELEASE_S_CODE = "231"
RELEASE_S_CODE_N = "1231"
RELEASE_R_CODE = "232"
RELEASE_R_CODE_N = "1232"


def get_rmd160(data):
    r = hashlib.new("ripemd160")
    r.update(data)
    return r.hexdigest()


def is_hex(data):
    return not re.search("[^0-9a-f]", data)


def get_hash(data, hash_name):
    hash_dict = {
        "wrd": lambda x: hashlib.md5(x).hexdigest()[:4],
        "md5": lambda x: hashlib.md5(x).hexdigest(),
        "r16": lambda x: get_rmd160(x),
        "s22": lambda x: hashlib.sha256(x).hexdigest(),
        "s25": lambda x: hashlib.sha512(x).hexdigest(),
        "smd": lambda x: (hashlib.md5(
                          hashlib.sha256(x).hexdigest()).hexdigest())
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
        "smd": lambda x: len(x) == 32
    }

    is_not_hex = lambda x: re.search("[^0-9a-f]", x)

    try:
        r = hash_dict[hash_name](data) and not is_not_hex(data)
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


def get_spaced_concat(*args):
    r = ""
    l = len(args)

    for i in range(l):
        if not str(args[i]):
            continue

        r = r + " " + str(args[i]) if len(r) > 0 else r + str(args[i])

    return r


def get_key(n, s, p, m, hash_name):
    n = str(n)
    raw_key = (get_spaced_concat(n, s, p, m)
               if m else get_spaced_concat(n, s, p))

    return get_hash(raw_key, hash_name)


def get_rec(n, s, p, m, hash_name):
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
    textchars = bytearray(
            {7, 8, 9, 10, 12, 13, 27} | set(range(0x20, 0x100)) - {0x7f}
    )
    is_binary_string = lambda bytes: bool(bytes.translate(None, textchars))

    return is_binary_string


def get_token_obj(data, hash_name):
    tok = {"s": "", "r": ""}

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
    if data == "":
        return 1
    if not is_allowed_data(data):
        return 3

    data = get_clear_data(data)

    if len(data) > lim:
        return 2

    fmd = get_data_to_rec(data)

    if len(fmd) > lim:
        return 4

    if data != get_data_from_rec(fmd):
        return 5

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
    # \u000a is LF
    # \u0020 is space
    # \u005c is backslash
    # \u006e is n

    data = data if bool(data) else ""
    bs = 0
    ln = len(data)
    i = 0

    while i < ln:
        bs = bs + 1 if (data[i] == u"\u005c") else 0

        if (data[i] == u"\u005c" and
                data[i + 1] == u"\u006e" and bs > 0 and bs % 2 == 1):
            data = data[:i] + u"\u000a" + data[i + 2:]
            bs = 0
            ln -= 1

        i += 1

    # data = re.sub(r" \\(?= )", " ", data)
    data = re.sub(ur"(\u0020\\)(?=\u0020)", u"\u0020", data)
    data = data.replace(u"\u005c\u005c", u"\u005c")

    return data


def get_data_from_file(file_name):
    r = {
        "data": "",
        "exitcode": 0
    }

    try:
        f = open(file_name, "rb")
    except:
        r["exitcode"] = 4
    else:
        if not is_file(file_name):
            r["exitcode"] = 3
        else:
            r["data"] = f.read()
            f.close()

            if (is_allowed_data(r["data"]) and
                    r["data"] != get_clear_data(r["data"])):
                r["data"] = get_clear_data(r["data"])
                r["exitcode"] = 1 if len(r["data"]) != 0 else 2

    return r


def get_tok_from_cmdline(data):
    r = {
        "data": "",
        "exitcode": 0
    }

    if is_allowed_data(data):
        r["data"] = get_clear_data(data)
    else:
        r["exitcode"] = 2

    return r


def get_response_header(data):
    r = None
    msg = re.sub("^\s+|\r|\s+$", "", data)
    bl = msg.split()
    ln = msg.split("\n")

    if ln[0] == ts_msg.OK:
        r = ln[0]
    elif (bl[0] == ts_msg.OK or
            bl[0] == ts_msg.IDX_NODN or
            bl[0] == ts_msg.JOB_QUEUED):
        r = bl[0]
    else:
        r = data

    return r


def get_job_id(data):
    if not bool(data):
        return None

    bl = re.sub("^\s+|\r|\s+$", "", data).split()

    return (int(bl[1]) if len(bl) == 2 and bl[0] == "OK" and
            int(bl[1]) >= 1000 else None)


def get_parsed_rec(data):
    if not bool(data):
        return None

    r = {}
    bl = re.sub("^OK|^\s|\r|\s+$", "", data).split()

    if len(bl) < 5:
        return None

    r["n"] = int(bl[0])
    r["s"] = bl[1]
    r["k"] = bl[2]
    r["g"] = bl[3]
    r["o"] = bl[4]
    r["d"] = ""

    if len(bl) > 5:
        d = []

        for i in range(5, len(bl)):
            d.append(bl[i])

        r["d"] = " ".join(d)

    return r


def get_tok_status(lr, nr):
    # OK
    if lr["g"] == nr["g"] and lr["o"] == nr["o"]:
        return 0

    # PWD_SNDNG
    if lr["g"] == nr["g"]:

        return 1

    # PWD_RCVNG
    if lr["o"] == nr["o"]:
        return 2

    # PWD_WRONG
    return 3


def get_instant_key(r, p, m, h, a):
    k1 = get_key(r["n"] + 1, r["s"], p, m, h)
    k2 = get_key(r["n"] + 2, r["s"], p, m, h)
    line = get_spaced_concat(r["s"], k1, k2)
    crc = get_hash(line.replace(u"\u0020", ""), "s22")[:4]
    line = get_spaced_concat(line, crc, a, INSTANT_CODE)

    return line


def get_onhold_key(r, p, m, h, a):
    k1 = get_key(r["n"] + 1, r["s"], p, m, h)
    k2 = get_key(r["n"] + 2, r["s"], p, m, h)
    g1 = get_key(r["n"] + 2, r["s"], k2, m, h)
    line = get_spaced_concat(r["s"], k1, g1)
    crc = get_hash(line.replace(u"\u0020", ""), "s22")[:4]
    line = get_spaced_concat(line, crc, a, ONHOLD_CODE)

    return line


def get_release_key(r, p, m, h, a, v):
    n = r["n"] + 1 if v == 1 else r["n"] + 2
    c = RELEASE_S_CODE if v == 1 else RELEASE_R_CODE
    k = get_key(n, r["s"], p, m, h)
    line = get_spaced_concat(r["s"], k)
    crc = get_hash(line.replace(u"\u0020", ""), "s22")[:4]
    line = get_spaced_concat(line, crc, a, c)

    return line


def is_asgmt_key(key):
    if not bool(key):
        return False

    if not is_hex(key.replace(u"\u0020", "")):
        return False

    key = re.sub(u"\u0020{2,}", u"\u0020", key)
    key = re.sub("^\s+|\s+$", "", key).split()
    prc = key.pop(-1)
    prc_ch0 = prc[0]

    if prc_ch0 != "1" and prc_ch0 != "2":
        return False

    is_num_rec = True if prc_ch0 == "1" else False
    prc_len = len(prc)

    if prc_len < 3 or prc_len > 6:
        return False

    if prc_len == 3 or prc_len == 4:
        key_qty = 3 if is_num_rec else 2

    if prc_len == 5 or prc_len == 6:
        key_qty = 4 if is_num_rec else 3

    if (prc != INSTANT_CODE and
            prc != INSTANT_CODE_N and
            prc != ONHOLD_CODE and
            prc != ONHOLD_CODE_N and
            prc != RELEASE_S_CODE and
            prc != RELEASE_S_CODE_N and
            prc != RELEASE_R_CODE and
            prc != RELEASE_R_CODE_N):
        return False

    key_crc = ""
    crc = ""
    key_len = 0

    if len(key[-1]) == 4:
        key_crc = key.pop(-1)
        crc = get_hash("".join(key), "s22")[:4]
    elif len(key[-2]) == 4:
        key_crc = key.pop(-2)
        key_len = len(key.pop(-1))
        crc = get_hash("".join(key), "s22")[:4]

    ln = len(key)

    if key_crc != crc:
        return False

    if ln < key_qty:
        return False

    if key_len == 0:
        mod = ln % key_qty

        if mod != 0 and mod != 1:
            return False

        key_len = len(key[-1]) if mod == 0 else len(key.pop(-1))

    if is_num_rec:
        for i in range(0, len(key), key_qty):
            if not key[i].isdigit():
                return False

            key.pop(i)
            i -= 1

    if key_len <= 0:
        key_len == len(key[0])

    for i in range(len(key)):
        if key_len != len(key[i]):
            return False

    return True


def get_asgmt_key(key):
    key = re.sub(u"\u0020{2,}", u"\u0020", key)
    key = re.sub("^\s+|\s+$", "", key).split()

    prc = key.pop(-1)
    prc_ch0 = prc[0]

    is_num_rec = True if prc_ch0 == "1" else False
    prc_len = len(prc)

    if prc_len == 3 or prc_len == 4:
        exp_key_qty = 3 if is_num_rec else 2

    if prc_len == 5 or prc_len == 6:
        exp_key_qty = 4 if is_num_rec else 3

    if len(key[-1]) == 4:
        key.pop(-1)
    elif len(key[-2]) == 4:
        key.pop(-2)

    asgmt_key = {}

    if len(key) % exp_key_qty == 1:
        key.pop(-1)

    asgmt_key["prc"] = prc
    asgmt_key["n"] = int(key[0]) if is_num_rec else -1
    asgmt_key["s"] = key[1] if is_num_rec else key[0]

    if prc == INSTANT_CODE or prc == INSTANT_CODE_N:
        asgmt_key["k1"] = key[2] if is_num_rec else key[1]
        asgmt_key["k2"] = key[3] if is_num_rec else key[2]
    elif prc == ONHOLD_CODE or prc == ONHOLD_CODE_N:
        asgmt_key["k1"] = key[2] if is_num_rec else key[1]
        asgmt_key["g1"] = key[3] if is_num_rec else key[2]
    elif prc == RELEASE_S_CODE or prc == RELEASE_S_CODE_N:
        asgmt_key["k1"] = key[2] if is_num_rec else key[1]
    elif prc == RELEASE_R_CODE or prc == RELEASE_R_CODE_N:
        asgmt_key["k2"] = key[2] if is_num_rec else key[1]

    return asgmt_key


def get_title_rec(asgmt_key, p, m, h):
    title_rec = asgmt_key
    title_rec["n1"] = n1 = title_rec.pop("n") + 1
    n2 = n1 + 1
    n3 = n1 + 2
    n4 = n1 + 3
    s = title_rec["s"]
    prc = title_rec.pop("prc")
    prc_ch0 = prc[0]
    is_rec_num = True if prc_ch0 == 1 else False

    if prc == INSTANT_CODE or prc == INSTANT_CODE_N:
        title_rec["n2"] = n2
        k2 = asgmt_key["k2"]
        title_rec["g1"] = get_key(n2, s, k2, m, h)
        k3 = get_key(n3, s, p, m, h)
        g2 = title_rec["g2"] = get_key(n3, s, k3, m, h)
        title_rec["o1"] = get_key(n2, s, g2, m, h)
        k4 = get_key(n4, s, p, m, h)
        g3 = get_key(n4, s, k4, m, h)
        title_rec["o2"] = get_key(n3, s, g3, m, h)
    elif prc == ONHOLD_CODE or prc == ONHOLD_CODE_N:
        k3 = get_key(n3, s, p, m, h)
        g2 = get_key(n3, s, k3, m, h)
        title_rec["o1"] = get_key(n2, s, g2, m, h)
    elif prc == RELEASE_S_CODE or prc == RELEASE_S_CODE_N:
        k2 = get_key(n2, s, p, m, h)
        k3 = get_key(n3, s, p, m, h)
        g2 = get_key(n3, s, k3, m, h)
        title_rec["g1"] = get_key(n2, s, k2, m, h)
        title_rec["o1"] = get_key(n2, s, g2, m, h)
    elif prc == RELEASE_R_CODE or prc == RELEASE_R_CODE_N:
        title_rec["n2"] = n2
        title_rec["k1"] = get_key(n1, s, p, m, h)
        title_rec["g1"] = get_key(n2, s, title_rec["k2"], m, h)
        k3 = get_key(n3, s, p, m, h)
        title_rec["g2"] = get_key(n3, s, k3, m, h)
        title_rec["o1"] = get_key(n2, s, title_rec["g2"], m, h)
        k4 = get_key(n4, s, p, m, h)
        g3 = get_key(n4, s, k4, m, h)
        title_rec["o2"] = get_key(n3, s, g3, m, h)
    return title_rec
