#!/bin/bash

curdir=$(pwd)
cd "$(dirname $0)"
mydir="$(pwd)"

if [ -f "${mydir}/include.inc" ]
then
	. "${mydir}/include.inc"
else
	echo "Can not found include file"
	exit
fi

PLAT=$(getplatform)
echo "$PLAT"

BUILDPLAT=$(gettestplatform "$1")
[ -z "$BUILDPLAT" ] && gethelp

copres="_copres"

fcltool="$(which fcl3)"
[ -z "$fcltool" ] && fcltool="$(which fcl)"
[ -z "$fcltool" ] && tartool="$(which tar)"
bziptool="$(which bzip2)"
basetool="$(which base64)"

if [ "$PLAT" = "Windows" ]
then
	cmd /c echo %PROCESSOR_ARCHITEW6432% | grep "AMD64" && BITS="x64" || BITS="x32"
else
	BITS="$(uname -m)"
fi

echo "$BITS"

error() {
	if [ $# -ne 3 ]
	then
		echo "error() must have 3 params"
		exit
	fi
	echo "$1 returns $2"
	exit $3
}

removefile() {
	while [ ! -z "$1" ]; do
		[ -f "$1" ] && rm "$1"
		shift
	done
}

compress() {
	[ -z "$1" ] && return
	C_FILE="${copres}.$1"
	removefile "$C_FILE" "${C_FILE}.bz2" "${copres}.data"
	case "$1" in
	"fcl")
		"$fcltool" make -D$copres "$copres"
		;;
	"tar")
		"$tartool" cf "$C_FILE" "$copres"
		;;
	*)
		return
		;;
	esac
	[ ! -z "$bziptool" -a ! -z "$basetool" ] && "$bziptool" -c "$C_FILE" | "$basetool" > "${copres}.data"
}

runcase() {
	[ "$1" = "msc" -o "$1" = "unx" ] || return

	[ "$1" = "unx" ] && COMPIL="GCC $(gcc -dumpversion) ($(gcc -dumpmachine))" || COMPIL="$(cl 2>&1 | grep -i " version ")"
	echo -n "$PLAT $BITS, $(uname -o), $COMPIL, SVN ver. $svnver" > "$ident"
	removefile "$mlog"
	cd src
	make PLAT=$1 clean > /dev/null
	echo "Building src on $PLAT (PLAT=$1)"
	cat "${ident}" > "$mlog"
	make PLAT=$1 >> $mlog || error "make $1" $? $exit_build_error
	cd ../srcu
	make PLAT=$1 clean > /dev/null
	echo "Building srcu on $PLAT (PLAT=$1)"
	cat "${ident}" >> "$mlog"
	make PLAT=$1 >> $mlog || error "make $1" $? $exit_build_error
#	cp _bin_$1/* ../src/_bin_$1/
	cd ../tests/coptest/
	echo "bash cop PLAT $1 clean"
	bash cop PLAT $1 clean >/dev/null
	echo "bash cop PLAT $1 all"
	bash cop PLAT $1 all
	if [ $? -eq 2 ]
	then
		echo "Tests failed"
		bash cop PLAT $1 html "${hlog}.tmp"
		cat "${ident}" > "$hlog"
		echo "<br>" >> "$hlog"
		cat "${hlog}.tmp" >> "$hlog"
		echo "<br>================<br>" >> "$hlog"
		for difflist in $(find _copres/_failed_dir -name "*.diff.out.tmp")
		do
			echo "${difflist}:<br><pre>" >> "$hlog"
			cat "$difflist" | sed -e 's/</\&lt;/g' -e 's/>/\&gt;/g' >> "$hlog"
			echo "</pre><br>" >> "$hlog"
		done
		echo "================<br>" >> "$hlog"
		if [ ! -z "$fcltool" ]; then
			R_FRM="fcl"
			R_COM="fcl3 extr"
		else
			if [ ! -z "$tartool" ]; then
				R_FRM="tar"
				R_COM="tar xvf"
			fi
		fi
		compress "$R_FRM"
		if [ -f "${copres}.data" ]; then
			echo "Instruction<br>" >> "$hlog"
			echo "copy to a file 'a.tmp' in a directory under 'tests';<br>" >> "$hlog"
			echo "base64 -d -i a.tmp > b.${R_FRM}.bz2<br>" >> "$hlog"
			echo "bunzip2 b.${R_FRM}.bz2<br>" >> "$hlog"
			echo "$R_COM b.${R_FRM}<br>" >> "$hlog"
			echo "cop html<br>" >> "$hlog"
			echo "================<br>" >> "$hlog"
			echo "${R_FRM}:bzip2:base64<br>" >> "$hlog"
			echo "================<br>" >> "$hlog"
			echo "<pre>" >> "$hlog"
			cat "${copres}.data" >> "$hlog"
			echo "</pre>" >> "$hlog"
			echo "================<br>" >> "$hlog"
		fi
		error "cop $1" 2 $exit_tests_fail
	else
		echo "Tests ok"
	fi
	cd ../../src/
}
#- cd SVN://hasqd -
cd ../../
#------------------
svn up || error "svn" "error (no inet?)" $exit_svn_fail
svnver="$(svnversion)"
[ "$svnver" = "$(cat $svnverfile 2>/dev/null)" ] && error "svn" ": no new revisions" $exit_svn_same_ver
echo "$svnver" > "$svnverfile"
[ "$PLAT" = "Windows" ] && runcase "$BUILDPLAT" || runcase "unx"

exit $exit_tests_pass
