#!/bin/sh

gcovdir=`pwd`
dirres=tests/gcov/

cd ../../src

make clean
make PLAT=unx GCOV=1

cd ../$dirres

sh run_2_tests.sh
