#!/bin/sh

gcovdir=`pwd`
dirres=tests/gcov/

cd ../../src

#make clean
#make PLAT=unx GCOV=1

cd ../tests/coptest

#sh cop PLAT unx clean
#sh cop PLAT unx all
#sh cop PLAT unx html > gcov/_cop_result.html
#sh cop PLAT unx clean

cd ../../src

prc(){
dr=$1
fl=$2
cd $dr
  rm -f ../../$dirres/$fl.cpp
  if test -f _bin_unx/$fl.gcda
  then
    gcov $fl.cpp -o _bin_unx > /dev/null 2>&1
    cat $fl.cpp.gcov | grep -v "function _" > $fl.gcov.tmp
    mv $fl.gcov.tmp $fl.cpp.gcov
    res=`cat $fl.cpp.gcov | grep "####" | grep -v "Never"`
    if [ "$res" = "" ]; then
      :
    else
      echo "$dr/$fl.cpp has uncovered lines"
      cp $fl.cpp.gcov ../../$dirres/
      chmod 0777 ../../$dirres/$fl.cpp.gcov
    fi
  else
    echo "$dr/$fl.cpp has not been run"
    cp $fl.cpp ../../$dirres
    chmod 0777 ../../$dirres/$fl.cpp
  fi
cd ..
}

prc db hq_db 
prc db hq_hash 
prc db hq_record 
prc db hq_dbslice 
prc db hq_dbindex
prc db hq_single 
prc db hq_traits
prc db hq_sl_file
prc db hq_sl_hdt
prc db hq_sl_meta

prc gl gl_protocol 
prc gl gl_utils 
prc gl gl_except 
prc gl gl_err

prc publ hq_wkrtask
prc publ hq_svttask
prc publ hq_publisher
prc publ hq_config
prc publ hq_secretary
prc publ hq_chiefeditor
prc publ hq_automachine
prc publ hq_worker
prc publ hq_globalspace
prc publ hq_logger
prc publ hq_servant
prc publ hq_connector
prc publ hq_conflict
prc publ hq_svtjob
prc publ hq_reorgan

prc sgl sg_client
prc sgl sg_testing
prc sgl sg_cout

