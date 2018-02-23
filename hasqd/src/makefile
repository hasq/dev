# Hasq Technology Pty Ltd (C) 2013-2016

# PLAT: msc unx

include mk_all.mak

DB=db
GL=gl
MA=ma
OS=os
PU=pu
SG=sg
VI=vi

all: $(TRG) \
	$(TRG)/hasqd$(EEXT) \

$(TRG):
	@echo "Usage: make PLAT={msc,unx} [MEMORY=1] [GCOV=1]"
	@mkdir -p $(TRG)

$(TRG)/hasqd$(EEXT): $(PU)/$(TRG)/hasqd$(EEXT)
	cp $< $@

$(PU)/$(TRG)/hasqd$(EEXT): $(PU)/*.cpp $(PU)/*.h $(OS)/*.cpp $(OS)/*.h $(GL)/*.cpp $(GL)/*.h $(OS)/*/*.cpp
	cd $(PU) && make PLAT=$(PLAT)


$(TRG)/htview$(EEXT): $(VI)/$(TRG)/htview$(EEXT)
	cp $< $@

$(VI)/$(TRG)/htview$(EEXT): $(PU)/*.cpp $(PU)/*.h $(OS)/*.cpp \
	$(OS)/*.h $(GL)/*.cpp $(GL)/*.h $(OS)/*/*.cpp $(VI)/*.cpp $(VI)/*.h
	cd $(VI) && make PLAT=$(PLAT)


$(TRG)/zdb$(EEXT): db/$(TRG)/zdb$(EEXT)
	cp $< $@
	chmod 0777 $@

$(DB)/$(TRG)/zdb$(EEXT): $(DB)/*.cpp $(DB)/*.h $(OS)/*.cpp $(OS)/*.h $(GL)/*.cpp $(GL)/*.h $(OS)/*/*.cpp
	cd $(DB) && make PLAT=$(PLAT)


$(TRG)/tcpclient$(EEXT): $(SG)/$(TRG)/tcpclient$(EEXT)
	cp $< $@

$(SG)/$(TRG)/tcpclient$(EEXT): $(SG)/*.cpp $(SG)/*.h $(OS)/*.cpp $(OS)/*.h $(GL)/*.cpp $(GL)/*.h $(OS)/*/*.cpp
	cd $(SG) && make PLAT=$(PLAT)



clean:
	rm -rf _bin* */_bin* */*.obj
	rm -rf */*/_bin* */*/*.obj
	rm -rf os/_*.*.cpp
	rm -rf _exported
	cd $(DB) && make clean
	cd $(GL) && make clean
	cd $(SG) && make clean
	cd $(OS) && make clean
	cd $(PU) && make clean
	cd $(MA) && make clean

install:
	mkdir -p ~/bin
	cp _bin_$(PLAT)/* ~/bin/
