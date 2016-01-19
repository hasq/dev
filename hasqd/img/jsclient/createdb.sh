#!/bin/bash

srcdir=""
bindir=""
srcname="src"
zdbname=""
hasqdname=""
fullpath=""
plat=""

uname | grep -i "CYGWIN" >/dev/null 2>&1 && plat="Windows" || plat="Linux"

if [ "$plat" = "Windows" ] 
then 
	binname="_bin_msc"
	zdbname="zdb.exe"
	hasqdname="hasqd.exe"
else
	binname="_bin_unx"
	zdbname="zdb"
	hasqdname="hasqd"
fi

error() {
	[ -z "$1" ] || echo "$1"
	exit 1
}

findinc() {
# $1 - this folder will be scanned
# $2 - this folder has been scanned previously and will be skipped
	local fldr=""
	for i in "$1"/*; do
		if [ -d "$i" -a ! -L "$i" -a "$i" != "$2" ]
		then
			if [ -d "$i/$binname" -a ! -L "$i/$binname" -a -f "$i/$binname/$zdbname" -a -f "$i/$binname/$hasqdname" ]
			then 
				fldr="$i"
				echo "$fldr"
			else
				findinc "$i"
			fi
		fi
	done
}

finddec() {
	local fldr=$(findinc "$1" "$2")
	if [ -z "$fldr" ]
	then
		local parentdir="$(dirname "$1")"
		finddec "$parentdir" "$1"
	else
		echo "$fldr"
	fi
}

echo "> searching for $binname folder"
srcdir="$(finddec "$(pwd)")"
bindir="$srcdir/$binname"
[ -z "$bindir" ] && error "$binname folder not found!" || echo "$bindir"

"$bindir/$zdbname" erasedisk 
"$bindir/$zdbname" "create wrd.db wrd WRD 1 [magic] 1 0"
"$bindir/$zdbname" "create md5.db md5 MD5 1 [magic] 1 0"
"$bindir/$zdbname" "create r16.db r16 R16 1 [magic] 1 0"
"$bindir/$zdbname" "create s22.db s22 S22 1 [magic] 1 0"
"$bindir/$zdbname" "create s25.db s25 S25 1 [magic] 1 0"
"$bindir/$zdbname" "create smd.db smd SMD 1 [magic] 1 0"
