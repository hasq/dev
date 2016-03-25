#!/bin/sh

if [ "$1" = "" ]; then
echo "Use filename"
exit
fi

fl=$1

sed 's/case.*\:/\0\`;/g' $fl > $fl.1.tmp
sed 's/\:/\`/g' $fl.1.tmp > $fl.2.tmp
cmd /c style $fl.2.tmp
sed 's/``;/:/g' $fl.2.tmp > $fl.1.tmp
sed 's/`/:/g' $fl.1.tmp > $fl
rm -f $fl.1.tmp $fl.2.tmp


