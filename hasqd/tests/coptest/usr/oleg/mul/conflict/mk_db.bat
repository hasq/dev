SET S1=..\..\..\..\..\..\src\_bin_msc
rm -rf db1 db2
mkdir db1
%S1%\zdb "set base db1" erasedisk "create _wrd wrd Word 1 [] 1 0"
%S1%\zdb "set base db1" load "recprn _wrd 0 rdn pa%S1%"
%S1%\zdb "set base db1" load "recprn _wrd 1 rdn pa%S1%"
%S1%\zdb "set base db1" load "recprn _wrd 1 rdn pas2"
%S1%\zdb "set base db1" load "recprn _wrd 2 rdn pa%S1%"
%S1%\zdb "set base db1" load "add _wrd 0 fd80 0000 d521 d521"
%S1%\zdb "set base db1" load "add _wrd 1 fd80 3b51 6a31 2211"

mkdir db2
%S1%\zdb "set base db2" erasedisk "create _wrd wrd Word 1 [] 1 0" 
%S1%\zdb "set base db2" load "add _wrd 0 fd80 0000 d521 d521"
%S1%\zdb "set base db2" load "add _wrd 1 fd80 3b51 6a31 e311"

