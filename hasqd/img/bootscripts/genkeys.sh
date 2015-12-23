#!/bin/sh
#.
# Script generiruet kluchi SSL dlya NGINX (used as hasq proxy)
# Otrabativaet pri kazhdom zapuske TC
#.
#origconf="/usr/local/etc/ssl/openssl.cnf"
origsslconf="/usr/local/etc/ssl"
#needconf="/usr/local/ssl/openssl.cnf"
needsslconf="/usr/local/ssl"

keybits="1024"
keydays="365"
keycountry="AU"
keystate="ExampleState"
keyorg="HASQ Company"

error() {
	[ -z "$1" ] && exit
	echo "$1"
	exit
}

[ -d "$needsslconf" ] \
	|| [ -d "$origsslconf" ] \
	&& ln -s "$origsslconf" "$needsslconf"

openssl genrsa \
	-out hasq.key $keybits \
	|| error "Cant generate keyfile"

openssl req \
	-new \
	-x509 \
	-days $keydays \
	-subj "/C=${keycountry}/ST=${keystate}/O=${keyorg}" \
	-key hasq.key \
	-out hasq.crt \
	|| error "Cant generate certificate"

[ -d "/opt/nginx" ] \
	|| mkdir "/opt/nginx" \
	|| error "Cant create opt nginx dir"

mv hasq.key hasq.crt /opt/nginx/ \
	|| error "Cant move generatedd keys"

chmod 400 /opt/nginx/hasq.key
