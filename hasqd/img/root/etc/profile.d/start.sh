#!/bin/sh

if [ "$USER" == "tc" ] ; then

	for i in /mnt/s*
	do
		[ -f $i/start.sh ] && $i/start.sh
	done

	/hasq/supervisor.sh
fi

