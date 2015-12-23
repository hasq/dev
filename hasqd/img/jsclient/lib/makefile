# Hasq Technology Pty Ltd (C) 2013-2015

all: jquery.js

jquery.js: jquery-ui
	cp jquery-ui/jquery-ui.min.js ./
	cp jquery-ui/jquery-ui.min.css ./
	cp jquery-ui/external/jquery/jquery.js ./


jquery-ui:
	tar xjvf $(NAME).tar.bz2
	chmod 0777 -R $(NAME)
	mv $(NAME) jquery-ui
	rm $(NAME).tar.bz2

cleanall:
	rm -rf jquery-ui* jquery.js

clean:
	rm -rf jquery-ui
