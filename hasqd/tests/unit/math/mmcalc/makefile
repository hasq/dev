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


INC := $(INC) -I$(GLDIR) -I$(MADIR) -I$(DBDIR)
INC := $(INC) -I$(OSDIR) -I$(SGDIR)

src = prho.cpp
srctrg = mmcalc.cpp

obj := $(src:%.cpp=$O/%$(OEXT))

trg := $(srctrg:%.cpp=$O/%$(EEXT))

all: $O $(trg)

build: $O $(trg)

$O:
	mkdir -p $O

$(trg): $O/%$(EEXT):%.cpp $(GLLIB) $(MALIB) $(OSLIB) $(DBLIB) $(SGLIB) $(obj)
	$(COMPILER) $(OPT) $(INC) $< $(obj) $(SGLIB) $(DBLIB) $(OSLIB) $(MALIB) \
	$(GLLIB) $(LDF) $(EOUT)$@

$(obj): $O/%$(OEXT):%.cpp
	$(COMPILER) -c $(OPT) $(INC) $(FLAGS) $< $(OOUT)$@

clean:
	rm -rf _bin*
	rm -rf *.obj *.pdb *.gcno *.gcov *.gcda


