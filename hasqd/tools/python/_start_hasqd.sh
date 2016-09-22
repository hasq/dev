#!/bin/sh
# Hasq Technology Pty Ltd (C) 2013-2015

PLAT=${PLAT:-msc}
bin=_bin_${PLAT}

comm="../../src/$bin/hasqd tcp_port=13161 dprn=1 dpul=1 dced=1 dwkr=1 cycle=10000 zlim=100"

error() {
	[ -z "$1" ] || echo ">>> $1"
	exit 1
}

./_create_db.sh
 
[ "$?" -eq 0 ] || error

if [ "$1" = "here" ]
then
$comm
exit
fi

if cmd /c ls 2> /dev/null 1> /dev/null
then
cmd /c start $comm
else
$comm
fi


