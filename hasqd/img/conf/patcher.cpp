#include <fstream>
#include <iostream>

#include "hqconf.h"

int main(int ac, char * av[])
try
{
    if ( ac != 2 )
    {
        if ( ac == 3 && string(av[1]) == "-t" )
        {
            void testFile(const string &);
            testFile(av[2]);
            return 0;
        }

        std::cout <<
                  "Usage: patcher <file.iso>\n"
                  "If config file does not exist in the current directory, it is extracted from ISO file\n"
                  "If config file exists in the current directory, it is used to patch ISO file\n"
                  "Usage: patcher -t <file> - to test config\n";
        return 0;
    }

    if ( HqConf::filename() == av[1] )
    {
        std::cout << "Please use ISO image filename as argument\n";
        return 3;
    }

    string file2str(const string &);
    string iso = file2str(av[1]);

    HqConf cfg;

    if ( cfg.loadFromFile() )
    {
        cfg.patchStr(iso);
        void str2file(const string & file, const string & s);
        str2file(av[1], iso);
        std::cout << "File " << av[1] << " has been patched\n";
        return 0;
    }

    cfg.loadFromStr(iso);
    cfg.saveToFile();

    std::cout << "File " << HqConf::filename() << " extracted from " << av[1] << "\n";
    return 0;


}
catch (string e)
{
    std::cout << "Error: " << e << "\n";
    return 2;
}
catch (...)
{
    std::cout << "Unknown error\n";
    return 1;
}

void str2file(const string & file, const string & s)
{
    std::ofstream of(file.c_str(), std::ios::binary);
    of << s;
}


string file2str(const string & file)
{
    std::ifstream in(file.c_str(), std::ios::binary);

    if ( !in )
        return "";

    string r;

    in.seekg(0, std::ios::end);

    size_t sz = (size_t)(in.tellg());

    r.reserve( sz );
    in.seekg(0, std::ios::beg);

    r.assign( std::istreambuf_iterator<char>(in), std::istreambuf_iterator<char>() );

    return r;
}

void testFile(const string & f)
{
    HqConf cfg;

    if ( f == HqConf::filename() )
    {
        if ( !cfg.loadFromFile() )
        {
            std::cout << "File '" << f << "' cannot be read\n";
            return;
        }

        string s = file2str(f);
        if ( s.size() > HqConf::Size )
            std::cout << "Warning: Filesize of '" << f << "' is greater than " << HqConf::Size << "\n";
    }
    else
    {
        string s = file2str(f);
        cfg.loadFromStr(s);
    }

    std::cout << "Testing file '" << f << "' - OK\n";
}

