#!/bin/sh

PLAT=msc

[ -f ts.pwd ] && PX=`cat ts.pwd`

cmd="../../../src/_bin_$PLAT/hasqd -lpc dagt=1 dprn=1 dsvt=1 $PX s=ts.inp"
echo $cmd
$cmd

