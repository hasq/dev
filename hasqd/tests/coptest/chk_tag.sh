#/bin/sh


dodir()
{
pushd $1 > /dev/null
for i in *
do
  #echo "AAA $2$1/$i"
  if test -d $i
  then
  dodir $i $2$1/
  fi
done

if ls *.sts > /dev/null 2>&1
then
  for i in *.sts
  do
    tag=`cat $i | grep "#TAG"`

    if [ "$tag" = "" ]
    then
      echo "ERROR no tag in $2$1/$i"
    else
      :
      #echo "AAA2 $tag"
    fi
  done

else
  :
  #echo "no sts files in $2$1"
fi

popd > /dev/null
}


dodir .

