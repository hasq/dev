del /F /Q _cop_result*.html


cd ../../src
make clean
make

cd ../srcu
make clean
make

cd ../tests/coptest
sh cop clean
sh cop all
sh cop html _cop_result_msc.html

