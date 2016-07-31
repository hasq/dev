call cop run %1.sts
call xdiff %1.gold.tmp %1.out.tmp
pause
call cop update %1.sts
