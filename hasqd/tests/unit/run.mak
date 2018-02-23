
SRC=../../../../src/
include $(SRC)mk_all.mak

O=$(TRG)

GLDIR=$(SRC)gl
GLLIB=$(GLDIR)/$O/htgllib$(LEXT)
MADIR=$(SRC)ma
MALIB=$(MADIR)/$O/htmalib$(LEXT)
OSDIR=$(SRC)os
OSLIB=$(OSDIR)/$O/htoslib$(LEXT)
DBDIR=$(SRC)db
DBLIB=$(DBDIR)/$O/htdblib$(LEXT)
SGDIR=$(SRC)sg
SGLIB=$(SGDIR)/$O/htsglib$(LEXT)
PUDIR=$(SRC)pu
PULIB=$(PUDIR)/$O/hqpulib$(LEXT)


INC := $(INC) -I$(GLDIR) -I$(MADIR) -I$(DBDIR)
INC := $(INC) -I$(OSDIR) -I$(SGDIR) -I$(PUDIR)

src = 
obj := $(src:%.cpp=$O/%$(OEXT))

trg := $(srctrg:%.cpp=$O/%$(EEXT))

all: $O $(trg) ok

build: $O $(trg)

$O:
	mkdir -p $O

$(trg): $O/%$(EEXT):%.cpp $(GLLIB) $(MALIB) $(OSLIB) $(DBLIB) $(SGLIB) $(obj)
	$(COMPILER) $(OPT) $(INC) $< $(PULIB) $(SGLIB) $(DBLIB) $(OSLIB) \
	$(MALIB) $(GLLIB) $(LDF) $(EOUT)$@
	$@

$(obj): $O/%$(OEXT):%.cpp *.h
	$(COMPILER) -c $(OPT) $(INC) $(FLAGS) $< $(OOUT)$@

ok:
	rm -rf _bin*
	rm -rf *.obj *.pdb *.gcno *.gcov *.gcda

build: $O $(trg)



