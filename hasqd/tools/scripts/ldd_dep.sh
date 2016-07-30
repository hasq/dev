#!/bin/sh

##########################################
# This script find all ldd dependencies  #
##########################################

if [ "$1" = "" ]
then
echo "Usage: ldd_dep.sh <target> [outputdir]"
exit
fi

###############################
# 1 list of files - unique
# 2 list of ldd output - unique
# 3 list of files generated from 2 - unique
# 4 list of ldd output - not unique
# 5 list of file extracted from ldd output - not unique
###############################

n=ldd_dep.tmp

if ldd $1 > 2$n 2> /dev/null
then
:
else
rm -f 2$n
echo Unable to identify target $1
exit
fi

echo $1 > 1$n

process(){
: > 5$n
while read NM AR TG NU
do
 if [ "$TG" != "" ]
 then
   if test -f $TG
   then
   echo $TG >> 5$n
   echo $AR $TG
   fi
 fi
done < 2$n

cat 1$n >> 5$n

cat 5$n | sort | uniq > 3$n

}

gen2(){

: > 4$n
while read NM
do
 if [ "$NM" != "" ]
 then

 ldd $NM >> 4$n 2> /dev/null

 fi
done < 1$n

cat 4$n | sort | uniq > 2$n

}

while true
do
 process
 if cmp 1$n 3$n 2> /dev/null 1> /dev/null
 then
   mv 3$n $n
   rm -f 1$n 2$n 4$n 5$n
   exit
 fi
 mv 3$n 1$n
 gen2
 ls -l 1$n
done

echo "File saved in $n"
exit
