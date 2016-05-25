#!/bin/bash

counter=0
startdir="$(pwd)"
tcdir=""
srcdir=""
temp="additional"
worksrc="worksrc"
jqfile=""

if [[ -z $1 || $1 == "7" ]]
then
	ver="7"
elif [ $1 == "6" ]
then
	ver="6"
else
	echo "Unknown parameter "$1""
	exit
fi

# 2015.12.28 - BEGIN: recursive search of TC folder

findinc() {
# $1 - this folder will be scanned
# $2 - this folder has been scanned previously and will be skipped
	local tcdir=""
	for i in "$1"/*; do
		if [ -d "$i" -a ! -L "$i" -a "$i" != "$2" ]
		then
			if [ -d "$i/$ver.x/iso" -a -d "$i/$ver.x/tcz" ]
			then 
				tcdir="$i/$ver.x"
				echo "$tcdir"
			else
				findinc "$i"
			fi
		fi
	done
}

finddec() {
	local tcdir=$(findinc "$1" "$2")
	let "counter = counter + 1"
	
	[ "$counter" -eq 8 ] && exit 1
	
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
	[ $# -ge 2 ] || return
	[ -z "$3" ] && echo "> exporting $1" || echo "> exporting $3"
	[ -z "$(svn status "$1" | grep "^M")" ] || echo ">> uncommited files exists!"
	svn export "$1" "$2" > /dev/null || svnerror
}

exportsvn() {
	VERFILE="${1}/img/root/hasq/build.txt"
	[ -z "$1" ] && return
	makeexport src "${1}/src" "src folder"
	makeexport srcu "${1}/srcu" "srcu folder"
	makeexport img "${1}/img" "img folder"
	svnversion > "$VERFILE"
	mkdir -p "${1}/ext/jq"
	makeexport "ext/jq/$jqfile" "${1}/ext/jq/$jqfile" "external libraries"
# TODO: find ":" in rev num
	grep "M" "$VERFILE" && echo ">> revision: $(cat "$VERFILE")"
}

delfolder "$temp"

echo "> searching for TinyCore folder..."

tcdir=$(finddec "$startdir")

[ -z "$tcdir" ] && error "TinyCore folder not found!"
[ -z "$(svn status "$tcdir/iso" 2>&1 | grep "was not found.")" -a -z "$(svn status "$tcdir/tcz" 2>&1 | grep "was not found.")" ] || error ">>$tcdir is not a working copy of TinyCore."
[ -z "$(svn status "$tcdir" | grep "^M")" ] || error ">>$tcdir - folder have uncommited changes, please commit it before."
[ -z "$(svn status "$tcdir" | grep "^!")" ] || error ">>$tcdir - folder have missing files, please update it before."

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
