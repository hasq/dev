#!/usr/bin/python


# token_check (name|@file) [password|-]
# - ask for password
# reply
# 1 status tokena exists or not
# 2 ownership, only if password provided
# 3 data

# 1 Token exists | No token
# 2 Password OK | Password Bad | Onhold sending | Onhold receiving
# 3 No data
# ===========
# my data
# ===========

import sys
import urllib2
import getpass
import ts_lib
import ts_cnf
import ts_msg