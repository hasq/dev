#!/bin/sh

if [ "$2" = "" ]; then
echo "Usage: ossl2 password file"
exit
fi

cmd /c ossl enc $2 o2
mv $2 $2.tmp
cmd /c ossl dec $2.e o2

if diff $2.tmp $2 >/dev/null ; then
 :
else
	echo "Error in encryption"
	exit 1
fi

rm $2.tmp $2

echo Done

