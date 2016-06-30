# Hasq Technology Pty Ltd (C) 2013-2016

MYLIB=htmalib

SRC=../
include $(SRC)mk_all.mak

O=$(TRG)

GLDIR=../gl
INC := $(INC) -I$(GLDIR)
GLLIB=$(GLDIR)/$O/htgllib$(LEXT)

src = md5.cpp sha2.cpp rmd160.cpp \
	ma_hash.cpp ma_dag.cpp ma_skc.cpp ma_utils.cpp base64.cpp ma_pkc.cpp \
	ma_invert.cpp

obj := $(src:%.cpp=$O/%$(OEXT))

##srctrg = testnum.cpp testreo.cpp
##srctrg = testnum.cpp
srctrg =
trg := $(srctrg:%.cpp=$O/%$(EEXT))

#csrc = cunmber_2048.c cunmber_128.c cunmber_4096.c
csrc = cunmber_4096.c

cobj := $(csrc:%.c=$O/%$(OEXT))


all: $O $(trg) $O/$(MYLIB)$(LEXT)

$O:
	mkdir -p $O

$(trg): $O/%$(EEXT):%.cpp $O/$(MYLIB)$(LEXT) $(GLLIB)
	$(COMPILER) $(OPT) $(INC) $< $O/$(MYLIB)$(LEXT) $(GLLIB) $(LDF) $(EOUT)$@

$(obj): $O/%$(OEXT):%.cpp *.h
	$(COMPILER) -c $(OPT) $(INC) $(FLAGS) $< $(OOUT)$@

$(cobj): $O/%$(OEXT):%.c unumber/*.h
	$(COMPILERC) -c $(OPTC) $(INC) $(FLAGS) $< $(OOUT)$@

clean:
	rm -rf _bin*
	rm -rf *.obj *.pdb *.gcno *.gcov *.gcda

$O/$(MYLIB)$(LEXT): $(obj) $(cobj)
	$(ARCR)$O/$(MYLIB)$(LEXT) $(obj) $(cobj)

#	$(AR) cr $O/$(MYLIB)$(LEXT) $(obj)
#	$(RANLIB) $O/$(MYLIB)$(LEXT) 

$(GLLIB):
	cd $(GLDIR) && make PLAT=$(PLAT)
