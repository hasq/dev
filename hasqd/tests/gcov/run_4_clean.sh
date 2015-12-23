#!/bin/sh

gcovdir=`pwd`
dirres=tests/gcov/

rm -f *.cpp *.cpp.gcov *.html ../_cop_result.html

cd ../coptest
sh cop PLAT unx clean

#make clean
