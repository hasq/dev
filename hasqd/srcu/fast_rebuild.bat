set PL=PLAT=msc

echo %PL%
exit

make %PL% clean
cd ../src && make %PL% clean && cd ../srcu

cd ../src/gl && make %PL% -j 10 && cd ../../srcu
cd ../src/os && make %PL% -j 10 && cd ../../srcu
cd ../src/sg && make %PL% -j 10 && cd ../../srcu
cd ../src/ma && make %PL% -j 10 && cd ../../srcu
cd ../src/db && make %PL% -j 10 && cd ../../srcu
cd ../src/pu && make %PL% -j 10 && cd ../../srcu

cd ../src && make %PL% && cd ../srcu

cd vi && make %PL% -j 10 && cd ..
make %PL%
make %PL%


