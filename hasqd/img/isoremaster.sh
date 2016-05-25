#!/bin/bash
#.
# Script:
# 1. Sobitaet from original TinyCore ISO -> development TC ISO needed for later work (consist devel tools - gcc, g++, make, svn etc.)
# 2. Sobiraet from original TinyCore ISO -> HASQ ISO (TC with hasqd)
# 3. Skachivaet vse neobhodimie TC packety dlya pomesheniya ih v nash SVN
#.
# Moshno zapuskat iz pod TC VM,
# tak i avtomaticheski iz scripts/automate.sh
#.

TCVERSION=7 #change to 6 if you are working with 6.4.1

error() {
	[ -z "$1" ] || echo "$1"
	hcleanall
	exit 1
}

scriptdir="$(dirname "$0")"
[ -z "$scriptdir" ] && error "Where is my dir?"

includefile="${scriptdir}/scripts/include.inc"
[ -f "$includefile" ] || error "Can not found includes file"
. $includefile

tcextrhere="extracted_bootfiles"
tcextr="../$tcextrhere"

down="download"
rel="release"
loc="local"
ext="internet"
unp="unpack"

if [ "$TCVERSION" == "7" ]
then
  tcurl="http://tinycorelinux.net/7.x/x86/release/"
  iso2="Core-7.1.iso"
else
  tcurl="http://distro.ibiblio.org/tinycorelinux/6.x/x86/"
  iso2="Core-6.4.1.iso"
fi

packets="svn compiletc mc bash squashfs-tools wget mkisofs-tools udev-dev openss-dev boost-dev db-dev automake"
relpackets="nginx udev-lib openssl pcre"
  
need_tools="wget awk cpio unsquashfs mkisofs"

iso1="Core-current.iso"

param="$1"
dir="$(echo $2|sed 's/\/$//')"

hcleanall() {
	[ -d bootfiles ] && sudo rm -rf bootfiles
	[ -d "$tcextrhere" ] && sudo rm -rf "$tcextrhere"
	[ -f core.gz ] && rm core.gz
	[ -d packets ] && rm -rf packets
}

if [ "$param" == "$loc" -o "$param" == "$rel" ]
then
	[ -z "$dir" ] && error "Use: $(basename "$0") $param <local_tcz_directory>"
	dirtmp="$(pwd)"
	cd "$dir"
	dir="$(pwd)"
	cd "$dirtmp"
fi

tcserver="${tcurl}tcz/"
#cttree="compiletc.tcz.tree"
cttree=".tcz.tree"

filecheck() {
	[ -z "$1" ] && return
	if [ -z $(which $1 2>/dev/null) ]
	then
		echo "Please install $1 !"
		echo
		echo "In Arch Linux:"
		echo
		echo "wget - \"sudo pacman -S wget\""
		echo "awk - \" sudo pacman -S gawk\""
		echo "cpio - \"sudo pacman -S cpio\""
		echo "unsquashfs - \"sudo pacman -S squashfs-tools\""
		echo "mkisofs - \"sudo pacman -S cdrkit\""
		exit
	fi
}

makedir() {
	[ -z "$1" ] && return
	[ -d "$1" ] || mkdir "$1" || error "Can not create the $1 directory"
}

unsquash() {
	[ -z "$1" ] && return
	sudo unsquashfs "$1" && sudo cp -a squashfs-root/* ${tcextr}/ && sudo rm -rf squashfs-root
}

find_iso() {
	if [ "$param" == "$loc" -o "$param" == "$rel" ]
	then
		tmpisodir="$(echo $dir|sed 's/\/[a-zA-Z0-9]*$//')"
		cp "${tmpisodir}/${iso2}" "./${iso1}" || cp "${dir}/${iso2}" "./${iso1}"
		[ ! -f "${iso1}" -a -f "${iso2}" ] && cp "${iso2}" "${iso1}"
	else
		wget -nc "${tcurl}release/${iso1}"
	fi
	[ -f "${iso1}" ] || error "Cannot find file ${iso1} or ${iso2}. Please put it in current folder!"
}

patch_isocfg() {
	isopath="bootfiles/boot/isolinux"
	isocfg="${isopath}/isolinux.cfg"
	if [ -d "$isopath" ]
	then
		sudo mv "$isocfg" "${isocfg}.old"
		cat "${isocfg}.old"|sed 's/timeout 300/timeout 1/'|\
			sudo tee "${isocfg}">/dev/null
	else
		error "$isocfg not found"
	fi
}

patch_bootmsg() {
	isopath="bootfiles/boot/isolinux"
	isomsg="${isopath}/boot.msg"
	if [ -d "$isopath" ]
	then
		sudo mv "$isomsg" "${isomsg}.old"
		sudo cp "${scriptdir}/root/boot.msg" "$isomsg"
	else
		error "$isomsg not found"
	fi
}

add_autostart() {
#	[ -d "${scriptdir}/autostart" ] || return
#	sudo cp "${scriptdir}/autostart"/* ${tcextrhere}/etc/profile.d/
	[ -d "${scriptdir}/root" ] || return
	sudo cp -R "${scriptdir}/root"/* ${tcextrhere}/
}

extract_iso() {
	makedir iso
	sudo mount "${iso1}" iso -o loop,ro
	makedir bootfiles
	cp -a iso/boot bootfiles/
	sudo umount iso && rm -r iso
	makedir $tcextrhere
	cd $tcextrhere
	zcat ../bootfiles/boot/core.gz | sudo cpio -i -H newc -d
	cd ..
	patch_isocfg
	patch_bootmsg
}

check_packet() {
	[ -z "$1" ] && return
	[ -f "${1}.tcz" ] || error "Not found packet ${1}.tcz"
}

download_packets_local() {
	[ -z "$1" ] && return
	tmpfile="${dir}/${1}${cttree}"
	if [ -f "$tmpfile" ]
	then
		for z in $(<"${tmpfile}")
		do
			cp "${dir}/${z}" "./"
		done
	else
		cp "${dir}/${1}.tcz" "./"
	fi
	check_packet "$1"
}

download_packets_ext() {
	[ -z "$1" ] && return
	wget -nc "${tcserver}${1}${cttree}"
	if [ $? -eq 8 ]
	then
		wget -nc "${tcserver}${1}.tcz"
	else
		cat "${1}${cttree}"|awk -v TCS=${tcserver} '{if ($1 != "") print TCS$1}' | wget -nc -i -
	fi
	check_packet "$1"
}

link_all() {
	[ -d "${scriptdir}/scripts" ] && sudo cp -a "${scriptdir}"/scripts/* ${tcextrhere}/usr/local/bin/
	[ -f "${tcextrhere}/usr/local/bin/bash" ] && sudo ln -s /usr/local/bin/bash ${tcextrhere}/bin/bash
}

assemble_iso() {
	hasqisoname="hasq.iso"
	if [ -f "$verfile" ]; then
		if [ ! -z "$(cat $verfile)" ]; then
			[ "$param" == "$rel" ] && hasqisoname="hasq-$(cat $verfile).iso"
		fi
	fi
	sudo ldconfig -r $tcextrhere
	sudo rm bootfiles/boot/core.gz
	cd $tcextrhere
	sudo find | sudo cpio -o -H newc | gzip -11 > ../core.gz || exit
	cd ..
	sudo cp -a core.gz bootfiles/boot/core.gz || exit
	[ -f hasq*.iso ] && sudo rm hasq*.iso
	sudo mkisofs -l -J -R -V HASQ -no-emul-boot -boot-load-size 4 \
	 -boot-info-table -b boot/isolinux/isolinux.bin \
	 -c boot/isolinux/boot.cat -o "$hasqisoname" bootfiles
}

for z in $need_tools; do filecheck "$z"; done

hcleanall


case "$param" in
	"$loc")
		[ -f "${iso1}" ] || find_iso
		makedir packets
		extract_iso
		cd packets
		for z in $packets; do download_packets_local "$z"; done
		for z in *.tcz; do unsquash "$z"; done
		cd ..
		link_all
		assemble_iso
		hcleanall
		;;
	"$down")
		[ -f "${iso1}" ] || find_iso
		makedir tcz
		cd tcz
		for z in $packets $relpackets; do download_packets_ext "$z"; done
		cd ..
		hcleanall
		;;
	"$rel")
		[ -f "${iso1}" ] || find_iso
		if [ -d "../img/conf" ]; then
			cd ../img/conf
			make clean
			make PLAT=tcu || error "booter was not compiled"
			[ -d "../root/hasq" ] || mkdir -p "../root/hasq"
			[ -f "_bin_tcu/booter" ] && cp _bin_tcu/booter ../root/hasq/
			[ -f "_bin_tcu/patcher" ] && cp _bin_tcu/patcher ../root/hasq/
			[ -f "hasqd.conf" ] && cp hasqd.conf ../root/hasq/
#			[ -d "../hasqscr" ] && cp -R ../hasqscr ../root/hasq/scr
			cd ../../src
		fi
		if [ -d "../img/jsclient" ]; then
			cd ../img/jsclient
			make clean
			make || error "jsclient make error"
			if [ -d "slice/home" ]; then
				cd slice
				tar cjvf "jsclient.tar.bz2" "home" || error "error compressing jsclient"
				[ -f "jsclient.tar.bz2" ] && cp "jsclient.tar.bz2" ../../root/hasq/
				cd ..
			fi
			make clean
			cd ../../src
		fi
		makedir packets
		extract_iso
		[ -f "$hasqtcz" ] || hasqtcz="${scriptdir}/$hasqtcz"
		cp "$hasqtcz" packets/ || error "Can not find packet $hasqtcz"
		cd packets
		for z in $relpackets; do download_packets_local "$z"; done
		for z in *.tcz; do unsquash "$z"; done
		tcboot="${tcextr}/opt/bootlocal.sh"
		for z in ${scriptdir}/bootscripts/*
		do
			sysbootdir="/opt/"
			cp "$z" "${tcextr}${sysbootdir}"
			echo "${sysbootdir}$(basename "$z")" >> "$tcboot"
		done
		for z in $relpackets
		do
			tcei="/usr/local/tce.installed/$z"
			[ -f "${tcextr}${tcei}" ] && echo "$tcei" >> "$tcboot"
			[ -f "${tcextr}/usr/local/etc/init.d/$z" ] && echo "$z" >> "$tcboot"
			[ -f "${scriptdir}/conf/${z}.conf" ] \
				&& sudo cp -a "${scriptdir}/conf/${z}.conf" "${tcextr}/usr/local/etc/${z}/${z}.conf"
		done
		cd ..
		add_autostart
		assemble_iso
#		hcleanall
		;;
	"$ext")
		[ -f "${iso1}" ] || find_iso
		makedir packets
		extract_iso
		cd packets
		for z in $packets; do download_packets_ext "$z"; done
		for z in *.tcz; do unsquash "$z"; done
		cd ..
		link_all
		assemble_iso
		hcleanall
		;;
	"$unp")
		[ -f "${iso1}" ] || find_iso
		hcleanall
		extract_iso
		;;
	*)
		myname="$(basename "$0")"
		echo
		echo "Using this script:"
		echo
		echo -e "$myname \t\t: this help"
		echo -e "$myname $ext \t: download all needed files from Internet and repack iso"
		echo -e "$myname $loc <foldername> : get all packets from <foldername>"
		echo -e "$myname $rel <foldername> : integrate the $hasqtcz extension into iso"
		echo -e "$myname $down \t: download all needed files from Internet and put it on packets folder"
		echo
		exit
		;;
esac
