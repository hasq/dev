# Hasq Technology Pty Ltd (C) 2013-2016

ifeq ($(OS),Windows_NT)
PLAT=msc
else
PLAT=unx
endif

BINR=$(PLAT)
TRG=_bin_$(BINR)

include $(SRC)mk_$(PLAT).mak

ifdef MEMORY
OPT+= -DTEST_MEMORY=1
endif
