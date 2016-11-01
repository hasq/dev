#!/bin/bash
# Hasq Technology Pty Ltd (C) 2013-2016

PLAT=${PLAT:-msc}
bin=_bin_${PLAT}

[ "$1" == "erase" ] && "$src/$zdb" erasedisk && exit
[ "$1" == "clean" ] && "$src/$zdb" erasedisk

#[ ! -f "slice/wrd.db/db.traits" ] && "../../src/$bin/zdb"\
 "create wrd.db wrd WRD 1 [magic] 1 0" || echo "wrd.db already exists"
#[ ! -f "slice/md5.db/db.traits" ] && "../../src/$bin/zdb"\
 "create md5.db md5 MD5 1 [magic] 1 0" || echo "md5.db already exists"
#[ ! -f "slice/r16.db/db.traits" ] && "../../src/$bin/zdb"\
 "create r16.db r16 R16 1 [magic] 1 0" || echo "r16.db already exists"
#[ ! -f "slice/s22.db/db.traits" ] && "../../src/$bin/zdb"\
 "create s22.db s22 S22 1 [magic] 1 0" || echo "s22.db already exists"
#[ ! -f "slice/s25.db/db.traits" ] && "../../src/$bin/zdb"\
 "create s25.db s25 S25 1 [magic] 1 0" || echo "s25.db already exists"
[ ! -f "slice/smd.db/db.traits" ] && "../../../src/$bin/zdb"\
 "create smd.db smd SMD 1 [] 1 0 5H" || echo "smd.db already exists or zdb not found"

exit 0
