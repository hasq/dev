#!/bin/sh

find . -name '*.cpp' | xargs sed -i.bak 's/\/\/ (c) 2014 HASQ Technologies Pty ltd/\/\/ Hasq Technology Pty Ltd (c) 2014/g'
