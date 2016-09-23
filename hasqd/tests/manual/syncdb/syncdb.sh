#!/bin/sh

# HSL: agent validate check

rm -rf ts_list.* ts_slcs ts_idxs hn_list.* hn_slcs hn_idxs

INP=$(basename $0)
INP=${INP%.*} 
PLAT=msc
HIDEE="../../../../admin/tools/hidee.exe"
P="../../../src/_bin_$PLAT"

[ ! -f myname ] && "$HIDEE" && exit 0
[ -f skc.key.e -a -f "$HIDEE" ] && "$HIDEE" skc.key.e || exit 1

SKCKEY="$(cat skc.key)"

rm -f skc.key

CMD_ZDB0="erasedisk"
CMD_ZDB1="create smd.db smd SMD 1 [] 1 0"
CMD_HASQD="-lqnxc dprn=1 dsvt=1 dagt=1 dwkr=1 tcp_port=14000 skckey=$SKCKEY s=$INP.inp"

"$P/zdb" "$CMD_ZDB0" "$CMD_ZDB1"
#echo "$CMD_HASQD"
"$P/hasqd" $CMD_HASQD | grep -v "noterecv\|conupdate"
