
@if NOT EXIST hide.exe (
	@echo Please compile hide.cpp
	@exit
)

@if NOT EXIST timeapp.exe (
	@echo Please compile timeapp.cpp
	@exit
)

hide
svn up timesheet.e
hide timesheet.e
hide tech_tasks.txt.e
timeapp.exe
hide timesheet
svn ci timesheet.e -m "time"
del tech_tasks.txt timesheet
