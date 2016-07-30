set PXSRV=10.52.0.202
set PXPRT=8080
set PXUSR=O.M
#set PXPWDx=Ko
#set PXPWD=

set PXSRVO=--config-option servers:global:http-proxy-host=%PXSRV%
set PXPRTO=--config-option servers:global:http-proxy-port=%PXPRT%
set PXUSRO=--config-option servers:global:http-proxy-username=%PXUSR%
set PXPWDO=--config-option servers:global:http-proxy-password=%PXPWD%

set PXOPT=%PXSRVO% %PXPRTO% %PXUSRO% %PXPWDO%

svn %* %PXOPT%
::svn ls http://googlecode.com/svn/trunk/mazgoo/dlo/ %PXOPT%
::svn ls https://svn.hasq.org/svn/ %PXOPT%


