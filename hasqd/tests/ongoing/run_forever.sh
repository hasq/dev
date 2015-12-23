#!/bin/bash

#HASQHOSTID="kostya-PC"
#HASQHOSTID=${HASQHOSTID:-HASQHOSTID_IS_NOT_SET}
[ -z "$HASQHOSTID" ] && echo "Set HASQHOSTID" && exit

# timeouts for periodical testing
wait_no_internet="10m"
wait_for_svn_update="1h"
wait_tests_failed="6h"
wait_tests_ok="12h"
wait_on_build_error="3h"
wait_on_internal_error="3h"

int_wait() {
	[ -z "$1" ] && return
	echo "sleep $1"
	sleep "$1"
}
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

BUILDPLAT=$(gettestplatform "$1")
[ -z "$BUILDPLAT" ] && gethelp

if [ "$PLAT" = "Windows" ]
then
	mailprog="blat.exe"
else
	mailprog="/usr/sbin/ssmtp"
	[ -f "$mailprog" ] || mailprog="$(which ssmtp)"
#	[ -f "$mailprog" ] || mailprog="$(which mail)"
fi
#--- Check for BLAT or MAIL presense ---
if [ -z "$mailprog" ]
then
	echo "No $mailprog found"
	exit
fi
#--- Blat variables ---
server="-server 127.0.0.1"
x="X-Header-Test: Can Blat do it? Yes it Can!"
debug="-debug -timestamp"
au="-u hasqsvn -pw hasqtech14"
#----------------------
send_mails() {
	[ -f "$blog" ] && rm $blog
	if [ "$PLAT" = "Windows" ]
	then
		$mailprog "$sfile" -tf $eMail -f $eMail -s "$subj" $server $debug -x "$x" $au
#		$mailprog "$sfile" -tf $eMail -f $eMail -s "$subj" $server $debug -log "$blog" -x "$x" $au
	else
#		$mailprog -a "Content-type: text/html" -s "$subj" $(cat $eMail) < $sfile
$mailprog -v -C /etc/ssmtp/ssmtp.conf $(cat $eMail) << EOF
To: kg@hasq.org
From: hasqsvn@gmail.com
Subject: $subj
Content-type: text/html

$(cat $sfile)
EOF
	fi
}
#----------------------
while [ 1 -eq 1 ]
do
	sh run_once.sh $BUILDPLAT
	case $? in
	$exit_svn_fail)
		echo "Waiting for internet"
		int_wait $wait_no_internet
		;;
	$exit_svn_same_ver)
		echo "Waiting for svn repo update"
		int_wait $wait_for_svn_update
		;;
	$exit_tests_fail)
		eMail="report_fail.txt"
		subj="tests FAILED plat=[$PLAT] host=[$HASQHOSTID]"
		sfile="z_cop.html"
		send_mails
		int_wait $wait_tests_failed
		;;
	$exit_tests_pass)
		eMail="report_ok.txt"
		subj="tests OK plat=[$PLAT] host=[$HASQHOSTID]"
		sfile="z_ident.txt"
		send_mails
		int_wait $wait_tests_ok
		;;
	$exit_build_error)
		eMail="report_fail.txt"
		subj="BUILD FAILED plat=[$PLAT] host=[$HASQHOSTID]"
		sfile="z_make.log"
		send_mails
		int_wait $wait_on_build_error
		;;
	0|*)
		eMail="report_fail.txt"
		subj="Internal $0 error"
		sfile="$0"
		send_mails
		int_wait $wait_on_internal_error
		;;
	esac
done
