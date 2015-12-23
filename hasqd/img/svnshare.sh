#!/bin/sh
#.
# Script ispolzuetsa dlya peredachi failov s virtualnoj mashiny
# na host (realnuyu mashinu) posredstvom SVN
# Zapuskaetsa avtomaticheski iz scripts/automate.sh
#.
# Seychas ispolzuetsa dlya kopirovanija gotovogo HASQ TC ISO v host sistemu
#.

n=sharesvn

cwd=`pwd | sed -e 's/\/cygdrive\/.//g'`
cwdr="file://localhost$cwd/${n}_repo"


if [ "$1" = "" ]
then
echo "Usage: sh svnshare.sh <folder2share>"
echo "Usage: sh svnshare.sh clean"
exit
fi

if [ "$1" = "clean" ]
then
rm -rf ${n}_repo ${n}_local
exit
fi

if test -d $1
then
:
else
echo ERROR no $1 directory
exit
fi

# sheck svn
cd $1
chk=`find .svn * 2> /dev/null | grep "\.svn"`
if [ "$chk" = "" ]
then
:
else
echo "ERROR: Directory has .svn subdirs; if it is part of svn make export first"
echo $chk
exit
fi
cd ..

if test -d ${n}_repo
then
echo "Repository ${n}_repo exists, use 'svnshare.sh clean'"
exit
fi

svnadmin create ${n}_repo
#svnadmin setuuid ${n}_repo 4a594a59-4a59-4a59-4a59-4a594a594a59
svn co $cwdr ${n}_local
echo "svn co $cwdr ${n}_local"
cp -R $1 ${n}_local/
cd ${n}_local

svn add $1
svn ci -m ""
cd ..

mv ${n}_repo/conf/svnserve.conf ${n}_repo/conf/svnserve.conf.o
echo "[general]" > ${n}_repo/conf/svnserve.conf
echo "anon-access = write" >> ${n}_repo/conf/svnserve.conf

#echo "= starting svn server ="

if cmd /c ls 2> /dev/null 1> /dev/null
then

ipconfig | grep IPv4

#echo cmd /c start svnserve -d -r ${n}_repo
cmd /c start svnserve -d -r ${n}_repo

else

[ -z "$(which ifconfig)" ] || ourip=$(ifconfig|grep -i "inet addr"|grep -v "127.0.0.1"|awk '{ print $2 }')
echo "$ourip"

echo "Use Ctrl-Z, bg - to background process; fg, Ctrl-C - to foreground and kill"
#echo svnserve -d --foreground -r ${n}_repo
svnserve -d --foreground -r ${n}_repo
fi



