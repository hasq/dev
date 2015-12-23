# Hasq Technology Pty Ltd (C) 2013-2015

MYLIB=htgllib

SRC=../
include $(SRC)mk_all.mak

O=$(TRG)

src = gl_protocol.cpp gl_utils.cpp gl_except.cpp gl_err.cpp gl_token.cpp gl_rnd.cpp
obj := $(src:%.cpp=$O/%$(OEXT))

srctrg =
trg := $(srctrg:%.cpp=$O/%$(EEXT))


all: $O $(trg) $O/$(MYLIB)$(LEXT)

$O:
	mkdir -p $O

$(trg): $O/%$(EEXT):%.cpp $O/$(MYLIB)$(LEXT)
	$(COMPILER) $(OPT) $(INC) $< $O/$(MYLIB)$(LEXT) $(LDF) $(EOUT)$@

$(obj): $O/%$(OEXT):%.cpp *.h
	$(COMPILER) -c $(OPT) $(INC) $(FLAGS) $< $(OOUT)$@

clean:
	rm -rf _bin*
	rm -rf *.obj *.pdb *.gcno *.gcov *.gcda

$O/$(MYLIB)$(LEXT): $(obj)
	$(ARCR)$O/$(MYLIB)$(LEXT) $(obj)

#	$(RANLIB) $O/$(MYLIB)$(LEXT) 


