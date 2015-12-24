#!/bin/bash

MYDIR="$(pwd)"
WF="additional"
WS="worksrc"
JQFILENAME="$(basename $(find ../ext/jq/ -name jquery-ui-*.bz2))"

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
TCDIR=""
[ -d "../ext/tc" ] && TCDIR="../ext/tc"
[ -z "$TCDIR" ] && error "no TiniCore folder found"
delfolder "$WF"
echo "> exporting $WF"
makeexport "$TCDIR"/tcz "$WF" > /dev/null || svnerror
cp "$TCDIR"/iso/* "${WF}/"
SRCDIR=""
[ -d ".." ] && SRCDIR=".."
# [ -z "$SRCDIR" -a -d "../../hasqd" ] && SRCDIR="../../hasqd"
# [ -z "$SRCDIR" -a -d "../dev/hasqd" ] && SRCDIR="../dev/hasqd"
# [ -z "$SRCDIR" -a -d "../hasqd" ] && SRCDIR="../hasqd"
[ -z "$SRCDIR" ] && error "no SRC folder found"
cd "$SRCDIR" || exit
delfolder "$WS"

TARGETDIR="${MYDIR}/${WF}/${WS}"

[ -d "$TARGETDIR" ] || mkdir -p "$TARGETDIR"

exportsvn "$TARGETDIR"

cd "$MYDIR"
[ -d "$WF" -a -d "${WF}/$WS" ] || exit
which genisoimage > /dev/null 2>&1 || error "! please install genisoimage"
[ -f "${WF}.iso" ] && rm "${WF}.iso"
echo "> making iso"
genisoimage -J -D -o "${WF}.iso" "$WF" > /dev/null 2>&1
[ $? -eq 0 -a -f "${WF}.iso" ] && echo ">> OK!"
delfolder "$WF"
