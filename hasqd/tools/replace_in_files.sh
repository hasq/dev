#!/bin/sh

find . -type f -print0 | xargs -0 -n 1 sed -i -e 's/2013-2015/2013-2016/g'

#find . -name .svn -prune -o -type f -print0 | xargs -0 -n 1 sed -i -e 's/to/to/g'

