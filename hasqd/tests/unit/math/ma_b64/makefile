srctrg = test.cpp

include ../../run.mak



base64: base64.cpp $(GLLIB) $(MALIB) $(OSLIB) $(DBLIB) $(SGLIB) 
	$(COMPILER) $(OPT) $(INC) $< $(SGLIB) $(DBLIB) $(OSLIB) $(MALIB) $(GLLIB) $(LDF) $(EOUT)$@

