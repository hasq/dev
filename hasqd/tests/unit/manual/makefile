# Hasq Technology Pty Ltd (C) 2013-2015

SRC=../../../src/
include $(SRC)mk_all.mak

O=$(TRG)

GLDIR=$(SRC)gl
GLLIB=$(GLDIR)/$O/htgllib$(LEXT)
MADIR=$(SRC)math
MALIB=$(MADIR)/$O/htmalib$(LEXT)
OSDIR=$(SRC)os
OSLIB=$(OSDIR)/$O/htoslib$(LEXT)
DBDIR=$(SRC)db
DBLIB=$(DBDIR)/$O/htdblib$(LEXT)
SGDIR=$(SRC)/sgl
SGLIB=$(SGDIR)/$O/htsglib$(LEXT)


INC := $(INC) -I$(GLDIR) -I$(MADIR) -I$(DBDIR)
INC := $(INC) -I$(OSDIR) -I$(SGDIR)

srctrg = testmem.cpp testnet.cpp testsem.cpp testmut.cpp \
	websrv.cpp udpclient.cpp udpserver.cpp

trg := $(srctrg:%.cpp=$O/%$(EEXT))


all: $O $(trg)

$O:
	mkdir -p $O

$(trg): $O/%$(EEXT):%.cpp  $(SGLIB) $(OSLIB) $(GLLIB) $(MALIB)
	$(COMPILER) $(OPT) $(INC) $< $(SGLIB) $(OSLIB) $(MALIB) \
	$(GLLIB) $(LDF) $(EOUT)$@
	@rm -f *.obj

clean:
	rm -rf _bin*
	rm -rf *.obj *.pdb *.gcno *.gcov *.gcda

