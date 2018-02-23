# Hasq Technology Pty Ltd (C) 2013-2016

MYLIB=htoslib

SRC=../
include $(SRC)mk_all.mak

O=$(TRG)

GLDIR=../gl
INC := $(INC) -I$(GLDIR)
GLLIB=$(GLDIR)/$O/htgllib$(LEXT)


psrc = os_net2.cpp os_ipaddr.cpp os_thread.cpp os_sem.cpp os_timer2.cpp \
	os_file2.cpp os_sysinfo.cpp os_exec.cpp
dsrc = $(psrc:%=_$(PLAT).%)
pobj := $(dsrc:%.cpp=$O/%$(OEXT))

src = os_net.cpp os_block.cpp os_place.cpp os_ipaddrc.cpp \
	os_threadc.cpp os_filesys.cpp
obj := $(src:%.cpp=$O/%$(OEXT))

all: $O $O/$(MYLIB)$(LEXT)

$O:
	mkdir -p $O

$(obj): $O/%$(OEXT):%.cpp *.h
	$(COMPILER) -c $(OPT) $(INC) $(FLAGS) $< $(OOUT)$@

$(pobj): $O/%$(OEXT):%.cpp *.h *.inc
	$(COMPILER) -c $(OPT) $(INC) $(FLAGS) $< $(OOUT)$@

$(dsrc): _$(PLAT).%:$(PLAT)/% *.h
	cp $< $@
	chmod 0777 $@

clean:
	rm -rf _bin*
	rm -rf *.obj *.pdb *.gcno *.gcov *.gcda
	rm -rf $(PLAT).*.cpp
	rm -rf _*.*.cpp

$O/$(MYLIB)$(LEXT): $(obj) $(pobj)
	$(ARCR)$O/$(MYLIB)$(LEXT) $(obj) $(pobj)

#	$(AR) cr $O/$(MYLIB)$(LEXT) $(obj) $(pobj)
#	$(RANLIB) $O/$(MYLIB)$(LEXT) 

$(GLLIB):
	cd $(GLDIR) && make PLAT=$(PLAT)

