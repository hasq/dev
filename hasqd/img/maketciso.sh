#!/bin/bash

MYDIR="$(pwd)"
WF="additional"
WS="worksrc"

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
# TODO: find ":" in rev num
	grep "M" "$VERFILE" && echo ">> revision: $(cat "$VERFILE")"
	makeexport third "${1}/third"
}

delfolder "$WF"
[ -d "6.x/tcz" ] || exit
delfolder "$WF"
echo "> exporting $WF"
makeexport 6.x/tcz "$WF" > /dev/null || svnerror
cp 6.x/iso/* "${WF}/"
SRCDIR=""
[ -d "../../dev/hasqd" ] && SRCDIR="../../dev/hasqd"
[ -z "$SRCDIR" -a -d "../../hasqd" ] && SRCDIR="../../hasqd"
[ -z "$SRCDIR" -a -d "../dev/hasqd" ] && SRCDIR="../dev/hasqd"
[ -z "$SRCDIR" -a -d "../hasqd" ] && SRCDIR="../hasqd"
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
