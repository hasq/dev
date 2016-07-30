#!/bin/sh

hex="0123456789"
kiv="-iv $hex -K $hex"
kiv="-iv $hex"

if [ "$1" == "" ]; then
echo "usage: ossl dec|enc file [PASSWD]"
exit
fi

if [ "$3" == "" ]
then
	if [ "$PASSWD" == "" ]
	then
		echo "Use PASSWD arg or PASSWD env"
		exit
	fi
else
PASSWD=$3
fi
	
#echo $kiv $PASSWD

if test -f $2; then
:
else
echo "Cannot find file [$2]"
exit
fi


if [ "$1" == "dec" ]; then
b=`basename $2 .e`
cmd="openssl enc -aes-256-cbc -d -in $b.e -out $b -k $PASSWD $kiv -nosalt"
#echo $cmd
$cmd
elif [ "$1" == "enc" ]; then
cmd="openssl enc -aes-256-cbc -e -in $2 -out $2.e -k $PASSWD $kiv -nosalt"
#echo $cmd
$cmd
else
echo "Use enc or dec"
fi

exit



