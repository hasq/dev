#!/bin/bash
#.
# Script dlya teh, kto zabyvaet put' k SVN SRC
# Prosto skachivaet HASQD SRC
#.
if [ -z "$1" ]
then
	echo "Usage: `basename $0` <svn_username>"
	exit
fi
svn --username "$1" checkout https://hasq.org/svn/dev/hasqd/
