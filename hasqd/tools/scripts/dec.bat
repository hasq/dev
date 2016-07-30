set hex=0123456789
set kiv=-iv %hex% -K %hex%
openssl enc -aes-256-cbc -d -in %1.e -out %1 -k %PWD% %kiv% -nosalt -p