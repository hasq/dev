#!/bin/sh

gcovdir=`pwd`
dirres=tests/gcov/

while true
do

cd ../../src

ver1=`svn up`
ver2=`cat svn.ver`

if [ "$ver1" = "$ver2" ]; then

cd ../tests
cd gcov

echo same $ver1
sleep 5

else

echo $ver1 > svn.ver

cd ../../src

make clean
make PLAT=unx GCOV=1

cd ../tests/coptest

sh cop PLAT unx clean
sh cop PLAT unx all
sh cop PLAT unx html _cop_result.html

cd ../gcov

rm -f *.cpp *.cpp.gcov
sh run_3_result.sh

mkdir cppgcov
mv *.cpp.gcov cppgcov/
fcl3 make -D cppgcov cppgcov
rm -rf cppgcov
mv cppgcov.fcl ../

fi

done
