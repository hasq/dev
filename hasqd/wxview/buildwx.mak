# Hasq Technology Pty Ltd (C) 2013-2015


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
#NOSTATICLIB=/NODEFAULTLIB:LIBCMT

# USE UNICODE
#UNICODE=-D_UNICODE=1

OPT=-EHsc -Ox -wd4005

all: $(WX)/lib/vc_lib/wxbase28.lib

clean:
	rm -rf *.exe.manifest *.exe *.obj *.tmp $(WXNAME) $(WXNAME).*

$(WX)/lib/vc_lib/wxbase28.lib: $(WX)
	cd $(WX)/build/msw && env -u MAKE -u MAKEFLAGS nmake -f makefile.vc BUILD=release

$(WX):  $(WXNAME).fcl
	fcl3 extr $(WXNAME).fcl
	touch $(WX)

$(WXNAME).fcl: $(WXNAME).fcl.bz2
	bzip2 -d -k $(WXNAME).fcl.bz2
	chmod 0777 $(WXNAME).fcl
	touch $(WXNAME).fcl

$(WXNAME).fcl.bz2: ../third/wx/$(WXNAME).fcl.bz2
	cp $< $@
	chmod 0777 $@


