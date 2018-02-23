#!/bin/sh

gcovdir=`pwd`
dirres=tests/gcov/

cd ../../src

cd ../tests/coptest

sh cop PLAT unx clean
sh cop PLAT unx all
sh cop PLAT unx html _cop_result.html
#sh cop PLAT unx clean

cd ../gcov

sh run_3_result.sh
