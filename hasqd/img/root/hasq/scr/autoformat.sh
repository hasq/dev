#!/bin/bash

name=`basename $0`

if [ -z "$1" ] ; then
  echo "This script creates or deletes a partition on hard disk"
  echo "Usage: $name /dev/sda [delete]" 
  exit
fi

tmp=/tmp/$name.tmp
#tmp=tmp.tmp

if [ "$2" == "delete" ]
then
  echo "d" > $tmp
  echo "w" >> $tmp

  echo "sudo fdisk $1 < $tmp"
  sudo fdisk $1 < $tmp

  exit
fi

echo "n" > $tmp
echo "p" >> $tmp
echo "1" >> $tmp
echo "" >> $tmp
echo "" >> $tmp
echo "w" >> $tmp

echo "sudo fdisk $1 < $tmp"
sudo fdisk $1 < $tmp

echo "sudo mkfs.ext4 ${1}1"
sudo mkfs.ext4 ${1}1
