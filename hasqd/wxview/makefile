# Hasq Technology Pty Ltd (C) 2013-2015

WXNAME=wxw2812m
WX=./$(WXNAME)

HSRC=../src
HSRCU=../srcu
VSRC=$(HSRCU)/vi

INC=-I $(WX)/include/msvc -I $(WX)/include
LIBPATH=$(WX)/lib/vc_lib

LIBS="comctl32.lib" "Rpcrt4.lib" "kernel32.lib" "user32.lib" "gdi32.lib" \
	"winspool.lib" "comdlg32.lib" "advapi32.lib" "shell32.lib" "ole32.lib" \
	"oleaut32.lib" "uuid.lib" "odbc32.lib" "odbccp32.lib" "WS2_32.Lib"

# USE STATIC OR DYNAMIC LIBS
#STATICLIB=-MT
DYNAMICLIB=-MD
NOSTATICLIB=/NODEFAULTLIB:LIBCMT

# USE UNICODE
#UNICODE=-D_UNICODE=1

OPT=-EHsc -Ox -wd4005


GLDIR=$(HSRC)/gl
INC := $(INC) -I$(GLDIR)

OSDIR=$(HSRC)/os
INC := $(INC) -I$(OSDIR)

DBDIR=$(HSRC)/db
INC := $(INC) -I$(DBDIR)

MADIR=$(HSRC)/ma
INC := $(INC) -I$(MADIR)

PUDIR=$(HSRC)/pu
INC := $(INC) -I$(PUDIR)

SGDIR=$(HSRC)/sg
INC := $(INC) -I$(SGDIR)

O=objs

src = $(VSRC)/canvas.cpp $(VSRC)/node.cpp
obj := $(src:$(VSRC)/%.cpp=$O/%.obj)

src_pu = $(HSRC)/pu/hq_config.cpp $(HSRC)/pu/hq_globalspace.cpp $(HSRC)/pu/hq_logger.cpp \
	$(HSRC)/pu/hq_servant.cpp $(HSRC)/pu/hq_publisher.cpp $(HSRC)/pu/hq_svttask.cpp \
	$(HSRC)/pu/hq_worker.cpp $(HSRC)/pu/hq_chiefeditor.cpp $(HSRC)/pu/hq_wkrtask.cpp \
	$(HSRC)/pu/hq_secretary.cpp $(HSRC)/pu/hq_automachine.cpp $(HSRC)/pu/hq_svtjob.cpp \
	$(HSRC)/pu/hq_connector.cpp $(HSRC)/pu/hq_alarms.cpp $(HSRC)/pu/hq_conflict.cpp	\
	$(HSRC)/pu/hq_reorgan.cpp $(HSRC)/pu/hq_gl_bin.cpp  $(HSRC)/pu/hq_gl_ced.cpp \
	$(HSRC)/pu/hq_gl_con.cpp $(HSRC)/pu/hq_gl_key.cpp $(HSRC)/pu/hq_gl_svt.cpp \
	$(HSRC)/pu/hq_gl_wkr.cpp $(HSRC)/pu/hq_plebfile.cpp

obj_pu := $(src_pu:$(HSRC)/pu/%.cpp=$O/%.obj)


src_sg = $(HSRC)/sg/sg_client.cpp $(HSRC)/sg/sg_cout.cpp 

obj_sg := $(src_sg:$(HSRC)/sg/%.cpp=$O/%.obj)


src_gl = $(HSRC)/gl/gl_except.cpp $(HSRC)/gl/gl_utils.cpp $(HSRC)/gl/gl_protocol.cpp \
	$(HSRC)/gl/gl_err.cpp $(HSRC)/gl/gl_token.cpp $(HSRC)/gl/gl_rnd.cpp

obj_gl := $(src_gl:$(HSRC)/gl/%.cpp=$O/%.obj)



src_os = $(HSRC)/os/os_place.cpp $(HSRC)/os/os_net.cpp $(HSRC)/os/os_filesys.cpp \
	$(HSRC)/os/os_block.cpp $(HSRC)/os/os_threadc.cpp $(HSRC)/os/os_ipaddrc.cpp

obj_os := $(src_os:$(HSRC)/os/%.cpp=$O/%.obj)



src_osw = $(HSRC)/os/msc/os_ipaddr.cpp $(HSRC)/os/msc/os_net2.cpp \
	$(HSRC)/os/msc/os_sem.cpp $(HSRC)/os/msc/os_file2.cpp \
	$(HSRC)/os/msc/os_timer2.cpp $(HSRC)/os/msc/os_thread.cpp \
	$(HSRC)/os/msc/os_sysinfo.cpp $(HSRC)/os/msc/os_exec.cpp

obj_osw := $(src_osw:$(HSRC)/os/msc/%.cpp=$O/%.obj)



src_db = $(HSRC)/db/hq_db.cpp $(HSRC)/db/hq_hash.cpp $(HSRC)/db/hq_dbslice.cpp \
	$(HSRC)/db/hq_record.cpp $(HSRC)/db/hq_sl_file.cpp $(HSRC)/db/hq_sl_meta.cpp \
	$(HSRC)/db/hq_dbindex.cpp $(HSRC)/db/hq_single.cpp $(HSRC)/db/hq_sl_hdt.cpp \
	$(HSRC)/db/hq_traits.cpp

obj_db := $(src_db:$(HSRC)/db/%.cpp=$O/%.obj)

src_ma = $(HSRC)/ma/ma_hash.cpp $(HSRC)/ma/sha2.cpp \
	 $(HSRC)/ma/rmd160.cpp  $(HSRC)/ma/md5.cpp  \
	 $(HSRC)/ma/ma_dag.cpp $(HSRC)/ma/ma_utils.cpp $(HSRC)/ma/base64.cpp \
	 $(HSRC)/ma/ma_skc.cpp $(HSRC)/ma/ma_pkc.cpp $(HSRC)/ma/ma_invert.cpp

obj_ma := $(src_ma:$(HSRC)/ma/%.cpp=$O/%.obj)


csrc_ma = $(HSRC)/ma/cunmber_4096.c

cobj_ma := $(csrc_ma:$(HSRC)/ma/%.c=$O/%.obj)

all: wxviewer.exe

wxviewer.exe: $(WX)/lib/vc_lib/wxbase28.lib $O/wxviewer.obj $O/draw.obj \
	$O/draw2.obj $O/cmdex.obj $(obj) \
	$(obj_pu) $(obj_db) $(obj_gl) $(obj_os) $(obj_osw) $(obj_ma) $(cobj_ma) \
	$(obj_sg) $(VSRC)/*.h $(VSRC)/*.cpp
	link $(NOSTATICLIB) $O/wxviewer.obj $O/draw.obj $O/draw2.obj $O/cmdex.obj \
	$(obj) $(obj_pu) $(obj_sg) $(obj_db) $(obj_gl) $(obj_os) $(obj_osw) \
	$(obj_ma) $(cobj_ma) /LIBPATH:$(LIBPATH) $(LIBS)

$O/wxviewer.obj: wxviewer.cpp wxviewer.h $(VSRC)/*.h
	cl -c $(OPT) -I $(VSRC)/ $(INC) $(STATICLIB) $(DYNAMICLIB) $(UNICODE) $< /Fo$@

$O/draw.obj: draw.cpp wxviewer.h $(VSRC)/*.h
	cl -c $(OPT) -I $(VSRC)/ $(INC) $(STATICLIB) $(DYNAMICLIB) $(UNICODE) $< /Fo$@

$O/draw2.obj: draw2.cpp wxviewer.h $(VSRC)/*.h
	cl -c $(OPT) -I $(VSRC)/ $(INC) $(STATICLIB) $(DYNAMICLIB) $(UNICODE) $< /Fo$@

$O/cmdex.obj: cmdex.cpp wxviewer.h $(VSRC)/*.h
	cl -c $(OPT) -I $(VSRC)/ $(INC) $(STATICLIB) $(DYNAMICLIB) $(UNICODE) $< /Fo$@

$(obj): $O/%.obj:$(VSRC)/%.cpp $(VSRC)/*.h
	cl -c $(OPT) $(INC) $(STATICLIB) $(DYNAMICLIB) $(UNICODE) $< /Fo$@

$(obj_pu): $O/%.obj:$(HSRC)/pu/%.cpp $(HSRC)/pu/*.h $(HSRC)/db/*.h $(HSRC)/gl/*.h $(HSRC)/os/*.h
	cl -c $(OPT) $(INC) $(STATICLIB) $(DYNAMICLIB) $(UNICODE) $< /Fo$@

$(obj_sg): $O/%.obj:$(HSRC)/sg/%.cpp $(HSRC)/sg/*.h $(HSRC)/db/*.h $(HSRC)/gl/*.h $(HSRC)/os/*.h
	cl -c $(OPT) $(INC) $(STATICLIB) $(DYNAMICLIB) $(UNICODE) $< /Fo$@

$(obj_db): $O/%.obj:$(HSRC)/db/%.cpp $(HSRC)/db/*.h $(HSRC)/gl/*.h $(HSRC)/os/*.h
	cl -c $(OPT) $(INC) $(STATICLIB) $(DYNAMICLIB) $(UNICODE) $< /Fo$@

$(obj_gl): $O/%.obj:$(HSRC)/gl/%.cpp  $(HSRC)/gl/*.h
	cl -c $(OPT) $(INC) $(STATICLIB) $(DYNAMICLIB) $(UNICODE) $< /Fo$@

$(obj_os): $O/%.obj:$(HSRC)/os/%.cpp  $(HSRC)/os/*.h $(HSRC)/gl/*.h
	cl -c $(OPT) $(INC) $(STATICLIB) $(DYNAMICLIB) $(UNICODE) $< /Fo$@

$(obj_osw): $O/%.obj:$(HSRC)/os/msc/%.cpp  $(HSRC)/os/*.h $(HSRC)/gl/*.h
	cl -c $(OPT) $(INC) $(STATICLIB) $(DYNAMICLIB) $(UNICODE) $< /Fo$@

$(obj_ma): $O/%.obj:$(HSRC)/ma/%.cpp  $(HSRC)/ma/*.h
	cl -c $(OPT) $(INC) $(STATICLIB) $(DYNAMICLIB) $(UNICODE) $< /Fo$@

$(cobj_ma): $O/%.obj:$(HSRC)/ma/%.c  $(HSRC)/ma/*.h
	cl -c $(OPT) $(INC) $(STATICLIB) $(DYNAMICLIB) $(UNICODE) $< /Fo$@

$(WX)/lib/vc_lib/wxbase28.lib:
	make -f buildwx.mak

clean:
	rm -rf *.exe.manifest *.exe *.obj *.tmp $(WXNAME).* $O/* *.log
	@echo \"make cleanall\" to clean all

cleanall:
	rm -rf *.exe.manifest *.exe *.obj *.tmp $(WXNAME).* $O/* *.log $(WXNAME) db/* 



