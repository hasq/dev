
WX=C:/app/wxWidgets-2.8.11

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
UNICODE=-D_UNICODE=1

all: hwx.exe

hwx.exe: hwx.obj
	link /NOLOGO $(NOSTATICLIB) $< /LIBPATH:$(LIBPATH) $(LIBS)

hwx.obj: hwx.cpp
	cl -c -EHsc $(INC) $(STATICLIB) $(DYNAMICLIB) $(UNICODE) $<


clean:
	rm -f hwx.exe.manifest hwx.exe hwx.obj