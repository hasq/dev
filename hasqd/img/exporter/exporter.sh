#!/bin/sh

trg=_exported
owd=`pwd`

echo "Exporter: extracting makefiles"
fcl3 extr expmk.fcl

cd ..
cd ..

echo "Exporter: cleanup"
rm -rf $trg

mkdir $trg

exportdir(){

if test -d $1
then
:
else
echo "Exporter: ERROR - no $1"
exit
fi

echo "Exporter: $1 - exporting"
svn export $1 $trg/$1

echo "Exporter: $1 - making fcl"
cd $trg
fcl3 make -D $1 $1
rm -rf $1

echo "Exporter: $1 - replacing copyright in sources"
cat $1.fcl | sed -e 's/\/\/ Hasq Technology Pty Ltd (C) 2013-2015/\/\/ ======================================/g' > $1.fcl.tmp
mv $1.fcl.tmp $1.fcl

echo "Exporter: $1 - replacing copyright in makefiles"
cat $1.fcl | sed -e 's/# Hasq Technology Pty Ltd (C) 2013-2015/# =====================================/g' > $1.fcl.tmp
mv $1.fcl.tmp $1.fcl

echo "Exporter: $1 - extracting"
fcl3 extr $1.fcl

rm $1.fcl

cd ..

}

replacer()
{
file=$1
from=$2
to=$3
cat $file | sed -e "s/$from/$to/g" > $file.tmp
mv $file.tmp $file
}

exportdir pu
exportdir sg
exportdir gl
exportdir db
exportdir ma
exportdir os

echo "Exporter: fixing platform file"
replacer $trg/pu/hq_platform.h "Hasq server" "Pleb"
replacer $trg/pu/hq_platform.h "Hasq Technology Pty Ltd (C) 2013-2015" "[zonk]"

echo "Exporter: fixing target filename"
replacer $trg/pu/makefile hasqd.cpp pleb.cpp
mv $trg/pu/hasqd.cpp $trg/pu/pleb.cpp
replacer $trg/pu/pleb.cpp "hasqd.cfg" "pleb.cfg"

echo "Exporter: copying makefiles"
cp $owd/expmk/* $trg/
rm -rf $owd/expmk

echo "Exporter: removing unnecessary executables"
echo "int main(){}" > $trg/db/zdb.cpp
echo "int main(){}" > $trg/sg/tcpclient.cpp

echo "Exporter: done"

