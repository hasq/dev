# Hasq Technology Pty Ltd (C) 2013-2015

# PLAT: msc win unx

include mk_all.mak

WINBATCH=compile_ms.bat
UNXBATCH=compile_gcc.sh

SRC=../src

all: $(TRG) $(TRG)/zdb_a.cpp $(TRG)/tcpclient_a.cpp $(TRG)/hasqd_a.cpp $(TRG)/htview_a.cpp
	@rm $(TRG)/*.tmp
	@echo "cl -EHsc -Ox -wd4005 zdb_a.cpp Advapi32.lib WS2_32.Lib -Fezdb.exe" > $(TRG)/$(WINBATCH)
	@echo "cl -EHsc -Ox -wd4005 tcpclient_a.cpp Advapi32.lib WS2_32.Lib -Fetcpclient.exe" >> $(TRG)/$(WINBATCH)
	@echo "cl -EHsc -Ox -wd4005 hasqd_a.cpp Advapi32.lib WS2_32.Lib -Fehasqd.exe" >> $(TRG)/$(WINBATCH)
	@echo "cl -EHsc -Ox -wd4005 htview_a.cpp Advapi32.lib WS2_32.Lib -Fehtview.exe" >> $(TRG)/$(WINBATCH)
	@echo "#!/bin/sh" > $(TRG)/$(UNXBATCH)
	@echo "echo zdb_a.cpp" >> $(TRG)/$(UNXBATCH)
	@echo "g++ -Wall -O2 -std=c++11 -fno-strict-aliasing zdb_a.cpp -lpthread -o zdb" >> $(TRG)/$(UNXBATCH)
	@echo "echo tcpclient_a.cpp" >> $(TRG)/$(UNXBATCH)
	@echo "g++ -Wall -O2 -std=c++11 -fno-strict-aliasing tcpclient_a.cpp -lpthread -o tcpclient" >> $(TRG)/$(UNXBATCH)
	@echo "echo hasqd_a.cpp" >> $(TRG)/$(UNXBATCH)
	@echo "g++ -Wall -O2 -std=c++11 -fno-strict-aliasing hasqd_a.cpp -lpthread -o hasqd" >> $(TRG)/$(UNXBATCH)
	@echo "echo htview_a.cpp" >> $(TRG)/$(UNXBATCH)
	@echo "g++ -Wall -O2 -std=c++11 -fno-strict-aliasing htview_a.cpp -lpthread -o htview" >> $(TRG)/$(UNXBATCH)
	@chmod +x $(TRG)/$(WINBATCH)
	@chmod +x $(TRG)/$(UNXBATCH)
	@echo "Amalgam done"

$(TRG):
	@echo "Usage: make -f amalgam.mak PLAT={msc,unx}"
	@mkdir -p $(TRG)


$(TRG)/zdb_a.cpp: $(TRG)/gl_h.tmp $(TRG)/db_h.tmp $(TRG)/os_h.tmp \
	$(TRG)/os_cpp.tmp $(TRG)/gl_cpp.tmp $(TRG)/db_cpp.tmp \
	$(TRG)/ma_h.tmp $(TRG)/ma_cpp.tmp
	@echo =zdb=
	@cat $(TRG)/gl_h.tmp   | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/os_h.tmp   | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/db_h.tmp   | grep -v "\#include \"*\"" >> $@
	@cat db/zdb.cpp        | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/os_cpp.tmp | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/gl_cpp.tmp | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/ma_h.tmp   | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/db_cpp.tmp | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/ma_cpp.tmp | grep -v "\#include \"*\"" >> $@

$(TRG)/hasqd_a.cpp: $(TRG)/gl_h.tmp $(TRG)/db_h.tmp $(TRG)/os_h.tmp \
	$(TRG)/os_cpp.tmp $(TRG)/gl_cpp.tmp $(TRG)/db_cpp.tmp \
	$(TRG)/ma_h.tmp $(TRG)/ma_cpp.tmp $(TRG)/hq_cpp.tmp \
	$(TRG)/hq_h.tmp $(TRG)/sg_h.tmp $(TRG)/sg_cpp.tmp
	@echo =hasqd=
	@cat $(TRG)/gl_h.tmp   | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/os_h.tmp   | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/db_h.tmp   | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/sg_h.tmp   | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/ma_h.tmp   | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/hq_h.tmp   | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/hq_cpp.tmp | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/os_cpp.tmp | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/gl_cpp.tmp | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/db_cpp.tmp | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/sg_cpp.tmp   | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/ma_cpp.tmp | grep -v "\#include \"*\"" >> $@

$(TRG)/htview_a.cpp: $(TRG)/gl_h.tmp $(TRG)/db_h.tmp $(TRG)/os_h.tmp \
	$(TRG)/os_cpp.tmp $(TRG)/gl_cpp.tmp $(TRG)/db_cpp.tmp \
	$(TRG)/ma_h.tmp $(TRG)/ma_cpp.tmp $(TRG)/hq_cpp.tmp \
	$(TRG)/hq_h.tmp $(TRG)/sg_h.tmp $(TRG)/sg_cpp.tmp \
	$(TRG)/vi_h.tmp $(TRG)/vi_cpp.tmp
	@echo =htview=
	@cat $(TRG)/gl_h.tmp   | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/os_h.tmp   | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/db_h.tmp   | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/sg_h.tmp   | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/ma_h.tmp   | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/hq_h.tmp   | grep -v "\#include \"*\"" >> $@
	@echo "#define main dummy" | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/hq_cpp.tmp | grep -v "\#include \"*\"" >> $@
	@echo "#undef main"    | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/os_cpp.tmp | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/gl_cpp.tmp | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/db_cpp.tmp | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/sg_cpp.tmp | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/vi_h.tmp | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/vi_cpp.tmp | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/ma_cpp.tmp | grep -v "\#include \"*\"" >> $@

$(TRG)/tcpclient_a.cpp: $(TRG)/gl_h.tmp $(TRG)/os_h.tmp \
	$(TRG)/os_cpp.tmp $(TRG)/gl_cpp.tmp $(TRG)/sg_h.tmp $(TRG)/sg_cpp.tmp
	@echo =tcpclient=
	@cat $(TRG)/gl_h.tmp   | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/os_h.tmp   | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/sg_h.tmp   | grep -v "\#include \"*\"" >> $@
	@cat sg/tcpclient.cpp | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/os_cpp.tmp | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/gl_cpp.tmp | grep -v "\#include \"*\"" >> $@
	@cat $(TRG)/sg_cpp.tmp | grep -v "\#include \"*\"" >> $@

$(TRG)/gl_h.tmp:
	@echo gl_h
	@cat $(SRC)/gl/gl_except.h > $@
	@cat $(SRC)/gl/gl_defs.h >> $@
	@cat $(SRC)/gl/gl_utils.h >> $@
	@cat $(SRC)/gl/gl_err.h >> $@
	@cat $(SRC)/gl/gl_protocol.h >> $@
	@cat $(SRC)/gl/gl_queue.h >> $@
	@cat $(SRC)/gl/gl_rnd.h >> $@
	@cat $(SRC)/gl/gl_token.h >> $@

$(TRG)/db_h.tmp:
	@echo db_h
	@cat $(SRC)/db/hq_access.h >> $@
	@cat $(SRC)/db/hq_dbcfg.h >> $@
	@cat $(SRC)/db/hq_traits.h >> $@
	@cat $(SRC)/db/hq_hash.h >> $@
	@cat $(SRC)/db/hq_record.h >> $@
	@cat $(SRC)/db/hq_dbindex.h >> $@
	@cat $(SRC)/db/hq_sl_file.h >> $@
	@cat $(SRC)/db/hq_sl_hdt.h >> $@
	@cat $(SRC)/db/hq_sl_meta.h >> $@
	@cat $(SRC)/db/hq_dbslice.h >> $@
	@cat $(SRC)/db/hq_single.h >> $@
	@cat $(SRC)/db/hq_db.h >> $@

$(TRG)/os_h.tmp:
	@echo os_h
	@cat $(SRC)/os/os_place.h >> $@
	@cat $(SRC)/os/os_sem.h >> $@
	@cat $(SRC)/os/os_block.h >> $@
	@cat $(SRC)/os/os_filesys.h >> $@
	@cat $(SRC)/os/os_ipaddr.h >> $@
	@cat $(SRC)/os/os_timer.h >> $@
	@cat $(SRC)/os/os_net.h >> $@
	@cat $(SRC)/os/os_sysinfo.h >> $@
	@cat $(SRC)/os/os_thread.h >> $@
	@cat $(SRC)/os/os_exec.h >> $@

$(TRG)/ma_h.tmp:
	@echo ma_h
	@cat $(SRC)/ma/ma_utils.h >> $@
	@cat $(SRC)/ma/ma_hash.h >> $@
	@cat $(SRC)/ma/ma_dag.h >> $@
	@cat $(SRC)/ma/ma_skc.h >> $@
	@cat $(SRC)/ma/unumber/cunum_def_4096.h >> $@
	@cat $(SRC)/ma/unumber/cunumber.h >> $@
	@cat $(SRC)/ma/unumber/unumber.h >> $@
	@cat $(SRC)/ma/ma_pkc.h >> $@
	@cat $(SRC)/ma/euclid/meuclid.h >> $@
	@cat $(SRC)/ma/euclid/meuclid.inc >> $@

$(TRG)/os_cpp.tmp:
	@echo os_cpp
	@cat $(SRC)/os/os_*.cpp >> $@
	@cat $(SRC)/os/$(PLAT)/os_*.cpp >> $@
	@cat $(SRC)/os/os_*.inc >> $@

$(TRG)/gl_cpp.tmp:
	@echo gl_cpp
	@cat $(SRC)/gl/gl_*.cpp >> $@

$(TRG)/db_cpp.tmp:
	@echo db_cpp
	@cat $(SRC)/db/hq_*.cpp >> $@

$(TRG)/ma_cpp.tmp:
	@echo ma_cpp
	@cat $(SRC)/ma/unumber/cunumber.c >> $@
#	@cat ma/euclid/meuclid.cpp >> $@
	@cat $(SRC)/ma/ma_defines.h >> $@
	@cat $(SRC)/ma/md5.h >> $@
#	@cat ma/sha1.h >> $@
	@cat $(SRC)/ma/sha2.h >> $@
	@echo "// bad rmd160 implementation (inserted from amalgam.mak)" >> $@
	@echo "// at this point cannot insert rmd160 header" >> $@
	@echo "typedef unsigned char byte;" >> $@
	@echo "typedef unsigned int dword;" >> $@
	@echo "byte *RMD(byte *message, dword length);" >> $@
#	@cat ma/whirlpool.h >> $@
	@cat $(SRC)/ma/base64.cpp >> $@
	@cat $(SRC)/ma/ma_*.cpp >> $@
	@cat $(SRC)/ma/md5.cpp >> $@
	@echo "#undef S32" >> $@
#	@cat ma/sha1.cpp >> $@
	@cat $(SRC)/ma/sha2.cpp >> $@
#	@cat ma/whirlpool.cpp >> $@
	@cat $(SRC)/ma/rmd160.h >> $@
	@cat $(SRC)/ma/rmd160.cpp >> $@

# the hack above is due to #define's in rmd160.h - very bad programming
# we get rid of this when we move to better hash implementations

$(TRG)/hq_cpp.tmp:
	@echo hq_cpp
	@cat $(SRC)/pu/hasqd.cpp >> $@
	@cat $(SRC)/pu/hq_*.cpp >> $@

$(TRG)/hq_h.tmp:
	@echo hq_h
	@cat $(SRC)/pu/hq_svtjob.h >> $@
	@cat $(SRC)/pu/hq_config.h >> $@
	@cat $(SRC)/pu/hq_gl_bin.h >> $@
	@cat $(SRC)/pu/hq_gl_ced.h >> $@
	@cat $(SRC)/pu/hq_gl_con.h >> $@
	@cat $(SRC)/pu/hq_gl_svt.h >> $@
	@cat $(SRC)/pu/hq_gl_wkr.h >> $@
	@cat $(SRC)/pu/hq_gl_key.h >> $@
	@cat $(SRC)/pu/hq_logger.h >> $@
	@cat $(SRC)/pu/hq_globalspace.h >> $@
	@cat $(SRC)/pu/hq_alarms.h >> $@
	@cat $(SRC)/pu/hq_agent.h >> $@
	@cat $(SRC)/pu/hq_automachine.h >> $@
	@cat $(SRC)/pu/hq_chiefeditor.h >> $@
	@cat $(SRC)/pu/hq_connector.h >> $@
	@cat $(SRC)/pu/hq_conflict.h >> $@
	@cat $(SRC)/pu/hq_platform.h >> $@
	@cat $(SRC)/pu/hq_plebfile.h >> $@
	@cat $(SRC)/pu/hq_wkrtask.h >> $@
	@cat $(SRC)/pu/hq_worker.h >> $@
	@cat $(SRC)/pu/hq_svttask.h >> $@
	@cat $(SRC)/pu/hq_servant.h >> $@
	@cat $(SRC)/pu/hq_secretary.h >> $@
	@cat $(SRC)/pu/hq_publisher.h >> $@
	@cat $(SRC)/pu/hq_console.h >> $@
	@cat $(SRC)/pu/hq_reorgan.h >> $@


$(TRG)/sg_cpp.tmp:
	@echo sg_cpp
	@cat $(SRC)/sg/sg_*.cpp >> $@

$(TRG)/sg_h.tmp:
	@echo sg_h
	@cat $(SRC)/sg/sg_*.h >> $@

$(TRG)/vi_h.tmp:
	@echo vi_h
	@cat vi/xy.h >> $@
	@cat vi/node.h >> $@
	@cat vi/canvas.h >> $@

$(TRG)/vi_cpp.tmp:
	@echo vi_cpp
	@cat vi/htview.cpp >> $@
	@cat vi/node.cpp >> $@
	@cat vi/canvas.cpp >> $@

clean:
	rm -rf $(TRG)
