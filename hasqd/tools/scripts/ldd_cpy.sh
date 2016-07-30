#!/bin/sh

#############################################################
# This script copies all ldd dependencies found by ldd_dep  #
#############################################################


n=ldd_dep.tmp

if [ "$1" = "" ]
then
echo "Usage: ldd_dep.sh [outputdir]"
exit
fi

while read NM
do
 if [ "$NM" != "" ]
 then

 dd=`dirname $NM`
 ff=`basename $NM`
 mkdir -p $1/$dd 2> /dev/null
 cp $NM $1/$NM
 echo "$ff = $1/$NM"

 fi
done < $n

