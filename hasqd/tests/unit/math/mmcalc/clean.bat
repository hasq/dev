cd vc
rm -rf        ipch
rm -rf        vc.sdf
rm -rf        Debug
rm -rf        Release
rm -rf        DebugStatic
rm -rf        vc.suo
rm -f         hq.*.log hq.*.lock
cd ..

make clean
