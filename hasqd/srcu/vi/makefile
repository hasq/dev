# Hasq Technology Pty Ltd (C) 2013-2015

SRC=../../src/
include ../mk_all.mak

O=$(TRG)

GLDIR=$(SRC)/gl
INC := $(INC) -I$(GLDIR)
GLLIB=$(GLDIR)/$O/htgllib$(LEXT)

OSDIR=$(SRC)/os
INC := $(INC) -I$(OSDIR)
OSLIB=$(OSDIR)/$O/htoslib$(LEXT)

DBDIR=$(SRC)/db
INC := $(INC) -I$(DBDIR)
DBLIB=$(DBDIR)/$O/htdblib$(LEXT)

MADIR=$(SRC)/ma
INC := $(INC) -I$(MADIR)
MALIB=$(MADIR)/$O/htmalib$(LEXT)

SGDIR=$(SRC)/sg
INC := $(INC) -I$(SGDIR)
SGLIB=$(SGDIR)/$O/htsglib$(LEXT)

PUDIR=$(SRC)/pu
INC := $(INC) -I$(PUDIR)
PULIB=$(PUDIR)/$O/hqpulib$(LEXT)

src = canvas.cpp node.cpp
obj := $(src:%.cpp=$O/%$(OEXT))

srctrg = htview.cpp
trg := $(srctrg:%.cpp=$O/%$(EEXT))


all: $O $(trg) $O/htvilib$(LEXT)

$O:
	mkdir -p $O

$(trg): $O/%$(EEXT):%.cpp $O/htvilib$(LEXT) $(DBLIB) $(SGLIB) $(OSLIB) \
	$(MALIB) $(GLLIB) $(PULIB)
	$(COMPILER) $(OPT) $(INC) $< $O/htvilib$(LEXT) $(PULIB) \
	$(DBLIB) $(SGLIB) $(OSLIB) $(MALIB) $(GLLIB) \
	$(LDF) $(EOUT)$@
	rm -f *.obj

$(obj): $O/%$(OEXT):%.cpp *.h
	$(COMPILER) -c $(OPT) $(INC) $(FLAGS) $< $(OOUT)$@

clean:
	rm -rf _bin*
	rm -rf *.obj *.pdb *.gcno *.gcov *.gcda

$O/htvilib$(LEXT): $(obj)
	$(ARCR)$O/htvilib$(LEXT) $(obj)

#	$(AR) cr $O/htvilib$(LEXT) $(obj)
#	$(RANLIB) $O/htvilib$(LEXT) 

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

$(PULIB):
	cd $(PUDIR) && make PLAT=$(PLAT)
