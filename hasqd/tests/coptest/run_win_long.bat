del /F /Q _cop_result*.html

cd ../../src
make clean
make
make PLAT=unx
cd ../tests/coptest
sh cop clean
sh cop all
sh cop html _cop_result_msc.html

sh cop clean
sh cop PLAT unx all
sh cop html _cop_result_unx.html

cd ../../src
make clean
make MEMORY=1
make PLAT=unx MEMORY=1
cd ../tests/coptest
sh cop clean
sh cop all
sh cop html _cop_result_msm.html

sh cop clean
sh cop PLAT unx all
sh cop html _cop_result_unm.html

start _cop_result_msc.html
start _cop_result_unx.html
start _cop_result_msm.html
start _cop_result_unm.html

::cd ../gcov
::sh run_1_build.sh

