# Hasq Technology Pty Ltd (C) 2013-2016

COMPILER=g++
COMPILERC=gcc
ARCR=ar crs #
AR=arXXX
LD=ld
RANLIB=ranlibXXX
STRIP=strip

OPT=-Wall -O2 -std=c++11 -fno-strict-aliasing
OPTC=-Wall -O2

INC=
EEXT=
OEXT=.o
LEXT=.a
DEFEXT=
LDF=-lpthread
OOUT=-o 
EOUT=-o 

ifdef GCOV
OPT= -Wall -g -std=c++11 -fprofile-arcs -ftest-coverage -fno-elide-constructors
endif

