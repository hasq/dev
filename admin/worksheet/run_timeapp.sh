#!/bin/sh

if test -f ./hide; then
:
else
if test -f ./hide.exe; then
:
else
echo "Please compile hide.cpp"
exit
fi
fi

if test -f ./timeapp; then
:
else
if test -f ./timeapp.exe; then
:
else
echo "Please compile timeapp.cpp"
exit
fi
fi

#hide
#svn up timesheet.e
#hide timesheet.e
#hide tech_tasks.txt.e
#timeapp.exe
#hide timesheet
#svn ci timesheet.e -m "time"
#del tech_tasks.txt
#move timesheet ts_backup.tmp

./hide
echo "svn up timesheet"
svn up timesheet.e
./hide timesheet.e
./hide tech_tasks.txt.e

echo "./timeapp"
./timeapp

./hide timesheet

echo "svn ci timesheet"
svn ci timesheet.e -m "time"

rm tech_tasks.txt
mv timesheet ts_backup.tmp
