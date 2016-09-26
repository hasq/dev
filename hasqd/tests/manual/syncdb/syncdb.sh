#!/bin/sh

rm -rf ts_list.* syncdb.log index slice ts_slcs ts_idxs hn_list.* hn_slcs hn_idxs

INP=$(basename $0)
INP=${INP%.*} 
PLAT=msc
HIDEE="../../../../admin/tools/hidee.exe"
P="../../../src/_bin_$PLAT"

error() {
	[ -z "$1" ] || printf "ERROR: $1"
	exit 1
}

[ ! -f "$HIDEE" ] && error "Please compile hidee.cpp first!"
[ ! -f "myname" ] && "$HIDEE"
[ -f "skc.key.e" ] && "$HIDEE" skc.key.e || error "SKC-key file is missing!"

SKCKEY="$(cat skc.key)"

rm -f skc.key

CMD_ZDB0="erasedisk"
CMD_ZDB1="create smd.db smd SMD 1 [] 100 0"
CMD_HASQD="-lqnxc dprn=1 dsvt=1 dagt=1 dwkr=1 tcp_port=14000 skckey=$SKCKEY s=$INP.inp"

"$P/zdb" "$CMD_ZDB0" "$CMD_ZDB1"
#echo "$CMD_HASQD"
"$P/hasqd" $CMD_HASQD | grep -v "noterecv\|conupdate"

rm -rf ts_list.* index slice ts_slcs ts_idxs hn_list.* hn_slcs hn_idxs
