# Hasq Technology Pty Ltd (C) 2013-2016

MYLIB=hqpulib

SRC=../
include $(SRC)mk_all.mak

O=$(TRG)

GLDIR=../gl
INC := $(INC) -I$(GLDIR)
GLLIB=$(GLDIR)/$O/htgllib$(LEXT)

OSDIR=../os
INC := $(INC) -I$(OSDIR)
OSLIB=$(OSDIR)/$O/htoslib$(LEXT)

DBDIR=../db
INC := $(INC) -I$(DBDIR)
DBLIB=$(DBDIR)/$O/htdblib$(LEXT)

MADIR=../ma
INC := $(INC) -I$(MADIR)
MALIB=$(MADIR)/$O/htmalib$(LEXT)

SGDIR=../sg
INC := $(INC) -I$(SGDIR)
SGLIB=$(SGDIR)/$O/htsglib$(LEXT)


src =   hq_conflict.cpp \
	hq_connector.cpp hq_logger.cpp hq_svttask.cpp hq_servant.cpp \
	hq_wkrtask.cpp hq_publisher.cpp hq_config.cpp hq_reorgan.cpp \
	hq_secretary.cpp hq_chiefeditor.cpp hq_automachine.cpp hq_worker.cpp \
	hq_globalspace.cpp hq_console.cpp hq_alarms.cpp hq_svtjob.cpp \
	hq_gl_bin.cpp hq_gl_ced.cpp hq_gl_con.cpp hq_gl_key.cpp \
	hq_gl_svt.cpp hq_gl_wkr.cpp hq_plebfile.cpp hq_agent.cpp \
	hq_netenv.cpp
	
obj := $(src:%.cpp=$O/%$(OEXT))

srctrg = hasqd.cpp
trg := $(srctrg:%.cpp=$O/%$(EEXT))


all: $O $(trg) $O/$(MYLIB)$(LEXT)

$O:
	mkdir -p $O

$(trg): $O/%$(EEXT):%.cpp $O/$(MYLIB)$(LEXT) $(DBLIB) $(SGLIB) $(OSLIB) $(MALIB) $(GLLIB)
	$(COMPILER) $(OPT) $(INC) $< $O/$(MYLIB)$(LEXT) $(DBLIB) $(SGLIB) $(OSLIB)  \
	$(MALIB) $(GLLIB) $(LDF) $(EOUT)$@
	@rm -f *.obj

$(obj): $O/%$(OEXT):%.cpp *.h
	$(COMPILER) -c $(OPT) $(INC) $(FLAGS) $< $(OOUT)$@

clean:
	rm -rf _bin*
	rm -rf *.obj *.pdb *.gcno *.gcov *.gcda

$O/$(MYLIB)$(LEXT): $(obj)
	$(ARCR)$O/$(MYLIB)$(LEXT) $(obj)

#	$(AR) cr $O/$(MYLIB)$(LEXT) $(obj)
#	$(RANLIB) $O/$(MYLIB)$(LEXT) 

$(GLLIB):
	cd $(GLDIR) && make PLAT=$(PLAT)

$(OSLIB):
	cd $(OSDIR) && make PLAT=$(PLAT)

$(DBLIB):
	cd $(DBDIR) && make PLAT=$(PLAT)

$(MALIB):
	cd $(MADIR) && make PLAT=$(PLAT)

$(SGLIB):
	cd $(SGDIR) && make PLAT=$(PLAT)
