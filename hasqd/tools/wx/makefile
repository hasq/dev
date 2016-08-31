WXNAME=wxw2812m
WX=./$(WXNAME)

INC=-I $(WX)/include/msvc -I $(WX)/include
LIBPATH=$(WX)/lib/vc_lib

LIBS="comctl32.lib" "Rpcrt4.lib" "kernel32.lib" "user32.lib" "gdi32.lib" \
	"winspool.lib" "comdlg32.lib" "advapi32.lib" "shell32.lib" "ole32.lib" \
	"oleaut32.lib" "uuid.lib" "odbc32.lib" "odbccp32.lib"

# USE STATIC OR DYNAMIC LIBS
#STATICLIB=-MT
DYNAMICLIB=-MD
NOSTATICLIB=/NODEFAULTLIB:LIBCMT

# USE UNICODE
#UNICODE=-D_UNICODE=1

all: hwx.exe

hwx.exe: $(WX)/lib/vc_lib/wxbase28.lib hwx.obj
	link /NOLOGO $(NOSTATICLIB) $(WX)/lib/vc_lib/wxbase28.lib hwx.obj /LIBPATH:$(LIBPATH) $(LIBS)
#	link $(NOSTATICLIB) $O/hwx.obj /LIBPATH:$(LIBPATH) $(LIBS)

$(WX)/lib/vc_lib/wxbase28.lib:
	make -f buildwx.mak

hwx.obj: hwx.cpp
	cl -c -EHsc -wd4005 $(INC) $(STATICLIB) $(DYNAMICLIB) $(UNICODE) $<

clean:
	rm -rf hwx.exe.manifest hwx.exe hwx.obj $(WXNAME).*
