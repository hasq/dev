if [ -z "$mydir" ]
then
	echo "Please specify mydir variable"
	exit
fi

getplatform() {
	uname -o | grep -i "CYGWIN" > /dev/null && echo "Windows" || echo "Linux"
}

gettestplatform() {
if [ "$PLAT" = "Windows" ]
then
	if [ "z$1" = "zmsc" -o "z$1" = "zunx" ]
	then
		echo "$1"
	fi
else
	echo "unx"
fi
}

gethelp() {
	myname="$(basename "$0")"
	echo "Please specify compiler." >&2
	echo "Usage:" >&2
	echo "   $myname <msc | unx>" >&2
	echo "For example:" >&2
	echo "   $myname unx" >&2
	exit
}

svnverfile="${mydir}/z_svnver.txt"
mlog="${mydir}/z_make.log"
hlog="${mydir}/z_cop.html"
blog="${mydir}/z_blat.log"
ident="${mydir}/z_ident.txt"

exit_build_error=1
exit_tests_pass=2
exit_tests_fail=3
exit_svn_fail=4
exit_svn_same_ver=5
