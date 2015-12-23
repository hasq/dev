# Hasq Technology Pty Ltd (C) 2013-2015

MYLIB=htdblib

SRC=../
include $(SRC)mk_all.mak

O=$(TRG)

GLDIR=../gl
INC := $(INC) -I$(GLDIR)
GLLIB=$(GLDIR)/$O/htgllib$(LEXT)

OSDIR=../os
INC := $(INC) -I$(OSDIR)
OSLIB=$(OSDIR)/$O/htoslib$(LEXT)

MADIR=../ma
INC := $(INC) -I$(MADIR)
MALIB=$(MADIR)/$O/htmalib$(LEXT)


src = hq_sl_hdt.cpp hq_sl_meta.cpp hq_sl_file.cpp hq_dbslice.cpp hq_dbindex.cpp \
	hq_db.cpp hq_hash.cpp hq_record.cpp hq_single.cpp hq_traits.cpp
obj := $(src:%.cpp=$O/%$(OEXT))

srctrg = 
trg := $(srctrg:%.cpp=$O/%$(EEXT))


all: $O $(trg) $O/$(MYLIB)$(LEXT)

$O:
	mkdir -p $O

$(trg): $O/%$(EEXT):%.cpp $O/$(MYLIB)$(LEXT) $(OSLIB) $(GLLIB) $(MALIB)
	$(COMPILER) $(OPT) $(INC) $< $O/$(MYLIB)$(LEXT) $(OSLIB) $(MALIB) \
	$(GLLIB) $(LDF) $(EOUT)$@
	@rm -f *.obj

$(obj): $O/%$(OEXT):%.cpp *.h *.inc
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

$(MALIB):
	cd $(MADIR) && make PLAT=$(PLAT)
