#!/bin/sh
# Hasq Technology Pty Ltd (C) 2013-2015
#wb=firefox
addr=http://127.0.0.1:13151/hqclnt.html


if cmd /c ls 2> /dev/null 1> /dev/null
then
cmd /c start $wb $addr
else
$wb $addr
fi



