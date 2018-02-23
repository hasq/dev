#!/bin/sh

base64 -d -i input64.txt > b.fcl.bz2
bzip2 -d -k b.fcl.bz2
fcl3 extr b.fcl
sh ../../coptest/cop html z.html
chmod 0777 z.html
cmd /c start z.html
