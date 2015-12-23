#!/bin/sh

for i in db-14000 db-14001 db-14002 db-14003 db-14004 db-14005 db-14006
do
echo $i
mkdir -p $i

cd $i
#pwd
ls -d ../../../../src/_bin_msc/zdb
../../../../src/_bin_msc/zdb erasedisk "create _md5 md5 md5 1 [abc] 1 0"
cd ..

done

#..\..\src\_bin_msc\zdb 
