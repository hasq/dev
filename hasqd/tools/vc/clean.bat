cd vc
rm -rf        ipch
rm -rf        vc.sdf
rm -rf        Debug
rm -rf        DebugStatic
rm -rf        vc.suo vc.*.suo
rm -f         hq.*.log hq.*.lock
cd ..

cd vcdb
rm -rf        ipch
rm -rf        vc.sdf
rm -rf        Debug
rm -rf        vc.suo vc.*.suo
cd ..

cd vcvi
rm -rf        ipch
rm -rf        vc.sdf
rm -rf        Debug
rm -rf        vc.suo vc.*.suo
rm -f         hq.*.log hq.*.lock
cd ..

cd clt_test
rm -rf Debug *.exe *.obj *.mk *.tags *.txt *.workspace.* .clang
cd ..

cd clt
rm -rf Debug *.exe *.obj *.mk *.tags *.txt *.workspace.* .clang
cd ..
