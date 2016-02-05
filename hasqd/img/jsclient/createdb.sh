#!/bin/bash

srcdir=""
bindir=""
srcname="src"
zdbname=""
hasqdname=""
fullpath=""
plat=""
counter=0

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
	[ -z "$1" ] || echo ">>> $1"
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
	
	let "counter = counter + 1"
	
	[ "$counter" -eq 5 ] && error "zdb not found!"

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
[ -z "$bindir" ] && error "$binname folder not found!" || echo "> $bindir"

[ "$1" == "makeclean" ] && "$bindir/$zdbname" erasedisk
[ "$1" == "clean" ] && "$bindir/$zdbname" erasedisk && exit 0
#[ ! -f "slice/wrd.db/db.traits" ] && "$bindir/$zdbname" "create wrd.db wrd WRD 1 [magic] 1 0" || echo "wrd.db already exists"
#[ ! -f "slice/md5.db/db.traits" ] && "$bindir/$zdbname" "create md5.db md5 MD5 1 [magic] 1 0" || echo "md5.db already exists"
#[ ! -f "slice/r16.db/db.traits" ] && "$bindir/$zdbname" "create r16.db r16 R16 1 [magic] 1 0" || echo "r16.db already exists"
#[ ! -f "slice/s22.db/db.traits" ] && "$bindir/$zdbname" "create s22.db s22 S22 1 [magic] 1 0" || echo "s22.db already exists"
#[ ! -f "slice/s25.db/db.traits" ] && "$bindir/$zdbname" "create s25.db s25 S25 1 [magic] 1 0" || echo "s25.db already exists"
[ ! -f "slice/smd.db/db.traits" ] && "$bindir/$zdbname" "create smd.db smd SMD 1 [magic] 1 0" || echo "smd.db already exists"
