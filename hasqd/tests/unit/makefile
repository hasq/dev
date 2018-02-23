SRC=../../src/
include $(SRC)mk_all.mak

all: SGL_ DB_ GL_ MATH_ OS_
	@echo ""
	@echo "   *********************"
	@echo "   ** TESTS PASSED OK **"
	@echo "   *********************"

clean:
	echo clean

GL_:
	cd gl && make PLAT=$(PLAT)

MATH_:
	cd math && make PLAT=$(PLAT)

DB_:
	cd db && make PLAT=$(PLAT)

SGL_:
	cd sgl && make PLAT=$(PLAT)

OS_:
	cd os && make PLAT=$(PLAT)
