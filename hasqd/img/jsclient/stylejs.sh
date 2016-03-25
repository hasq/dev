#!/bin/sh

if [ "$1" = "" ]; then
echo "Use filename"
exit
fi

fl=$1

sed 's/case.*\:/\0\`;/g' $fl > $fl.1.tmp
sed 's/\:/\`/g' $fl.1.tmp > $fl.2.tmp
sed 's/===/\`~~/g' $fl.2.tmp > $fl.3.tmp
sed 's/\!==/\`\`~/g' $fl.3.tmp > $fl.4.tmp
sed 's/*.\/*./\/\/\`\0/g' $fl.4.tmp > $fl.8.tmp

cat $fl.8.tmp > $fl.x.tmp
cmd /c style $fl.8.tmp
cat $fl.8.tmp > $fl.5.tmp

sed 's/\/\/`//g' $fl.5.tmp > $fl.4.tmp
sed 's/``~/!==/g' $fl.4.tmp > $fl.3.tmp
sed 's/`~~/===/g' $fl.3.tmp > $fl.2.tmp
sed 's/``;/:/g' $fl.2.tmp > $fl.1.tmp
sed 's/`/:/g' $fl.1.tmp > $fl

rm -f $fl.*.tmp


