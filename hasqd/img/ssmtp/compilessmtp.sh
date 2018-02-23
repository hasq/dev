#!/bin/bash
#.
# Etot script kompilituet ssmtp is ishodnikov
#.
sourcefile="$(ls ssmtp*bz2)"
[ -z "$sourcefile" ] && exit
tar xjvf "$sourcefile"
cd ssmtp-*
patch -p1 -i "../opessl_crypto.patch"
autoreconf
./configure --prefix= --sysconfdir=/etc --mandir=/usr/share/man --enable-md5auth --enable-ssl
make
# && make install
cd ..
rm -rf ssmtp-*
