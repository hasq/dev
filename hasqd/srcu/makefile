# Hasq Technology Pty Ltd (C) 2013-2015

# PLAT: msc win unx

include mk_all.mak

DB=../src/db
GL=../src/gl
MA=../src/ma
OS=../src/os
PU=../src/pu
SG=../src/sg

all: $(TRG) \
	../src/$(TRG)/zdb$(EEXT) \
	../src/$(TRG)/tcpclient$(EEXT) \
	../src/$(TRG)/htview$(EEXT)

$(TRG):
	@echo "Usage: make PLAT={msc,unx} [MEMORY=1] [GCOV=1]"
	@mkdir -p ../src/$(TRG)

../src/$(TRG)/hasqd$(EEXT): $(PU)/$(TRG)/hasqd$(EEXT)
	cp $< $@

$(PU)/$(TRG)/hasqd$(EEXT): $(PU)/*.cpp $(PU)/*.h $(OS)/*.cpp $(OS)/*.h $(GL)/*.cpp $(GL)/*.h $(OS)/*/*.cpp
	cd $(PU) && make PLAT=$(PLAT)


../src/$(TRG)/htview$(EEXT): vi/$(TRG)/htview$(EEXT)
	cp $< $@

vi/$(TRG)/htview$(EEXT): $(PU)/*.cpp $(PU)/*.h $(OS)/*.cpp \
	$(OS)/*.h $(GL)/*.cpp $(GL)/*.h $(OS)/*/*.cpp vi/*.cpp vi/*.h
	cd vi && make PLAT=$(PLAT)


../src/$(TRG)/zdb$(EEXT): db/$(TRG)/zdb$(EEXT)
	cp $< $@
	chmod 0777 $@

db/$(TRG)/zdb$(EEXT): $(DB)/*.cpp $(DB)/*.h $(OS)/*.cpp $(OS)/*.h $(GL)/*.cpp $(GL)/*.h $(OS)/*/*.cpp
	cd db && make PLAT=$(PLAT)

../src/$(TRG)/tcpclient$(EEXT): sg/$(TRG)/tcpclient$(EEXT)
	cp $< $@

sg/$(TRG)/tcpclient$(EEXT): $(SG)/*.cpp $(SG)/*.h $(OS)/*.cpp $(OS)/*.h $(GL)/*.cpp $(GL)/*.h $(OS)/*/*.cpp
	cd sg && make PLAT=$(PLAT)



clean:
	rm -rf _bin* */_bin* */*.obj
	rm -rf */*/_bin* */*/*.obj
	rm -rf os/_*.*.cpp
	rm -rf _exported
	cd db && make clean
	cd sg && make clean
	cd vi && make clean

#	breaks ongoing test build
#	cd ../src && make clean

