// Hasq Technology Pty Ltd (C) 2013-2015

#include <iostream>
#include <string>
#include <sstream>
#include <cstdlib>
#include <fstream>

#include "gl_err.h"
#include "gl_except.h"

#include "os_filesys.h"

#include "hq_db.h"

int main(int ac, char * av[])
try
{
    using namespace std;

    if ( ac < 2 ) return 0;

    cout << "Enter type of hash for the database (wrd,md5,sh1,s22,s23,s25,r16,wpl,s3x): ";

    string hashType;
    getline(cin, hashType);

    string hlongName;

    {
        db::Dn * r = db::Dn::create(hashType, "", true);
        if (!r)
        {
            cout << "Cannot create Dn of type [" << hashType << "]\n";
            return 1;
        }

        hlongName = r->hashNameLong();
    }

    cout << "Enter long name for hash (" << hlongName << "): ";
    string longName;
    getline(cin, longName);
    if ( longName.empty() ) longName = hlongName;

    cout << "Enter unique name for the database (" << hashType << "): ";
    string uniqueName;
    getline(cin, uniqueName);
    if ( uniqueName.empty() ) uniqueName = hashType;

    cout << "Enter magic string: ";
    string magic;
    getline(cin, magic);

    cout << "Enter number of G (1): ";
    string snG;
    getline(cin, snG);
    if ( snG.empty() ) snG = "1";
    int nG = gl::toi( snG.c_str() );

    cout << "Enter slice size in Kb (100): ";
    string s_sliceSize;
    getline(cin, s_sliceSize);
    if ( s_sliceSize.empty() ) s_sliceSize = "100";
    int i_sliceSize = gl::toi( s_sliceSize.c_str() );

    cout << "Enter database thinness (0): ";
    string s_thin;
    getline(cin, s_thin);
    if ( s_thin.empty() ) s_thin = "0";
    int i_thin = gl::toi( s_thin.c_str() );

    cout << "Enter data size [-1 unlimited, suffix: b,K,M,H] (5H): ";
    string s_limit;
    getline(cin, s_limit);
    if ( s_limit.empty() ) s_limit = "5H";

    // now calculate alternative name
    string alt = gl::tos(nG) + magic + hashType;
    db::Dn * dn = db::Dn::create(hashType, alt, true);
    alt = dn->str();
    delete dn;

    const bool ASKD = false;

    db::DbCfg dbcfg;
    if (ASKD) cout << "Enter slice directory (" << dbcfg.dir_slice.str() << "): ";
    string dir_slice;
    if (ASKD) getline(cin, dir_slice);
    if ( !dir_slice.empty() ) dbcfg.dir_slice = dir_slice;

    if (ASKD) cout << "Enter index directory (" << dbcfg.dir_index.str() << "): ";
    string dir_index;
    if (ASKD) getline(cin, dir_index);
    if ( !dir_index.empty() ) dbcfg.dir_index = dir_index;


    cout << "\n\nSlice dir    :   " << dbcfg.dir_slice.str() << '\n';
    cout << "Index dir    :   " << dbcfg.dir_index.str() << '\n';

    cout << "Hash type    :   " << hashType << '\n';
    cout << "Long name    :   " << longName << '\n';
    cout << "Unique name  :   " << uniqueName << '\n';
    cout << "Magic        :   [" << magic << "]\n";
    cout << "Number of G  :   " << nG << "\n";
    cout << "Slice size   :   " << i_sliceSize << " Kb\n";
    cout << "Thinness     :   " << i_thin << "\n";
    cout << "Data limit   :   " << s_limit << "\n";
    cout << "Alt name     :   [" << alt << "]\n";

    cout << "\nIs the above values correct? (y):";
    string yn;
    getline(cin, yn);
    if ( yn.empty() ) yn = "y";
    if ( yn != "y" )
    {
        cout << "No config is created. Bye!\n";
        return 0;
    }

    db::Database db(dbcfg);

    db::Traits traits(db, uniqueName, hashType,
                      longName, nG, magic, i_sliceSize, i_thin, s_limit );

    traits.save();

    cout << "File created\n";

    return 0;
}

catch (gl::Exception e)
{
    std::cout << "Error: " << e.str() << '\n';
}
