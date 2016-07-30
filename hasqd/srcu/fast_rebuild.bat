cd ../src/gl && make -j 10 && cd ../../srcu
cd ../src/os && make -j 10 && cd ../../srcu
cd ../src/sg && make -j 10 && cd ../../srcu
cd ../src/ma && make -j 10 && cd ../../srcu
cd ../src/db && make -j 10 && cd ../../srcu
cd ../src/pu && make -j 10 && cd ../../srcu

cd ../src && make && cd ../srcu

cd vi && make -j 10 && cd ..
make
make

