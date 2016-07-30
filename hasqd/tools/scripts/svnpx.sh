#!/bin/sh

if [[ -z "$PXPWD" ]]; then
echo PXPWD
exit
fi

PXSRV=10.52.0.202
PXPRT=8080
PXUSR=Oleg.Mazonka
#PXPWD=K02
PXPWD=$PXPWD

PXSRVO="--config-option servers:global:http-proxy-host=$PXSRV"
PXPRTO="--config-option servers:global:http-proxy-port=$PXPRT"
PXUSRO="--config-option servers:global:http-proxy-username=$PXUSR"
PXPWDO="--config-option servers:global:http-proxy-password=$PXPWD"

PXOPT="$PXSRVO $PXPRTO $PXUSRO $PXPWDO"

#cmd="svn ls https://svn.hasq.org/svn/ $PXOPT"
cmd="svn $* $PXOPT"
echo $cmd
$cmd

