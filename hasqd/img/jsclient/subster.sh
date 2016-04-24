#!/bin/bash

error() {
    echo "***************************************">&2
    [ -z "$1" ] || echo "$1" >&2
    echo "***************************************">&2
    exit 1
}

while read -r LINE; do
    if [ "$LINE" = "INCLUDEFILE" ]; then
        read LINE
        [ -r "$LINE" ] || error "ERROR ***** cant open file $LINE *****"
            while read -r SLINE; do
                echo "r += '$SLINE@n';"
            done < "$LINE"
        continue
    fi
    echo "$LINE"
done
