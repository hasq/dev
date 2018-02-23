#!/bin/sh

ad=${ad:-c:/ap14}

ap=`cygpath $ad`/run
co=`pwd`/cop

if test -d $ap
then
    :
else
    echo "cannot find valid directory $ad"
    echo "try command: env ad=<DIR> sh cop_install.sh"
    echo "where <DIR> is your ap install directory"
    echo "for example:"
    echo "env ad=c:/ap14 sh cop_install.sh"
    exit
fi


if [[ :$PATH: == *:"$ap":* ]] ; then
    :
else
    echo "directory $ap is not on the \$PATH"
    echo "check that directory $ad is your current working"
    exit
fi

if test -f $ap/cop.bat
then
    echo "$ad/run/cop.bat - is installed"
    echo "if you want to reinstall cop, remove file (rm $ad/run/cop.bat) and run again"
    exit
fi

echo "@sh $co %*" > cop.bat

mv cop.bat $ap/

echo "installing cop in $ap"

