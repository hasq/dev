#!/bin/bash

STARTDIR="$(pwd)"
TCDIR=""
SRCDIR=""
WF="additional"
WS="worksrc"
JQFILENAME=""

# 2015.12.28 - BEGIN: recursive search of TC folder

findinc() {
# $1 - this folder will be scanned
# $2 - this folder has been scanned previously and will be skipped
	for i in "$1"/*; do
		if [ -d "$i" -a ! -L "$i" -a "$i" != "$2" ]
		then
			if [ -d "$i/iso" -a -d "$i/tcz" ]
			then 
				TCDIR="$i"
				return
			else
				findinc "$i"
			fi
		fi
	done
}

finddec() {
	findinc "$1" "$2"
	if [ -z "$TCDIR" ]
	then
		local PARENTDIR="$(dirname "$1")"
		finddec "$PARENTDIR" "$1"
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
	makeexport "ext/jq/$JQFILENAME" "${1}/ext/jq/$JQFILENAME"
# TODO: find ":" in rev num
	grep "M" "$VERFILE" && echo ">> revision: $(cat "$VERFILE")"
}

delfolder "$WF"


finddec "$STARTDIR"
[ -z "$TCDIR" ] && error "TinyCore folder not found"

echo "> exporting $WF"
makeexport "$TCDIR"/tcz "$WF" > /dev/null || svnerror
cp "$TCDIR"/iso/* "${WF}/"

[ -d ".." -a -d "../src" -a -d "../srcu" -a -d "../ext/jq" ] && SRCDIR=".."
[ -z "$SRCDIR" ] && error "Source folder incorrect. Run this script from the proper folder."
JQFILENAME="$(basename $(find ../ext/jq/ -name jquery-ui-*.bz2))"
cd "$SRCDIR" || exit
delfolder "$WS"

TARGETDIR="${STARTDIR}/${WF}/${WS}"

[ -d "$TARGETDIR" ] || mkdir -p "$TARGETDIR"

exportsvn "$TARGETDIR"

cd "$STARTDIR"
[ -d "$WF" -a -d "${WF}/$WS" ] || exit
which genisoimage > /dev/null 2>&1 || error "! please install genisoimage"
[ -f "${WF}.iso" ] && rm "${WF}.iso"
echo "> making iso"
genisoimage -J -D -o "${WF}.iso" "$WF" > /dev/null 2>&1
[ $? -eq 0 -a -f "${WF}.iso" ] && echo ">> OK!"
delfolder "$WF"
