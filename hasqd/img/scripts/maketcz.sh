#!/bin/bash
#.
# Script sobiraet tcz packeti dlya ustanovki v TinyCore
# Zapuskaetsa avtomaticheski iz automate.sh
#.

SRCPATH="../sources"

error() {
	[ -z "$1" ] || echo "$1"
	exit 1
}

case "z$1" in
	"zssmtp"|"zbitcoin"|"zhasq")
		TCZTARGET="$1"
		;;
	*)
		echo "This script compiles .tcz packets for TinyCore Linux"
		echo "It should be run under TinyCore"
		echo "Usage: $(basename "$0") < hasq | ssmtp | bitcoin >"
		exit
		;;
esac

CURDIR="$(pwd)"
cd "$(dirname "$0")"
MYDIR="$(pwd)"
cd "$CURDIR"

TMPDIR="/tmp/tmp-$$"

includefile="${MYDIR}/include.inc"
if [ -f "$includefile" ]
then
. $includefile
fi

case "$TCZTARGET" in
	"hasq")
		BTMPDIR="${TMPDIR}/usr/local/bin"
		[ ! -f [mM]akefile ] && error "Go to src/htsrc directory and run again!"
		[ -d _bin_unx ] && make clean
		make PLAT=unx || error "$TCZTARGET was not compiled!"
		strip _bin_unx/*
		mkdir -p "$BTMPDIR" || exit
		cp -a _bin_unx/* "${BTMPDIR}/"
#		_bin_unx/hasqd -v>"$verfile"
		_bin_unx/hasqd info=ver >"$verfile"
		mksquashfs "$TMPDIR" ${hasqtcz:="hasq.tcz"} && rm -rf "$TMPDIR"
		;;

	"ssmtp")
		SSMTPVER="2.64"
		SRCNAME="ssmtp_${SSMTPVER}.orig.tar.bz2"
		SRCFOLDER="ssmtp-${SSMTPVER}"
		SOURCEFILE="${MYDIR}/${SRCPATH}/${SRCNAME}"

		ssmtp_conf="${MYDIR}/../ssmtp/ssmtp.conf"
#		[ -w . ] || error "Current dir is not writable"
		mkdir -p "$TMPDIR" || error "Can not create tmp dir"
		cd "$TMPDIR"
		[ -f "$SOURCEFILE" ] || error "Can not find ssmtp sources: $SOURCEFILE"
		tar xjvf "$SOURCEFILE" || error "Source unpack error"
		cd "$SRCFOLDER"
		patch -p1 -i "${MYDIR}/../ssmtp/opessl_crypto.patch"
		patch -p1 -i "${MYDIR}/../ssmtp/makefile.patch"
		./configure --prefix=./release --enable-md5auth --enable-ssl || exit
		make || error "$TCZTARGET was not compiled!"
		strip ssmtp
		make install || error "$TCZTARGET was not compiled! (2)"
		cp "$ssmtp_conf" release/etc/ssmtp/
		mkdir tcz || error "can not create tcz directory"
		mksquashfs "release" "tcz/${TCZTARGET}.tcz"
		[ -f "tcz/${TCZTARGET}.tcz" ] && sh "${MYDIR}/../svnshare.sh" tcz
		;;

	"bitcoin")
		BITCOINVER="0.9.3"
		SRCNAME="v${BITCOINVER}.tar.gz"
		SRCFOLDER="bitcoin-${BITCOINVER}"
		SOURCEFILE="${MYDIR}/${SRCPATH}/${SRCNAME}"
		mkdir "$TMPDIR" || error "cannot create temp dir $(TMPDIR)"
		cd "$TMPDIR"
		#echo "$MYDIR/$SRCNAME"
		if [ -f "$SOURCEFILE" ]
		then
			[ -f "$SRCNAME" ] || cp "$SOURCEFILE" .
		else
			wget --no-check-certificate "https://github.com/bitcoin/bitcoin/archive/${SRCNAME}" || error "cant download source"
		fi
		tar xzvf "$SRCNAME" && cd "$SRCFOLDER"
		tce-load -iw automake bsddb-dev boost-dev
		./autogen.sh || exit
		./configure --with-incompatible-bdb --prefix="$(pwd)/release/usr/local" || exit
		make || error "$TCZTARGET was not compiled!"
		strip src/bitcoind
		strip src/bitcoin-cli
		make install || error "$TCZTARGET was not compiled! (2)"
		mkdir -p "release/usr/local/tce.installed"
		BCC="release/usr/local/tce.installed/bitcoin"
		echo '#!/bin/sh' > "$BCC"
		echo 'TCUSER="`cat /etc/sysconfig/tcuser`"' >> "$BCC"
		echo 'BTCCONF="/home/$TCUSER/.bitcoin"' >> "$BCC"
		echo '[ -d "$BTCCONF" ] || mkdir -p "$BTCCONF"' >> "$BCC"
		echo 'bitcoind 2>&1 | grep -e "rpcuser=" -e "rpcpassword=" > "$BTCCONF/bitcoin.conf"' >> "$BCC"
		echo 'chown -R ${TCUSER}:staff "$BTCCONF"' >> "$BCC"
		chmod +x "$BCC"
		mkdir tcz || error "can not create tcz directory"
		mksquashfs "release" "tcz/${TCZTARGET}.tcz"
		[ -f "tcz/${TCZTARGET}.tcz" ] && sh "${MYDIR}/../svnshare.sh" tcz
		;;
esac
echo "temp directory was $TMPDIR"
cd "$CURDIR"
