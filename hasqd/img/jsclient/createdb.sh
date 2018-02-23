#!/bin/bash

counter=0

unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     PLAT=unx;;
    CYGWIN*)    PLAT=msc;;
    *)          PLAT="unknown:${unameOut}"
esac

bin=_bin_${PLAT}
zdb="../../src/$bin/zdb"

error() {
	[ -z "$1" ] || echo ">>> $1"
	exit 1
}


[ "$1" == "erase" ] && "$zdb" erasedisk && exit
[ "$1" == "clean" ] && "$zdb" erasedisk

#[ ! -f "slice/wrd.db/db.traits" ] && "$zdb" "create wrd.db wrd WRD 1 [magic] 1 0" || echo "wrd.db already exists"
#[ ! -f "slice/md5.db/db.traits" ] && "$zdb" "create md5.db md5 MD5 1 [magic] 1 0" || echo "md5.db already exists"
#[ ! -f "slice/r16.db/db.traits" ] && "$zdb" "create r16.db r16 R16 1 [magic] 1 0" || echo "r16.db already exists"
#[ ! -f "slice/s22.db/db.traits" ] && "$zdb" "create s22.db s22 S22 1 [magic] 1 0" || echo "s22.db already exists"
#[ ! -f "slice/s25.db/db.traits" ] && "$zdb" "create s25.db s25 S25 1 [magic] 1 0" || echo "s25.db already exists"
[ ! -f "slice/smd.db/db.traits" ] && "$zdb" "create smd.db smd SMD 1 [] 1 0 5H" || echo "smd.db already exists"

exit 0
