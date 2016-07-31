// Hasq Technology Pty Ltd (C) 2013-2016

#include <fstream>
#include <sstream>
#include <map>
#include <set>

#include "gl_utils.h"
#include "gl_protocol.h"
#include "gl_token.h"

#include "os_timer.h"
#include "os_exec.h"
#include "sg_cout.h"
#include "sg_client.h"

#include "hq_logger.h"

#include "hq_agent.h"
#include "hq_globalspace.h"

bool Agent::validCmd(string c)
{
    if ( c == "config" || c == "cf" ) return true;
    if ( c == "filesys" || c == "fs" ) return true;
    if ( c == "download" || c == "dl" ) return true;
    if ( c == "build" || c == "bd" ) return true;
    if ( c == "validate" || c == "vd" ) return true;
    if ( c == "report" || c == "re" ) return true;
    if ( c == "sort" ) return true;
    return false;
}

bool Agent::sub3Cmd(string c) { return ( c == "download" || c == "dl" ); }
bool Agent::sub2Cmd(string c)
{
    return ( c == "config" || c == "cf" || c == "filesys" || c == "fs"
             || c == "validate" || c == "vd" || sub3Cmd(c) );
}

void Agent::print(const string & s, bool cmd) const
{
    string pf;
    if ( cmd ) pf = "# ";

    if ( gs->config->dbg.agt )
    {
        os::Cout out;
        out << os::prmpt("agt", gs->config->dbg.id) << pf << s << os::endl;
    }

    string ts = os::Timer::getHms() + " " + pf + s;

    if ( !logfile.empty() )
    {
        std::ofstream of(logfile.c_str(), std::ios::app | std::ios::binary);
        of << ts << '\n';
    }

    gs->logger.add(Logger::Agent, ts );
}

void Agent::run(string cmd1, string cmd2, string cmd3, const vecstr & args)
{
    as =  args;

    if ( gs->config->dbg.agt )
    {
        string s = cmd1;
        s += (cmd2.empty() ? "" : " " + cmd2);
        s += (cmd3.empty() ? "" : " " + cmd3);

        for ( size_t i = 0; i < as.size(); i++ )
            s += " " + as[i];

        print(s, true);
    }

    try
    {
        if (false);
        else if ( cmd1 == "config"   || cmd1 == "cf")  config(cmd2);
        else if ( cmd1 == "filesys"  || cmd1 == "fs" ) filesys(cmd2);
        else if ( cmd1 == "download" || cmd1 == "dl" ) download(cmd2, cmd3);
        else if ( cmd1 == "build"    || cmd1 == "bd")  build();
        else if ( cmd1 == "validate" || cmd1 == "vd")  validate(cmd2);
        else if ( cmd1 == "report" || cmd1 == "re")  report();
        else if ( cmd1 == "sort" )  sorti();
        else throw gl::ex("Agent bad command: " + cmd1);
    }
    catch (gl::ex e)
    {
        print("Error: " + e.str());
        throw;
    }
}


void Agent::config(const string & s)
{
    if ( as.size() > 1 ) throw gl::ex("Agent too many arguments");

    string val;
    if ( !as.empty() ) val = as[0];

    if (false);
    else if ( s == "logfile"  || s == "lf" ) setshow(logfile, val);
    else if ( s == "webpath"  || s == "wp" ) setshow(webpath, val);
    ///else if ( s == "protocol" || s == "pr" ) setshow_prot(val);
    else if ( s == "database" || s == "db" ) setshow(database, val);
    else if ( s == "logcomm"  || s == "lc" ) setshow(logcomm, val);
    else throw gl::ex("Agent bad command: " + s);
}

void Agent::setshow(string & k, const string & v) const
{
    if ( v.empty() ) print(k);
    else k = v;
}

void Agent::filesys(const string & s)
{
    if ( s == "mk" )
    {
        if ( as.size() != 1 ) throw gl::ex("Agent mk needs 1 argument");
        if ( os::FileSys::trymkdir(as[0]).isdir() ) print(er::Code(er::OK));
        else print(er::Code(er::FILE_CANT_CREATE));
        return;
    }

    if ( s == "rm" )
    {
        if ( as.size() != 1 ) throw gl::ex("Agent rm needs 1 argument");
        if ( os::FileSys::erase(as[0]) ) print(er::Code(er::OK));
        else print(er::Code(er::REQ_PATH_BAD));
        return;
    }

    if ( s == "mv" )
    {
        if ( as.size() != 2 ) throw gl::ex("Agent mv needs 2 arguments");
        if ( os::rename(as[0], as[1]) ) print(er::Code(er::OK));
        else print(er::Code(er::FILE_CANT_CREATE));
        return;
    }

    if ( s == "cp" )
    {
        if ( as.size() != 2 ) throw gl::ex("Agent cp needs 2 arguments");
        string file = gl::file2str(as[0]);
        if ( file.empty() ) return print(er::Code(er::REQ_PATH_BAD));
        std::ofstream of(as[1].c_str(), std::ios::binary);
        if ( !of ) print("Cannot open file " + as[1]);
        of << file;
        return print(string(er::Code(er::OK)) + " " + gl::tos(file.size()));
    }

    if ( s == "cat" )
    {
        if ( as.size() != 1 ) throw gl::ex("Agent cat needs 1 argument");
        string file = gl::file2str(as[0]);
        return print(as[0] + '\n' + file);
    }

    throw gl::ex("Bad filesys command: " + s);
}

string Agent::fetch(const string & srv, const string & cmd)
{
    sgl::Client x(gs->netenv.link(srv) );

    string r;
    if ( x.isok() )
    {
        r = x.ask(cmd);
        if ( islogc('c') )
            print("[" + cmd + "] -> {"
                  + (r.size() < 20 ? r : (r.substr(0, 15) + "...")) + "}");
    }
    else
    {
        string e = "Server failed: " + srv;
	print("[" + cmd + "] "+ e);
    }

    return r;
}

void Agent::translateDate(string & s) const
{
    string today = os::Timer::getGmd();
    if ( s == "today" ) s = today;
    if ( s.size() == 6 ) s = "20" + s;
}

void Agent::downlast(const string & srv, string num, string slice)
{
    size_t i = slice.find("-");
    if ( i == string::npos ) throw gl::ex("Bad returned slice name [$1]", slice);

    os::Path dir(as[0]);

    int n = gl::toi(slice.substr(i + 1));
    int k = gl::toi(num);
    int b = n + 1 - k;
    if ( b < 1 ) b = 1;

    for ( int j = b; j <= n; j++ )
    {
        string file = slice.substr(0, i + 1) + gl::tos(j);
        ///os::Cout() << "DOWNLAST s: " << file << '\n';
        string sget = "slice " + database + " get " + file;
        saveSlice((dir + file).str(), fetch(srv, sget));
    }

    ///os::Cout() << "DOWNLAST " << num << ' ' << n << '\n';
}

void Agent::download(const string & srv, const string & date)
{
    if ( database.empty() )
        return print("Database is not set - try 'agent config database'");

    if ( as.size() < 1 || as[0].empty() )
        return print("Too few arguments");

    os::Path dir(as[0]);
    if ( !dir.isdir() )
        return print("Directory does not exist [" + dir.str() + "]");

    ///os::Cout() << "DOWNLOAD " << srv << ' ' << date << ' ' << dir.str() << '\n';

    string s = fetch(srv, "slice " + database);
    if ( s.size() < 4 || s.substr(0, 2) != "OK" )
        return print("Database " + database + " is not present on " + srv);

    string cur_slice = s.substr(3);

    if ( date.empty() ) throw gl::Never("bad date");

    string date_fr, date_to; // 8 digit dates

    date_fr = date_to = date;

    size_t i = date.find(":");
    if ( i != string::npos )
    {
        date_fr = date.substr(0, i);
        date_to = date.substr(i + 1);
    }

    translateDate(date_fr);
    translateDate(date_to);

    if ( date_fr.size() < 6 ) // "today" has been translated
        return downlast(srv, date_fr, cur_slice);

    string cur_date = date_fr;
    int n = 1;

    while (1)
    {
        string file = cur_date + "-" + gl::tos(n);
        string schk = "slice " + database + " check " + file;
        string sget = "slice " + database + " get " + file;

        s = fetch(srv, schk);

        if ( s != "OK" )
        {
            cur_date = gl::nextDay(cur_date);
            if ( cur_date > date_to ) break;
            n = 1;
            continue;
        }

        s = fetch(srv, sget);
        saveSlice((dir + file).str(), s);

        n++;
    }

    ///os::Cout() << "DOWNLOAD " << cur_slice << ' ' << date_fr << ' ' << date_to << '\n';
}

void Agent::saveSlice(const string & file, const string & data)
{
    std::ofstream of(file.c_str(), std::ios::binary);

    if ( !of )
        throw gl::ex("cannot open $1 for writing", file);

    of << data;
}

void Agent::build()
{
    if ( as.size() != 4 ) throw gl::ex("Agent build requires 4 arguments");

    string outFile = as[2];
    os::Path ouDir(as[1]);
    os::Path inDir(as[0]);

    if ( !ouDir.isdir() ) return print("Directory " + ouDir.str() + " not accessible");
    if ( !inDir.isdir() ) return print("Directory " + inDir.str() + " not accessible");

    vecstr srvs = gl::tokenise(as[3]);

    // validate and convert self
    for ( size_t i = 0; i < srvs.size(); i++ )
    {
        string & s = srvs[i];

        if ( s == "self" ) s = gs->config->seIpLink.str();

        if ( s.find(":") == string::npos )
            throw gl::ex("Bad address $1, expecting ip:port", s);

        bool ok = false;
        os::IpAddr p(s, ok);

        if (!ok)
            throw gl::ex("Address $1 does not DNS resolve", s);
    }

    // build index directory
    os::Dir dir = os::FileSys::readDirEx(inDir, true, true);
    for ( size_t i = 0; i < dir.files.size(); i++ )
    {
        string file = dir.files[i].first;
        std::ifstream in((inDir + file).str().c_str());
        for ( string line; std::getline(in, line); )
        {
            std::istringstream is(line);
            string dn; is >> dn >> dn;

            string sof = (ouDir + dn).str();
            std::ofstream of(sof.c_str(), std::ios::app | std::ios::binary);
            of << line << '\n';
        }
    }

    // build list
    std::ofstream oflist(outFile.c_str(), std::ios::binary);
    dir = os::FileSys::readDirEx(ouDir, true, true);

    for ( size_t i = 0; i < dir.files.size(); i++ )
    {
        string file = dir.files[i].first;
        std::ifstream in((ouDir + file).str().c_str());

        string last, sn;
        for ( string line; std::getline(in, line); )
        {
            std::istringstream is(line);
            string dn; is >> sn >> dn;

            if ( dn != file ) { last = ""; break; }
            last = dn;
        }

        if ( last.empty() ) continue;

        oflist << sn << ' ' << last;

        for ( size_t j = 0; j < srvs.size(); j++ ) oflist << ' ' << srvs[j];

        oflist << '\n';
    }

    ///os::Cout() << "LIST " << inDir.str() << ' ' << ouDir.str() << ' ' << outFile << '\n';
}


void Agent::validate(const string & cmd)
{

    if ( cmd == "check" )
    {
        if ( as.size() != 2 ) \
            throw gl::ex("Agent check requires 2 arguments");
    }
    else if ( cmd == "notify" )
    {
        if ( as.size() != 2 )
            throw gl::ex("Agent notify requires 2 arguments");
    }
    else if ( cmd == "push" )
    {
        if ( as.size() != 3 )
            throw gl::ex("Agent push requires 3 arguments");
    }
    else
        return print("Agent validate unexpected command: " + cmd);

    if ( database.empty() )
        return print("Database is not set - try 'agent config database'");


    string inFile = as[0];
    string ouFile = as[1];

    std::ifstream in(inFile.c_str());
    if ( !in) return print("Cannot open file " + inFile);

    std::ofstream of(ouFile.c_str());
    if ( !of) return print("Cannot open file " + ouFile);

    for ( string line; std::getline(in, line); )
    {
        vecstr vs = gl::tokenise(line);
        if ( vs.size() < 3 ) continue;
        gl::intint ni = gl::toii(vs[0]);
        string dn = vs[1];
        vs.erase(vs.begin());
        vs.erase(vs.begin());

        std::vector<gl::intint> vi = enquire(dn, vs);

        for ( size_t i = 0; i < vi.size(); i++ ) if (ni < vi[i]) ni = vi[i];

        if ( vi.size() != vs.size() ) throw gl::Never("bad enquire");

        bool cool = true;

        for ( size_t i = 0; i < vs.size(); i++ )
        {
            if ( vi[i] < ni )
            {
                if (cool) { cool = false; of << ni << ' ' << dn; }
                of << ' ' << vs[i];
                dragging(cmd, dn, vs[i], vi[i], ni);
            }
        }

        if (!cool) of << '\n';

        ///os::Cout() << "VALIDATE " << gl::tos(ni) << ' ' << dn << '\n';
    }


    ///os::Cout() << "VALIDATE " << inFile << ' ' << ouFile << '\n';
}

std::vector<gl::intint> Agent::enquire(const string & dn, const vecstr & srvs)
{
    std::vector<gl::intint> r;
    for ( size_t i = 0; i < srvs.size(); i++ )
    {
        string cmd = "last " + database + " " + dn;
        string data = fetch(srvs[i], cmd);

        gl::intint rr = -1ll;
        if ( !data.empty() )
        {
            std::istringstream is(data);
            string s;

            is >> s;
            if ( s == er::Code(er::IDX_NODN).str() ) goto done;
            if ( !is || s != "OK" ) goto bad;

            is >> s;  if ( !is ) goto bad;
            gl::intint x = gl::toii(s);

            is >> s;  if ( !is || s != dn ) goto bad;
            rr = x;

            goto done;
        }
bad:
        print("Server " + srvs[i] + " returned unexpected data [" + data + "]");
done:
        r.push_back(rr);

        ///os::Cout() << "ENQUIRE " << gl::tos(rr) << ' ' << data << '\n';
    }

    return r;
}

void Agent::report()
{
    if ( as.size() != 1 ) throw gl::ex("Agent report requires 1 argument");

    std::set<string> dns;
    std::set<string> svs;

    std::ifstream in(as[0].c_str());

    for ( string line; std::getline(in, line); )
    {
        vecstr vs = gl::tokenise(line);
        if ( vs.size() < 3 ) continue;
        string dn = vs[1];
        vs.erase(vs.begin());
        vs.erase(vs.begin());

        dns.insert(dn);

        for ( size_t i = 0; i < vs.size(); i++ )
            svs.insert(vs[i]);
    }

    if ( dns.empty() && svs.empty() )
    {
        print("OK");
        return;
    }

    string r = gl::tos(dns.size()) + " DNs out-of-sync on:";

    for ( std::set<string>::const_iterator i = svs.begin(); i != svs.end(); i++ )
        r += " " + *i;

    print(r);
}

void Agent::dragging(string sub, string dn, string srv, gl::intint srvN, gl::intint maxN)
{
    if ( islogc('d') )
        print("Server " + srv + " drags on " + dn + " with "
              + gl::tos(srvN) + ", needs " + gl::tos(maxN));

    if ( sub == "check" ) return;

    if ( sub == "notify" )
    {
        string cmd = "note " + database + " " + gl::tos(maxN) + " " + dn;
        string data = fetch(srv, cmd);

        if ( data.size() < 2 || data.substr(0, 2) != "OK" )
            print("Server " + srv + " on 'note' replied [" + data + "]");

        return;
    }

    if ( sub != "push" || as.size() != 3 ) throw gl::Never("Bad subcommand");

    string dirI = as[2];

    os::Path dir(dirI);
    if ( !dir.isdir() )
        throw gl::ex("Directory $1 is not accessible", dirI);

    string filename = (dir + dn).str();
    std::ifstream in( filename.c_str() );

    if ( !in )
        return print("Cannot open file " + filename);

    for ( string line; std::getline(in, line); )
    {
        vecstr vs = gl::tokenise(line);
        if ( vs.size() < 3 ) continue;
        gl::intint ni = gl::toii(vs[0]);
        string fdn = vs[1];

        if ( dn != vs[1] )
            return print("File corrupted " + filename);

        if ( ni <= srvN ) continue;

        string cmd = "zero";
        if ( ni > 0 ) cmd = "add";
        cmd += " * " + database + " " + line;

        string data = fetch(srv, cmd);
        for ( int i = 0; ( data.size() < 2 || data.substr(0, 2) != "OK" ) && i < 10; i++ )
            data = fetch(srv, cmd);
    }

    ///os::Cout() << "DRAG " << dn << ' ' << srv << ' ' << dirI << ' ' << gl::tos(srvN) << ' ' << gl::tos(maxN)  << ' ' << '\n';
}

void Agent::sorti()
{
    if ( as.size() != 1 ) throw gl::ex("Agent sort requires 1 argument");

    os::Path dir(as[0]);
    if ( !dir.isdir() )
        throw gl::ex("Directory $1 is not accessible", dir.str());

    os::Dir dr = os::FileSys::readDirEx(dir, true, true);

    for ( size_t i = 0; i < dr.files.size(); i++ )
    {
        string file = dr.files[i].first;
        string path = (dir + file).str();

        std::map<gl::intint, string> content;
        {
            std::ifstream in(path.c_str());
            for ( string line; std::getline(in, line); )
            {
                vecstr vs = gl::tokenise(line);
                if ( vs.size() < 3 ) goto next;
                gl::intint ni = gl::toii(vs[0]);
                string dn = vs[1];
                if ( dn != file ) goto next;
                content[ni] = line;
            }
        } // file loaded

        // save file
        {
            std::ofstream of(path.c_str(), std::ios::binary );
            for ( std::map<gl::intint, string>::iterator i = content.begin();
                    i != content.end(); i++ )
                of << (i->second) << '\n';
        }
next:;
    } // next file
}
