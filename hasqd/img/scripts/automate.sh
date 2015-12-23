#!/bin/sh
#.
# Script dlya avtomatizacii processa sozdanija Modified TinyCore ISO with HASQ
# Zapuskaetsja polzovatelem v virtualnoj mashine TC s prisoedinennogo ISO Image s tcz packetami i ishodnimi kodami hasq
#.
hasqtmp="~/home/hasq"
hasqtcz="${hasqtmp}/tcz"

###################################
[ -d ~/worksrc ] && rm -rf ~/worksrc
[ -d ~/iso ] && rm -rf ~/iso
###################################

error() {
	[ -z "$1" ] || echo "$1"
	exit 1
}

cutdir() {
	[ -z "$1" ] && return
	echo "$1"|sed 's/\/[a-zA-Z0-9]*$//'
}

cd "$(dirname "$0")"
mydir="$(pwd)"

tczdir="$mydir"
while [ ! -f "${tczdir}/svn.tcz" ]
do
	tczdir="$(cutdir "$tczdir")"
	[ "$tczdir" == "/home" -o "$tczdir" == "/" ] && break
done

cd "$tczdir" && tce-load -i *.tcz || error "tce-load work error"

echo "pwd = $(pwd)"
echo "tczdir = $tczdir"
echo "mydir = $mydir"

#cp -R "${tczdir}/worksrc" ~/ && chmod -R a+w ~/worksrc && cd ~/worksrc || error "worksrc copy error"
if [ ! -d ~/worksrc ]; then
	cp -R "worksrc" ~/ && chmod -R a+w ~/worksrc && cd ~/worksrc/src || error "worksrc copy error"
fi

${mydir}/maketcz.sh hasq

[ -f "hasq.tcz" ] || error "Error creating hasq.tcz"

#$(cutdir "$mydir")/isoremaster.sh release "$tczdir"
~/worksrc/img/isoremaster.sh release "$tczdir" || error "ISO not created"

[ -f ~/worksrc//src/hasq*.iso ] || error "Error creating ISO file"

mkdir iso && cp hasq*.iso iso/ || error "Cant copy hasq.iso to ~/worksrc/src/iso"

[ -d "iso" ] && $(cutdir "$mydir")/svnshare.sh iso
