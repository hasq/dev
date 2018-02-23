#!/bin/bash
#.
# Obrezka ispolnyaemih failov hasq ot otladochnoj informacii posle kompilirovaniya
#.
find . | xargs file | grep "executable" | grep ELF | grep "not stripped" | cut -f 1 -d : | xargs strip --strip-unneeded 2> /dev/null || find . | xargs file | grep "shared object" | grep ELF | grep "not stripped" | cut -f 1 -d : | xargs strip -g 2> /dev/null
