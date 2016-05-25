#!/bin/bash

# search tcz folder and download/update tcz-packages
# run with "up"/"UP" for update tcz-packages

if [[ -z $1 || $1 == "6" ]]
then
	ver="6"
	list="6list.txt"
	link="http://tinycorelinux.net/6.x/x86/tcz/"
elif [ $1 == "7" ]
then
	ver="7"
	list="7list.txt"
	link="http://tinycorelinux.net/7.x/x86/tcz/"
else
	echo "Unknown parameter "$1""
	exit
fi

logfile="get-tcz.log"
tcz="tcz"
iso="iso"
workdir=""
update="$1"

[ "$update" == "up" -o "$update" == "UP" ] || update=""

[ -f "$logfile" ] && rm -rf "$logfile">/dev/null

error() {
	[ -z "$1" ] || echo "$1"
	exit 1
}

findinc() {
	local workdir=""
	for i in "$1"/*; do
		if [ -d "$i" -a ! -L "$i" -a "$i" != "$2" ]
		then
			if [ -d "$i/$ver.x/$tcz" -a -d "$i/$ver.x/$iso" ]
			then 
				workdir="$i/$ver.x/tcz"
				echo "$workdir"
			else
				findinc "$i"
			fi
		fi
	done
}

finddec() {
	local workdir=$(findinc "$1" "$2")
	if [ -z "$workdir" ]
	then
		local parentdir="$(dirname "$1")"
		finddec "$parentdir" "$1"
	else
		echo "$workdir"
	fi
}

download() {
	local fn="$3/$2"
	if [ -f "$fn" -a -z "$update" ];	then
		return 3
	elif [ -f "$fn" -a ! -z "$update" ]; then
		wget "$1$2" -O "$fn.new" > /dev/null 2>&1
		diff "$fn" "$fn.new"
		if [ "$?" != "0" ];	then
			mv -f "$fn.new" "$fn"
			return 2
		else
			rm -f "$fn.new"
			return 3
		fi	
	else
		wget "$1$2" -P "$3" > /dev/null 2>&1
		local rc=$?
		[ "$rc" = "0" ] && return 0 || return 1
	fi
}

workdir=$(finddec "$(pwd)")
echo ">searching for TinyCore folder..."
[ -z "$workdir" ] && error "TinyCore folder not found"
[ -z "$(svn status "$workdir/iso" 2>&1 | grep "was not found.")" -a -z "$(svn status "$workdir/tcz" 2>&1 | grep "was not found.")" ] || error "$workdir - is not a working copy of TinyCore."
[ -z "$(svn status "$workdir" | grep "^M")" ] || error ">>$workdir folder have uncommited changes, please commit it before."

[ -f "$(pwd)/$list" ] || error "Run scrip from proper folder!"

list="$(cat "$list")"

for i in ${list[@]}
do
	if [ ! -f "$tcz/$i" ];	then 
		download "$link" "$i" "$workdir"
		rc=$?
		[ "$rc" == "0" ] && echo "$i OK" && echo "$i OK" >>"$logfile"
		[ "$rc" == "1" ] && echo "$i FAILED" && echo "$i FAILED" >>"$logfile"
		[ "$rc" == "2" ] && echo "$i UPDATED" && echo "$i UPDATED" >>"$logfile"
		[ "$rc" == "3" ] && echo "$i EXIST" && echo "$i EXIST" >>"$logfile"
	fi
done

echo -e "\nDONE! See results in $logfile and don't forget to update SVN"