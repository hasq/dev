@echo off
IF "%1"=="" echo Please enter your email
IF not "%1"=="" echo Hello! | blat -to %1 -f %1 -s "Blat test!" -server 127.0.0.1 -debug -timestamp -x "X-Header-Test: Can Blat do it? Yes it Can!" -u hasqsvn -pw hasqtech14
