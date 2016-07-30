#!/bin/sh

# svn check-in file by file

if [ "$1" = "" ] ;then
echo "Usage: sh cifbyf.sh <file>"
echo "file is a list of files and/or directories to check-in"
exit
fi

svnci()
{
 echo -n "$NM ($SZ) "
 svn cleanup
 svn add $NM
 svn ci -m nocomm
 echo " Done"
}

while read NM
do
 if [ "$NM" != "" ]
 then

 SZ=DIR
 if test -f $NM; then
 SZ=$(stat -c%s "$NM")
 fi

 svnci $NM
 svnci $NM
 svnci $NM
 svnci $NM
 svnci $NM
 svnci $NM
 svnci $NM

 fi
done < $1


