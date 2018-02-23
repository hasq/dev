# Hasq Technology Pty Ltd (C) 2013-2016

COMPILER=cl
COMPILERC=cl
AR=arXXX
ARCR=lib /OUT:
LD=ld
RANLIB=ranlibXXX
STRIP=strip

OPT=-WX -W4 -nologo -EHsc -Ox -D_CRT_SECURE_NO_DEPRECATE=1 /wd4355 /wd4127 /wd4702 /wd4100 /wd4290 -D_USING_V110_SDK71_=1
#4355 'this' used in base member initializer list
#4127 conditional expression is constant
#4244 possible loss of data
#4100 unreferenced formal parameter
#4309 trucation of constant value
#4702 unreachable code
#4290 C++ exception specification ignored except to indicate a function is not __declspec(nothrow)

OPTC=$(OPT)

INC=
EEXT=.exe
OEXT=.obj
LEXT=.lib
DEFEXT=.exe
LDF=WS2_32.Lib advapi32.lib
OOUT=-Fo
EOUT=-Fe

