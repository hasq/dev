@pushd .
@cd ../../../../../../src/pu
@make -j 20
@if %errorlevel% neq 0 exit /b %errorlevel%
@cd ..
@make
@popd
cop run agt6.sts
