
all: ma_sysinfo_ sysinfo_ filesys_

clean:
	echo clean

ma_sysinfo_:
	cd ma_sysinfo && make PLAT=$(PLAT)

sysinfo_:
	cd sysinfo && make PLAT=$(PLAT)

filesys_:
	cd filesys && make PLAT=$(PLAT)
