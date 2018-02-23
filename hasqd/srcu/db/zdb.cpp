// Hasq Technology Pty Ltd (C) 2013-2015

#include <cstdlib>
#include <iostream>
#include <vector>
#include <sstream>

const bool SHOW_TIME = false;

#include "gl_except.h"
#include "gl_utils.h"

#include "os_timer.h"

#include "hq_db.h"


using std::cout;

typedef std::vector<string> vs;

void cmd_help(vs cmd)
{
    cout << "Conventions:\n";
    cout << "  <> - choice of options or verbatim\n";
    cout << "  | - options delimiter\n";
    cout << "  {} - optional command element\n";
    cout << "Commands:\n";
    cout << "  create <dirname> <hashNameShort> <fullName> <nG> <[magic]> <sliceKb> 0 <dataSize> - create database on disk\n";
    cout << "  addpwd <dirname> <N|N1:N2> <rawDn|rawDn:X1:X2> <password> {data} - add record(s) to database\n";
    cout << "  addurf <dirname|(<hashNameShort>,<nG>{,magic})> <N> <hashDn|[rawDn]{X1:X2}> <hashKey|[pwdKey]{nRnd}{:nKeys}> {data} - add record to database\n";
    cout << "  add <record> - add verbatim record to database\n";
    cout << "  recprn - same as addpwd except it only prints record and does not add\n";
    cout << "  nsk <hashType> <N> <S> <K> {magic} - calc and print hash from NSK\n";
    cout << "  hash <hashType> <arg1 {arg2 ... }> - calc and print hash from a list of printable words\n";
    cout << "  load - make database in memory and load from disk\n";
    cout << "  drop - delete database from memory\n";
    cout << "  erasedisk - delete index and slice directories from disk\n";
    cout << "  quit\n";
    cout << "  set date <yyyymmdd>\n";
    cout << "  set time <hhmmss>\n";
    cout << "  set base <dir> - set base directory for database\n";
    cout << "  set cfg slice <dir>\n";
    cout << "  set cfg index <dir>\n";
    cout << "  set cfg meta <subdir>\n";

    cout << "  getlast <dirname> <rawDn> - read last record\n";
    cout << "  getfirst <dirname> <rawDn> - read first record\n";
    cout << "  getrecord <dirname> <rawDn> <rec_number> - read one record\n";
    cout << "  getrange <dirname> <rawDn> <from_rec_number> <to_rec_number> <limit> - read range of records\n";

    cout << "  getlastdata <dirname> <rawDn> <from> <max> - read last available data\n";

    cout << "  genidx <slice_dir_in> <index_dir_out> - generate db index from slices\n";

    cout << "  irgetlast <index_file_name initial_rdbuf_size> - read last record (low level testing)\n";
    cout << "  irgetrecord <index_file_name> <rec_number> - read one record (low level testing)\n";
    cout << "  irgetrange <index_file_name> <from_rec_number> <to_rec_number> <limit> - read range of records (low level testing)\n";
    cout << "  irdirect <index_file_name> <function_and_args> - directly call index reader's function (low level testing)\n";
    cout << "      where <function_and_args> := <last|rec N|range N1 N2 max|rpos N1 N2|fN|lN>\n";

    cout << "  q - quit\n";
}

void cmd_create(vs cmd);
void cmd_load(vs cmd);
void cmd_drop(vs cmd);
void cmd_erase(vs cmd);
void cmd_addpwd(vs cmd);
void cmd_addurf(vs cmd);
void cmd_recprn(vs cmd);
void cmd_set(vs cmd);
void cmd_nsk(vs cmd);
void cmd_hash(vs cmd);

void cmd_irgetlast(vs cmd);
void cmd_irgetrecord(vs cmd);
void cmd_irgetrange(vs cmd);

void cmd_getlast(vs cmd);
void cmd_getfirst(vs cmd);
void cmd_getrecord(vs cmd);
void cmd_getrange(vs cmd);

void cmd_getlastdata(vs cmd);

void cmd_genidx(vs cmd);
void cmd_add(vs cmd, const string & line);

db::Database * database = 0;
db::DbCfg config;

int main(int ac, char * av[])
try
{
    TRACE0

    er::enumerate_codes();

    std::istream * in = &std::cin;
    if ( ac > 1 )
    {
        string s;
        for ( int i = 1; i < ac; i++ )
            s += string(av[i]) + '\n';
        in = new std::istringstream(s);
    }

    while (*in)
        try
        {
            try
            {
                os::Timer t;
                string line;
                cout << "";
                std::getline(*in, line);
                vs toks = gl::tokenise(line);
                if ( toks.empty() )
                    continue;
                if ( toks[0] == "#" )
                    continue;

                if ( toks[0] == "help" )
                {
                    cmd_help(toks);
                    continue;
                }

                cout << "<zdb> " << line << '\n';

                t.set(0);

                if ( toks[0] == "create" )
                    cmd_create(toks);

                else if ( toks[0] == "load" )
                    cmd_load(toks);
                else if ( toks[0] == "drop" )
                    cmd_drop(toks);
                else if ( toks[0] == "addpwd" )
                    cmd_addpwd(toks);
                else if ( toks[0] == "addurf" )
                    cmd_addurf(toks);
                else if ( toks[0] == "add" )
                    cmd_add(toks, line);
                else if ( toks[0] == "recprn" )
                    cmd_recprn(toks);
                else if ( toks[0] == "erasedisk" )
                    cmd_erase(toks);
                else if ( toks[0] == "set" )
                    cmd_set(toks);
                else if ( toks[0] == "nsk" )
                    cmd_nsk(toks);
                else if ( toks[0] == "hash" )
                    cmd_hash(toks);

                else if ( toks[0] == "irgetlast" )
                    cmd_irgetlast(toks);
                else if ( toks[0] == "irgetrecord" )
                    cmd_irgetrecord(toks);
                else if ( toks[0] == "irgetrange" )
                    cmd_irgetrange(toks);

                else if ( toks[0] == "getlast" )
                    cmd_getlast(toks);
                else if ( toks[0] == "getfirst" )
                    cmd_getfirst(toks);
                else if ( toks[0] == "getrecord" )
                    cmd_getrecord(toks);
                else if ( toks[0] == "getrange" )
                    cmd_getrange(toks);

                else if ( toks[0] == "getlastdata" )
                    cmd_getlastdata(toks);

                else if ( toks[0] == "genidx" )
                    cmd_genidx(toks);

                else if ( toks[0] == "quit" )
                    return 1;
                else if ( toks[0] == "q" )
                    return 1;
                else
                    cout << "unknown command [" << toks[0] << "]\n";

                if (SHOW_TIME) cout << "Execution time: " << t.get() << "ms\n";
            }
            catch (...)
            {
                delete database;
                database = 0;
                throw;
            }
        }
        catch (gl::Exception e)
        {
            cout << "Fatal error (gl::Exception): " << e.str() << '\n';
        }
        catch (const char * e) { cout << "Fatal error (char*): " << e << '\n'; }
        catch (string * e) { cout << "Fatal error (string): " << e << '\n'; }

    if ( in != &std::cin ) delete in;

}
catch (gl::Exception e)
{
    cout << "Error: " << e.str() << '\n';
    return 1;
}
catch (...)
{
    cout << "Unknwon error\n";
    return 2;
}

void cmd_create(vs cmd)
{
    if ( cmd.size() < 8 )
    {
        cout << "command format: uN sN fN nG mag size thin ds\n";
        return;
    }

    string uN = cmd[1];
    string sN = cmd[2];
    string fN = cmd[3];
    int nG = gl::toi(cmd[4].c_str());
    string mag = cmd[5]; mag = mag.substr(1, mag.size() - 2);
    int sz = gl::toi(cmd[6].c_str());
    int th = gl::toi(cmd[7].c_str());

    string ds = "-1";

    if ( cmd.size() == 9 ) ds = cmd[8];

    db::Database db(config);

    db::Traits tr(db, uN, sN, fN, nG, mag, sz, th, ds);

    tr.save();

}

void cmd_addpwd(vs cmd)
{
    if ( cmd.size() < 5 )
    {
        cout << "command format: uN N rawDn password [data]\n";
        return;
    }

    gl::intint N1, N2;

    string s = cmd[2];
    string::size_type i0 = s.find(":");
    if ( i0 == string::npos ) N1 = N2 = gl::toii(s);
    else
    {
        N1 = gl::toii(s.substr(0, i0));
        N2 = gl::toii(s.substr(i0 + 1));
    }

    string rDn = cmd[3];
    s = cmd[3];
    int dni1 = -1, dni2 = -1;
    string::size_type i1 = s.find(":");
    string::size_type i2 = s.find(":", i1 + 1);
    if ( i1 != string::npos && i2 != string::npos )
    {
        rDn = s.substr(0, i1);
        dni1 = gl::toi(s.substr(i1 + 1, i2 - i1));
        dni2 = gl::toi(s.substr(i2 + 1));
    }

    string uN = cmd[1];
    string pwd = cmd[4];

    if ( !database )
        throw "Database does not exist";

    string data;

    if ( cmd.size() > 5 )
    {
        data = cmd[5];
        for ( unsigned int i = 6; i < cmd.size(); i++ )
        {
            data.append(" ");
            data.append(cmd[i]);
        }
    }

    er::Code r = er::OK;
    for ( gl::intint j = N1; j <= N2; j++ )
    {
        for ( int k = dni1; k <= dni2; k++ )
        {
            string krDn = rDn;
            if ( k >= 0 ) krDn += gl::tos(k);

            if ( j == 0 )
                r = database->addRecordURF(uN, j, "[" + krDn + "]", "0 [" + pwd + "] " + data);
            else
                r = database->addRecordURF(uN, j, "[" + krDn + "]", "[" + pwd + "] " + data);
            if ( r )
                cout << "Adding record error: " << r.str() << "\n";
        }
    }
}

void cmd_addurf(vs cmd)
{
    string uNorT, hashOrRawDn, keysAndData, kDn, s;
    gl::intint N;
    int dni1, dni2;
    string::size_type pos1, pos2;

    if ( cmd.size() < 5 )
    {
        cout << "see help for command format\n";
        return;
    }

    if ( !database )
        throw "Database does not exist";

    uNorT = cmd[1];

    N = gl::toii(cmd[2]);

    s = cmd[3];
    dni1 = dni2 = -1;
    if ( s[0] == '[' )
    {
        pos1 = s.find("]");
        if ( pos1 == s.npos )
            return;
        hashOrRawDn = s.substr(0, pos1);
        pos2 = s.find_first_of(':', ++pos1);
        if ( pos2 != s.npos )
        {
            dni1 = gl::toi(s.substr(pos1, pos2 - pos1));
            dni2 = gl::toi(s.substr(pos2 + 1));
        }
    }
    else
        hashOrRawDn = cmd[3];

    for ( unsigned int i = 4; i < cmd.size(); i++ )
    {
        keysAndData.append(" ");
        keysAndData.append(cmd[i]);
    }

    for ( int k = dni1; k <= dni2; k++ )
    {
        kDn = hashOrRawDn;
        if ( k >= 0 )
            kDn += gl::tos(k);
        if ( hashOrRawDn[0] == '[' )
            kDn += ']';
        er::Code r = database->addRecordURF(uNorT, N, kDn, keysAndData);
        if ( r )
            cout << "Adding URF record error: " << r.str() << "\n";
    }
}

void cmd_recprn(vs cmd)
{
    if ( cmd.size() < 5 )
        throw "command format: uN N rawDn password [data]";

    string uN = cmd[1];
    gl::intint N = gl::toii(cmd[2]);
    string rDn = cmd[3];
    string pwd = cmd[4];

    if ( !database )
        throw "Database does not exist";

    string data;

    if ( cmd.size() > 5 )
    {
        data = cmd[5];
        for ( unsigned int i = 6; i < cmd.size(); i++ )
        {
            data.append(" ");
            data.append(cmd[i]);
        }
    }

    string rc = database->makeFromPasswdStr(uN, N, rDn, pwd, data);

    if ( !rc.empty() )
        cout << rc << '\n';
    else
        cout << "Failed to create record ( uN:" << uN << ", N:" << N
             << ", Dn:" << rDn << ", Pwd:" << pwd << ", Data:" << data << " )\n";
}

void cmd_load(vs cmd)
{
    if ( database )
        throw "Database exists";

    delete database;
    database = new db::Database(config);

    er::Code r = database->initFromDisk();

    if (r)
        cout << "Error loading Database: " << r.str() << '\n';
}

void cmd_drop(vs cmd)
{
    if ( !database )
        throw "Database does not exist";

    delete database;
    database = 0;
}

void cmd_erase(vs cmd)
{
    db::Database db(config);

    bool r = db.eraseDisk();
    if ( r )
        cout << "Database on disk erased successfully\n";
    else
        cout << "Error while removing database on disk\n";
}

void cmd_set_cfg(vs cmd)
{
    throw "not implemented";
}

void cmd_set_date(vs cmd)
{
    if ( cmd.size() != 3 ) throw "Bad set date command";
    os::Timer::setGmd(cmd[2]);
}

void cmd_set_time(vs cmd)
{
    if ( cmd.size() != 3 ) throw "Bad set time command";
    os::Timer::setHms(cmd[2]);
}

void cmd_set_base(vs cmd)
{
    if ( cmd.size() != 3 ) throw "Bad set base command";
    config.addBase(cmd[2]);
}

void cmd_set(vs cmd)
{
    if ( cmd.size() < 3 ) throw "Bad command";
    if ( cmd[1] == "cfg" ) return cmd_set_cfg(cmd);
    if ( cmd[1] == "base" ) return cmd_set_base(cmd);
    if ( cmd[1] == "date" ) return cmd_set_date(cmd);
    if ( cmd[1] == "time" ) return cmd_set_time(cmd);
    throw "Bad argument";
}

void cmd_nsk(vs cmd)
{
    string mag;
    if ( cmd.size() == 6 ) mag = cmd[5];
    else if ( cmd.size() != 5 )
        throw "command format: sN N S K\n";

    string nsk = cmd[2] + " " + cmd[3] + " " + cmd[4];

    if ( !mag.empty() ) nsk += " " + mag;

    string sN = cmd[1];

    db::Dn * dn = db::Dn::create(sN, nsk, true);
    if ( !dn ) throw "Cannot create Dn for " + sN;

    cout << dn->str() << '\n';
}

void cmd_hash(vs cmd)
{
    if ( cmd.size() < 3 )
        throw "command format: sN arg1 [arg2] [arg3] ...\n";

    string s = cmd[2];
    for ( size_t i = 3; i < cmd.size(); i++ )
        s += " " + cmd[i];

    string sN = cmd[1];

    db::Dn * dn = db::Dn::create(sN, s, true);
    if ( !dn ) throw "Cannot create Dn for " + sN;

    cout << dn->str() << '\n';
}

void cmd_irgetlast(vs cmd)
{
    if ( cmd.size() != 3 )
        throw "command format: irgetlast index_file_name initial_rdbuf_size";

    db::IndexReader * ir = new db::IndexReader(cmd[1], gl::toii(cmd[2]));
    const char    *   data;
    er::CodeType      code = ir->accessLast(data);

    if ( code == er::OK ) cout << data << "\n";
    else cout << "irgetlast error\n";

    delete ir;
}

void cmd_irgetrecord(vs cmd)
{
    if ( cmd.size() != 3 )
        throw "command format: irgetrecord index_file_name rec_number";

    db::IndexReader * ir = new db::IndexReader(cmd[1], 100);
    const char    *   data;
    er::CodeType      code = ir->accessRecord(gl::toii(cmd[2]), data);

    if ( code == er::OK ) cout << data << "\n";
    else cout << "irgetrecord error\n";

    delete ir;
}

void cmd_irgetrange(vs cmd)
{
    if ( cmd.size() != 5 )
        throw "command format: irgetrange index_file_name from_rec_number to_rec_number limit";

    db::IndexReader * ir = new db::IndexReader(cmd[1], 100);
    const char    *   data = 0;
    gl::intint        count, would_be_count;
    er::CodeType      code = ir->accessRange(gl::toii(cmd[2]), gl::toii(cmd[3]), gl::toii(cmd[4]),
                             would_be_count, data, count);

    cout << "Unrestricted: " << would_be_count << ", restricted: " << count << "\n";
    if ( code == er::OK )
    {
        if (data) cout << data << "\n";
    }
    else if ( code == er::IDX_HIGH ) cout << "INDEX_TOO_HIGH\n";
    else if ( code == er::NO_RECS ) cout << "NO_RECORDS_IN_RANGE\n";
    else if ( code == er::IDX_NEG ) cout << "INDEX_NEGATIVE\n";
    else if ( code == er::BAD_RANGE ) cout << "BAD_RANGE\n";
    else cout << "irgetrange error\n";

    delete ir;
}

void cmd_getlast(vs cmd)
{
    if ( cmd.size() != 3 )
        throw "command format: getlast dirname rawDn";

    if ( !database )
        throw "Database does not exist";

    string last;

    if ( database->getLastRaw(cmd[1], cmd[2], last) == er::OK )
        cout << last << "\n";
    else cout << "getlast error\n";
}

void cmd_getfirst(vs cmd)
{
    if ( cmd.size() != 3 )
        throw "command format: getfirst dirname rawDn";

    if ( !database )
        throw "Database does not exist";

    string first;

    if ( database->getFirstRaw(cmd[1], cmd[2], first) == er::OK )
        cout << first << "\n";
    else cout << "getfirst error\n";
}

void cmd_getrecord(vs cmd)
{
    if ( cmd.size() != 4 )
        throw "command format: getrecord dirname rawDn rec_number";

    if ( !database )
        throw "Database does not exist";

    string rec;

    if ( database->getRecordRaw(cmd[1], cmd[2], gl::toii(cmd[3]), rec) == er::OK )
        cout << rec << "\n";
    else cout << "getrecord error\n";
}

void cmd_getrange(vs cmd)
{
    if ( cmd.size() != 6 )
        throw "command format: getrange dirname rawDn from_rec_number to_rec_number limit";

    if ( !database )
        throw "Database does not exist";

    string recs;
    gl::intint wbc;

    if ( database->getRangeRaw(cmd[1], cmd[2], gl::toii(cmd[3]), gl::toii(cmd[4]), gl::toii(cmd[5]), wbc, recs) == er::OK )
        cout << recs;
    else cout << "getrange error\n";
}

void cmd_getlastdata(vs cmd)
{
    if ( cmd.size() != 5 )
        throw "command format: getlastdata dirname rawDn from max";

    if ( !database )
        throw "Database does not exist";

    string data;

    if ( database->getLastDataRaw(cmd[1], cmd[2], gl::toii(cmd[3]), gl::toi(cmd[4]), data) == er::OK )
        cout << data << "\n";
    else cout << "getlastdata error\n";
}

void cmd_genidx(vs cmd)
{
    if ( cmd.size() != 3 )
        throw "command format: genidx slice_dir_in index_dir_out";

    db::IndexGenerator ig;
    er::CodeType code = ig.generate(cmd[1], cmd[2]);

    if ( code == er::OK ) cout << "index successfully generated" << "\n";
    else cout << "genidx error\n";

}

void cmd_add(vs cmd, const string & line)
{
    if ( cmd.size() < 3 ) return;

    if ( !database )
        throw "Database does not exist";

    er::Code r = er::OK;

    string hashtype = cmd[1];

    int dbIndex = database->getDbIndex(hashtype);
    if ( dbIndex < 0 )
    {
        r = er::REQ_HASHTYPE_BAD;
        goto end;
    }

    hashtype = database->getTraits(dbIndex)->sn();

    {
        db::Record * rec = db::Record::create(hashtype);
        if ( !rec ) goto end;

        {
            gl::Remover<db::Record> rec_rem(rec);

            string str;
            for ( size_t i = 2; i < cmd.size(); i++ )
                str += " " + cmd[i];

            r = rec->init(str, database->getTraits(dbIndex)->nG());
            if ( r ) goto end;
            r = database->addRecord(dbIndex, *rec);
        }
    }

end:
    if ( r )
        cout << "Adding record error: " << r.str() << "\n";
}
