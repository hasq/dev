set hex=0123456789
set kiv=-iv %hex% -K %hex%
openssl enc -aes-256-cbc -e -in %1 -out %1.e -k %PWD% %kiv% -nosalt -p