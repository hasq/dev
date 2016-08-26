#!/bin/bash

STARTDIR="$(pwd)"
SRCDIR=""
ISO="additional"
TEMP="../$ISO"
WORKSRC="worksrc"
JQ_FILE=""
NOSVN=false

[ -f "${iso}.iso" ] && rm "${iso}.iso"

while [ ! -z "$1" ]; do
    case $1 in
        "--n"|"--N")
            NOSVN=true
            echo "Warning! SVN status will not checked."
            ;;
        "--h"|"--H")
            echo "Options:"
            echo -e "\t--n : use unversioned copy of sources."
            echo -e "\t--h : this help."
            exit
            ;;
        *)
            fnError "Unknown parameter \"$1\""
            ;;
    esac
    shift      
done

fnError() {
	[ -z "$1" ] || printf "ERROR: $1"
	exit 1
}

fnSVNError() {
	fnError "SVN exporting error!"
}

fnDelFolder() {
	[ -z "$1" ] && return
	if [ -d "$1" ]
	then
		echo "> removing $1"
		rm -rf "$1"
	fi
}

fnMakeExport() {
	[ $# -ge 2 ] || return
	[ -z "$3" ] && echo "> exporting $1" || echo "> exporting $3"
	[ -z "$(svn status "$1" | grep "^M")" ] || echo ">> uncommited files exists!"
	svn export "$1" "$2" > /dev/null || fnSVNError
}

fnMakeCopy() {
	[ $# -ge 2 ] || return
	[ -z "$3" ] && echo "> copying $1" || echo "> copying $3"
    [ -z "$4" ] && cp -R "$1" "$2" > /dev/null
}

fnExportSVN() {
	VERFILE="${1}/img/root/hasq/build.txt"
	[ -z "$1" ] && return
    fnMakeExport src "$1/src" "src folder"
    fnMakeExport srcu "$1/srcu" "srcu folder"
    fnMakeExport img "$1/img" "img folder"
    svnversion > "$VERFILE"
    mkdir -p "$1/ext/jq"
    fnMakeExport "ext/jq/$JQ_FILE" "$1/ext/jq/$JQ_FILE" "external libraries"
# TODO: find ":" in rev num
    grep "M" "$VERFILE" && echo ">> revision: $(cat "$VERFILE")"
}

fnCopyLocal() {
	VERFILE="${1}/img/root/hasq/build.txt"
	[ -z "$1" ] && return
    fnMakeCopy src "$1/src" "src folder"
    fnMakeCopy srcu "$1/srcu" "srcu folder"
    fnMakeCopy img "$1/img" "img folder"
    svnversion > "$VERFILE"
    mkdir -p "$1/ext/jq"
    fnMakeCopy "ext/jq/$JQ_FILE" "$1/ext/jq/$JQ_FILE" "external libraries"
}

fnGetDir() {
    echo "$(echo $1 | head -c 2)/$1"
}

fnGetMD5() {
    echo "$(md5sum $1 | head -c 32)"
}


fnDelFolder "$TEMP"

VER="7.1"
TC="Core-$VER.iso"
TC_MD5="3d8c6fd16c5812b4b94b985f37230316"
TCZ="tcz-$VER.fcl"
TCZ_MD5="652c5413ccef9b631416848fe3e0d9cb"
REPO="https://github.com/hasq/bin/raw/master/md5/"
ISO_LNK="$REPO$(fnGetDir "$TC_MD5")/$TC"
TCZ_LNK="$REPO$(fnGetDir "$TCZ_MD5")/$TCZ"
ERR_ISO="Required file \"$TC\" is missing or corrupt.\nDownload it using the links:\n$ISO_LNK\n"
ERR_TCZ="Required file \"$TCZ\" is missing or corrupt.\nDownload it using the links:\n$TCZ_LNK\n"

[ ! -f "$TC" ] && fnError "$ERR_ISO"
[ ! -f "$TCZ" ] && fnError "$ERR_TCZ"
[ $(fnGetMD5 "$TC") == "$TC_MD5" ] && printf "$TC\t - OK\n" || fnError "$ERR_ISO" 
[ $(fnGetMD5 "$TCZ") == "$TCZ_MD5" ] && printf "$TCZ\t - OK\n"|| fnError "$ERR_TCZ" 


[[ "$NOSVN" = false ]] && echo "> exporting to $TEMP..." || echo "> copying to $TEMP..."

#mkdir -p "$TEMP/tcz"
mkdir -p "$TEMP" || fnError "Cannot create temp dir"
#cp "$TCZ" "$TEMP/tcz"
cp "$TCZ" "$TEMP"
cd "$TEMP"
fcl3 extr "$TCZ"
rm -rf "$TCZ"
cd "$STARTDIR"
cp "$TC" "$TEMP/"

[ -d ".." -a -d "../src" -a -d "../srcu" -a -d "../ext/jq" ] && SRCDIR=".."
[ -z "$SRCDIR" ] && fnError "Source folder incorrect. Run this script from the proper folder."
JQ_FILE="$(basename $(find ../ext/jq/ -name jquery-ui-*.bz2))"
cd "$SRCDIR" || exit

fnDelFolder "$WORKSRC"

TARGETDIR="$STARTDIR/$TEMP/$WORKSRC"

[ -d "$TARGETDIR" ] || mkdir -p "$TARGETDIR"

if [[ "$NOSVN" = false ]]
then
    fnExportSVN "$TARGETDIR"
else
    fnCopyLocal "$TARGETDIR"
fi

cd "$STARTDIR"
[ -d "$TEMP" -a -d "$TEMP/$WORKSRC" ] || exit
which genisoimage > /dev/null 2>&1 || fnError "! please install genisoimage"
echo "> making iso"
genisoimage -J -D -o "$ISO.iso" "$TEMP" > /dev/null 2>&1
[ $? -eq 0 -a -f "$ISO.iso" ] && echo ">> OK!"
fnDelFolder "$TEMP"
