#!/bin/sh

# init
#svn co https://hasq.org/svn/dev/hasqd -r 1

start=1
end=1655

for (( x=$start; x<=$end; x++ ))
do
echo "= = = Iteration $x = = ="
cd hasqd
svn up -r $x
cd ..
svn export hasqd hasqd_$x
fcl3 make -D hasqd_$x hasqd_$x
bzip2 hasqd_$x.fcl
rm -rf hasqd_$x
done
