#!/bin/sh

sudo killall udhcpc 2> /dev/null

SHELL=sh
#[ -z `which bash` ] || SHELL=bash

[ -f /hasq/build.txt ] && echo "Hasq build: " `cat /hasq/build.txt`

# booter saves the current hasq working path
hwd=/tmp/hasqworkdir

# booter may request 'udhcpc'
run=/tmp/hasqprerun

sudo rm -f $hwd $run

#while true; do
sudo /hasq/booter
case $? in
	0)
		HD=`cat $hwd`

		if test -d $HD ; then
			:
		else
			echo "supervisor: Bad file $hwd"
			$SHELL
		fi

		cd $HD
		if [ -d "slice" ]; then
			sudo chown -R tc slice
			sudo chmod -R u+w slice
		fi
		sudo chown tc .
		sudo chmod u+w .

		[ -f $run ] && sudo sh $run

		[ -d "${HD}/slice/home" ] && rm -rf "${HD}/slice/home"
		[ -f "/hasq/jsclient.tar.bz2" ] && tar xjf "/hasq/jsclient.tar.bz2" -C "${HD}/slice/"

		echo
		echo "My IP $(ifconfig|grep "inet addr"|grep -v "127.0.0.1"|awk '{ print $2 }')"
		echo
		echo "Working directory: " `pwd`

		sh start_hasqd.sh
#		sudo su -c "sh start_hasqd.sh" tc

		break;
		;;
	1)
		echo "supervisor: rebooting..."
		sleep 1
		sudo reboot
		break;
		;;
	2)
		$SHELL
		break;
		;;
	3)
		$SHELL
		break;
		;;
	*)
		break;
		;;
esac

#done
