#!/bin/sh
# Hasq Technology Pty Ltd (C) 2013-2015

PLAT=${PLAT:-msc}
execdir=_bin_${PLAT}

#comm="../../src/$execdir/hasqd webdir=home tcp_port=13151 dprn=1 dpul=1 dced=1 cycle=10000"
comm="../../src/$execdir/hasqd webdir=home tcp_port=13151 dprn=1 dpul=1 dced=1 cycle=10000"

createdb.sh

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


