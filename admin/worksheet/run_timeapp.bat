
@if NOT EXIST hide.exe (
	@echo Please compile hidee.cpp
	@echo e.g. g++ ../tools/hidee.cpp -o hidee.exe
	@exit
)

@if NOT EXIST timeapp.exe (
	@echo Please compile timeapp.cpp
	@echo e.g. g++ ../tools/timeapp.cpp -o timeapp.exe
	@exit
)

hide
svn up timesheet.e
hidee timesheet.e
hidee tech_tasks.txt.e
timeapp.exe
hidee timesheet
svn ci timesheet.e -m "time"
del tech_tasks.txt
move timesheet ts_backup.tmp
