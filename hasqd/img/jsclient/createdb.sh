#!/bin/bash

counter=0
bin="_bin_"
zdb="zdb"

uname | grep -i "CYGWIN" >/dev/null 2>&1 && plat="Windows" || plat="Linux"

if [ "$plat" = "Windows" ] 
then 
	bin="$bin""msc"
	zdb="$zdb"".exe"
#	hasqd="hasqd.exe"
else
	bin="$bin""unx"
#	hasqd="hasqd"
fi

error() {
	[ -z "$1" ] || echo ">>> $1"
	exit 1
}


findinc() {
# $1 - this folder will be scanned
# $2 - this folder has been scanned previously and will be skipped
	for i in "$1"/*;do
		if [ -d "$i" -a ! -L "$i" -a "$i" != "$2" ]
		then
			[ -f "$i/$bin/$zdb" ] && echo "$i/$bin" && exit 0 || findinc "$i"
		fi
	done
}

finddec() {
	local fldr=$(findinc "$1" "$2")
	
	let "counter = counter + 1"
	
	[ "$counter" -eq 8 ] && error "zdb not found!"

	if [ -z "$fldr" ]
	then
		local parentdir="$(dirname "$1")"
		finddec "$parentdir" "$1"
	else
		echo "$fldr"
	fi
}

echo "> searching for $bin/$zdb"
src="$(finddec "$(pwd)")"

[ ! -f "$src/$zdb" ] && error "$src/$zdb not found!" 
echo "> $src/$zdb"

[ "$1" == "erase" ] && "$src/$zdb" erasedisk && exit
[ "$1" == "clean" ] && "$src/$zdb" erasedisk

#[ ! -f "slice/wrd.db/db.traits" ] && "$src/$zdb" "create wrd.db wrd WRD 1 [magic] 1 0" || echo "wrd.db already exists"
#[ ! -f "slice/md5.db/db.traits" ] && "$src/$zdb" "create md5.db md5 MD5 1 [magic] 1 0" || echo "md5.db already exists"
#[ ! -f "slice/r16.db/db.traits" ] && "$src/$zdb" "create r16.db r16 R16 1 [magic] 1 0" || echo "r16.db already exists"
#[ ! -f "slice/s22.db/db.traits" ] && "$src/$zdb" "create s22.db s22 S22 1 [magic] 1 0" || echo "s22.db already exists"
#[ ! -f "slice/s25.db/db.traits" ] && "$src/$zdb" "create s25.db s25 S25 1 [magic] 1 0" || echo "s25.db already exists"
[ ! -f "slice/smd.db/db.traits" ] && "$src/$zdb" "create smd.db smd SMD 1 [magic] 1 0" || echo "smd.db already exists"

exit 0