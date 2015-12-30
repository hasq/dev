#!/bin/bash

startdir="$(pwd)"
tcdir=""
srcdir=""
temp="additional"
worksrc="worksrc"
jqfile=""

# 2015.12.28 - BEGIN: recursive search of TC folder

findinc() {
# $1 - this folder will be scanned
# $2 - this folder has been scanned previously and will be skipped
	local tcdir=""
	for i in "$1"/*; do
		if [ -d "$i" -a ! -L "$i" -a "$i" != "$2" ]
		then
			if [ -d "$i/iso" -a -d "$i/tcz" ]
			then 
				tcdir="$i"
				echo "$tcdir"
			else
				findinc "$i"
			fi
		fi
	done
}

finddec() {
	local tcdir=$(findinc "$1" "$2")
	if [ -z "$tcdir" ]
	then
		local parentdir="$(dirname "$1")"
		finddec "$parentdir" "$1"
	else
		echo "$tcdir"
	fi
}

# 2015.12.28 - END: recursive search of TC folder

error() {
	[ -z "$1" ] || echo "$1"
	exit 1
}

svnerror() {
	error "SVN exporting error!"
}

delfolder() {
	[ -z "$1" ] && return
	if [ -d "$1" ]
	then
		echo "> removing $1"
		rm -rf "$1"
	fi
}

makeexport() {
	[ $# -eq 2 ] || return
	echo "> exporting $1"
	[ -z "$(svn status "$1" | grep "^M")" ] || echo ">> uncommited files exists!"
	svn export "$1" "$2" > /dev/null || svnerror
}

exportsvn() {
	VERFILE="${1}/img/root/hasq/build.txt"
	[ -z "$1" ] && return
	makeexport src "${1}/src"
	makeexport srcu "${1}/srcu"
	makeexport img "${1}/img"
	svnversion > "$VERFILE"
	mkdir -p "${1}/ext/jq"
	makeexport "ext/jq/$jqfile" "${1}/ext/jq/$jqfile"
# TODO: find ":" in rev num
	grep "M" "$VERFILE" && echo ">> revision: $(cat "$VERFILE")"
}

delfolder "$temp"

tcdir=$(finddec "$startdir")
echo ">searching for TinyCore folder..."
[ -z "$tcdir" ] && error "TinyCore folder not found or corrupt!"
[ -z "$(svn status "$tcdir" 2>&1 | grep "was not found.")" ] || error "$tcdir - is not a working copy of TinyCore."
[ -z "$(svn status "$tcdir" | grep "^!")" -a -z "$(svn status "$tcdir" | grep "^M")" ] || error "$tcdir have changes, please update it."

echo "> exporting $temp"
makeexport "$tcdir"/tcz "$temp" > /dev/null || svnerror
cp "$tcdir"/iso/* "${temp}/"

[ -d ".." -a -d "../src" -a -d "../srcu" -a -d "../ext/jq" ] && srcdir=".."
[ -z "$srcdir" ] && error "Source folder incorrect. Run this script from the proper folder."
jqfile="$(basename $(find ../ext/jq/ -name jquery-ui-*.bz2))"
cd "$srcdir" || exit
delfolder "$worksrc"

TARGETDIR="${startdir}/${temp}/${worksrc}"

[ -d "$TARGETDIR" ] || mkdir -p "$TARGETDIR"

exportsvn "$TARGETDIR"

cd "$startdir"
[ -d "$temp" -a -d "${temp}/$worksrc" ] || exit
which genisoimage > /dev/null 2>&1 || error "! please install genisoimage"
[ -f "${temp}.iso" ] && rm "${temp}.iso"
echo "> making iso"
genisoimage -J -D -o "${temp}.iso" "$temp" > /dev/null 2>&1
[ $? -eq 0 -a -f "${temp}.iso" ] && echo ">> OK!"
delfolder "$temp"
