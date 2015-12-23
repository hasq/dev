Added:

valgrind memcheck tool - run with "sh cop memcheck"

"memcheck" command replaces the "all" command, and it works recursively, as "all"
"runmemcheck" command replaces "run" command, running specific .sts test file


Valgrind do not need to compile - just install it

on Arch:
pacman -S valgrind

or, if your distro dont have valgrind or have less then version 3.9.0:

wget http://valgrind.org/downloads/valgrind-3.9.0.tar.bz2
tar xjvf valgrind-3.9.0.tar.bz2
cd valgrind-3.9.0
./configure --prefix=/opt/valgrind
make
sudo make install
