#!/bin/sh

# lets make it a script
#Pri kopirovanii novogo jquery nuzhno ego perezhatj:

#tar xjvf jquery*.tar.bz2
#tar cjvf jquery_folder jquery*.tar.bz2

#Eto ispravit prava dostupa v arhive

JQUERY=jquery-ui-1.11.0.custom

[ -f "${JQUERY}.tar.bz2" ] || exit
tar xjf "${JQUERY}.tar.bz2" || exit
[ -d "${JQUERY}" ] || exit
chmod -R 777 "${JQUERY}"
mv "${JQUERY}.tar.bz2" "${JQUERY}.tar.bz2.old"
tar cjf "${JQUERY}.tar.bz2" "${JQUERY}" && rm -rf "${JQUERY}"

