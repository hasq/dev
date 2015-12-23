# Hasq Technology Pty Ltd (C) 2013-2015

MYLIB=htsglib

SRC=../
include $(SRC)mk_all.mak

O=$(TRG)

GLDIR=../gl
INC := $(INC) -I$(GLDIR)
GLLIB=$(GLDIR)/$O/htgllib$(LEXT)

OSDIR=../os
INC := $(INC) -I$(OSDIR)
OSLIB=$(OSDIR)/$O/htoslib$(LEXT)


src = sg_mem.cpp sg_testing.cpp sg_client.cpp sg_cout.cpp
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

$(MALIB):
	cd $(MADIR) && make PLAT=$(PLAT)
