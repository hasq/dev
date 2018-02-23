#include <windows.h>
#include <conio.h>
#include <iostream>
#include <stdio.h>

#include "os.h"

int os::kbhit()
{
    int x = ::_kbhit();
    return x ?::_getch() : 0;
}

void os::console()
{
    system("cmd.exe");
}

#include "os.inc"
