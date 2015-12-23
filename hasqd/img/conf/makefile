# Hasq Technology Pty Ltd (C) 2013-2015

SRCM=../../src/
SRC=./
include $(SRCM)mk_all.mak

O=$(TRG)

ifeq ($(PLAT),tcu)
OLB=_bin_unx
else
OLB=$O
endif


# libraries

GLDIR=$(SRCM)/gl
INC := $(INC) -I$(GLDIR)
GLLIB=$(GLDIR)/$(OLB)/htgllib$(LEXT)

OSDIR=$(SRCM)/os
INC := $(INC) -I$(OSDIR)
OSLIB=$(OSDIR)/$(OLB)/htoslib$(LEXT)

DBDIR=$(SRCM)/db
INC := $(INC) -I$(DBDIR)
DBLIB=$(DBDIR)/$(OLB)/htdblib$(LEXT)

MADIR=$(SRCM)/ma
INC := $(INC) -I$(MADIR)
MALIB=$(MADIR)/$(OLB)/htmalib$(LEXT)

ROOT=sim_root
TMP=$(ROOT)/tmp
ETC=$(ROOT)/etc
HD=$(ROOT)/mnt/sda1
CD=$(ROOT)/hasq



src = hqconf.cpp bootut.cpp quest.cpp
obj := $(src:%.cpp=$O/%$(OEXT))

srctrg = booter.cpp patcher.cpp
trg := $(srctrg:%.cpp=$O/%$(EEXT))

psrc = osfun.cpp hdmnt.cpp
dsrc = $(psrc:%=_$(PLAT).%)
pobj := $(dsrc:%.cpp=$O/%$(OEXT))


all: $O $(trg)

$O:
	mkdir -p $O

$(trg): $O/%$(EEXT):%.cpp $(obj) $(pobj) $(OSLIB) $(GLLIB) $(DBLIB) $(MALIB)
	$(COMPILER) $(OPT) $(INC) $< $(obj) $(pobj) \
	$(DBLIB) $(MALIB) $(OSLIB) $(GLLIB) $(LDF) $(EOUT)$@
	@rm -f *.obj

$(obj): $O/%$(OEXT):%.cpp *.h *.inc
	$(COMPILER) -c $(OPT) $(INC) $(FLAGS) $< $(OOUT)$@

$(pobj): $O/%$(OEXT):%.cpp *.h *.inc
	$(COMPILER) -c $(OPT) $(INC) $(FLAGS) $< $(OOUT)$@

$(dsrc): _$(PLAT).%:$(PLAT)/% *.h *.inc
	cp $< $@
	chmod 0777 $@


clean:
	rm -rf _bin*
	rm -rf *.obj *.pdb *.gcno *.gcov *.gcda
	rm -rf _*.*.cpp
	rm -rf $(HD)/*
	rm -rf $(ETC)/* $(TMP)/*
	rm -rf $(CD)/*.obj $(CD)/hasqd $(CD)/*.exe $(CD)/*.conf


conf: $(CD)/booter$(EEXT)
	cp hasqd.conf $(CD)

#	cp hasqd.conf $(HD)

$(CD)/booter$(EEXT): $O/booter$(EEXT)
	cp $< $(CD)/

$(OSLIB):
	cd $(OSDIR) && make PLAT=$(PLAT)

$(GLLIB):
	cd $(GLDIR) && make PLAT=$(PLAT)

$(DBLIB):
	cd $(DBDIR) && make PLAT=$(PLAT)

$(MALIB):
	cd $(MADIR) && make PLAT=$(PLAT)
