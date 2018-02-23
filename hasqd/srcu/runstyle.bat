set EXE=c:\app\AStyle\AStyle.exe
set OPT=--options=c:\app\AStyle\ht_style.options

%EXE% %OPT% db/*.cpp
%EXE% %OPT% ../src/db/*.cpp

%EXE% %OPT% ../src/db/*.h
%EXE% %OPT% ../src/db/*.inc

%EXE% %OPT% ../src/gl/*.cpp
%EXE% %OPT% ../src/gl/*.h

%EXE% %OPT% sg/*.cpp
%EXE% %OPT% ../src/sg/*.cpp
%EXE% %OPT% ../src/sg/*.h

%EXE% %OPT% ../src/os/*.cpp
%EXE% %OPT% ../src/os/*.h
%EXE% %OPT% ../src/os/*.inc
%EXE% %OPT% ../src/os/msc/*.cpp
%EXE% %OPT% ../src/os/unx/*.cpp

%EXE% %OPT% ../src/pu/*.cpp
%EXE% %OPT% ../src/pu/*.h

%EXE% %OPT% vi/*.cpp
%EXE% %OPT% vi/*.h

%EXE% %OPT% ../wxviewer/*.cpp
%EXE% %OPT% ../wxviewer/*.h

%EXE% %OPT% tmp/*.cpp

%EXE% %OPT% ../src/ma/ma_*.cpp
%EXE% %OPT% ../src/ma/ma_*.h

%EXE% %OPT% --recursive ../tests/unit/*.cpp
