# Hasq Technology Pty Ltd (C) 2013-2015

SRC=../../src/
include ../mk_all.mak

O=$(TRG)

DBDIR=$(SRC)/db
INC := $(INC) -I$(DBDIR)
DBLIB=$(DBDIR)/$O/htdblib$(LEXT)

GLDIR=$(SRC)/gl
INC := $(INC) -I$(GLDIR)
GLLIB=$(GLDIR)/$O/htgllib$(LEXT)

OSDIR=$(SRC)/os
INC := $(INC) -I$(OSDIR)
OSLIB=$(OSDIR)/$O/htoslib$(LEXT)

MADIR=$(SRC)/ma
INC := $(INC) -I$(MADIR)
MALIB=$(MADIR)/$O/htmalib$(LEXT)


src = 
#hq_sl_hdt.cpp hq_sl_meta.cpp hq_sl_file.cpp hq_dbslice.cpp hq_dbindex.cpp hq_db.cpp hq_hash.cpp hq_record.cpp hq_single.cpp hq_traits.cpp
obj := $(src:%.cpp=$O/%$(OEXT))

srctrg = zdb.cpp
trg := $(srctrg:%.cpp=$O/%$(EEXT))


all: $O $(trg)

$O:
	mkdir -p $O

$(trg): $O/%$(EEXT):%.cpp $(DBLIB) $(OSLIB) $(GLLIB) $(MALIB)
	$(COMPILER) $(OPT) $(INC) $< $(DBLIB) $(OSLIB) $(MALIB) \
	$(GLLIB) $(LDF) $(EOUT)$@
	@rm -f *.obj

$(obj): $O/%$(OEXT):%.cpp *.h *.inc
	$(COMPILER) -c $(OPT) $(INC) $(FLAGS) $< $(OOUT)$@

clean:
	rm -rf _bin*
	rm -rf *.obj *.pdb *.gcno *.gcov *.gcda

#	$(AR) cr $O/$(MYLIB)$(LEXT) $(obj)
#	$(RANLIB) $O/$(MYLIB)$(LEXT) 

$(DBLIB):
	cd $(DBDIR) && make PLAT=$(PLAT)

$(GLLIB):
	cd $(GLDIR) && make PLAT=$(PLAT)

$(OSLIB):
	cd $(OSDIR) && make PLAT=$(PLAT)

$(MALIB):
	cd $(MADIR) && make PLAT=$(PLAT)
