#!/bin/bash


newlinefilter="tr -d '\015'"
#newlinefilter="tr -d \015"
#newlinefilter="cat"

cutoffx(){
#     cat $1 | $newlinefilter | grep -v "HOST:\|Hasq Technology Pty Ltd" | cat > $1.tmp
     cat $1 | $newlinefilter > $1.tmp
}

echo AAA
cutoffx 009.out
exit

