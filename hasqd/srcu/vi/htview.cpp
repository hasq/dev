// Hasq Technology Pty Ltd (C) 2013-2015

#include <cstdlib>
#include <iostream>
#include <vector>
#include <sstream>
#include <map>

#include "gl_except.h"
#include "gl_utils.h"

#include "os_timer.h"

#include "sg_cout.h"
#include "sg_testing.h"

#include "canvas.h"

//using std::cout;

typedef std::vector<string> vs;
string at(vs x, size_t i)
{
    if ( i >= x.size() ) throw gl::ex("Index error");
    return x[i];
}

void cmd_help(vs cmd)
{
    TRACE
    os::Cout()
            <<
            "new canvas <base> X Y - create new canvas of XY size and database in directory <base>\n"
            "new pub X Y - start new node at XY with default arguments\n"
            "new pub X Y <cmd> - start new node at XY with <cmd> arguments - no default\n"
            "new pub X Y hint <cmd> - start new node at XY with default plus <cmd> arguments\n"
            "new cmd X Y - show default arguments for node XY - no action\n"
            "shut X Y - shutdown node XY\n"
            "rmdb X Y - remove DB at XY\n"
            "new db all - create DB for all hashes and for all canvas cells\n"
            "new db X Y all - create DB at XY for all hashes\n"
            "new db X Y <tfile> - create DB at XY from <tfile> template\n"
            "new db X Y <uN> <sN> <fN> <nG> <mag> <sz> <th> - create DB with parameters\n"
            "open <file> - open saved canvas\n"
            "save <file> - save current canvas\n"
            "show\n"
            "quit\n"
            "sleep N\n"
            "nextsleep <N> - sleep after next command\n"
            "erase <base> - erase DB from disk\n"
            "expect <index> <string> [max=1000] - repeat until get the correct reply\n"
            "send X Y <cmd> - send message\n"
            "start all - start nodes in all cells\n"
            "shut all - shutdown all cells\n"
            "cross all - interconnect nodes with up-down-left-right\n"
            "connect X1 Y1 X2 Y2 - send connect message to XY1 about XY2\n"
            "refconn all - refresh all connections\n"
            "refconn X Y - refresh XY connections\n"
            "reorg X Y - reorganise neighbours for XY\n"
            "reorg all - reorganise neighbours for all\n"
            "inject X Y <cmd> - inject command to svt\n"
            "echo args - print args\n"
            "q - same as quit\n\n"
            "simple variable: 'a = b' tranlate command replacing 'a' to 'b'\n"
            "special variable: '${x:y}' tranlate command replacing to 127.0.0.1:PORT\n"
            << os::flush;
}

void cmd_nw(vs cmd);
void cmd_open(vs cmd);
void cmd_save(vs cmd);
void cmd_show(vs cmd);
void cmd_erase(vs cmd);
void cmd_shut(vs cmd);
void cmd_send(vs cmd);
void cmd_rmdb(vs cmd);
void cmd_start(vs cmd);
void cmd_cross(vs cmd);
void cmd_sleep(vs cmd);
void cmd_activ(vs cmd);
void cmd_expect(vs cmd);
void cmd_connect(vs cmd);
void cmd_refconn(vs cmd);
void cmd_inject(vs cmd);
void cmd_reorg(vs cmd);
void cmd_echo(vs cmd);

bool chk_var(vs & cmd);

Canvas * canvas = 0;
int nextsleep = 0;

struct Expect
{
    bool on;
    int maxN;
    size_t idx;
    string str;
    Expect(): on(false), maxN(0), idx(0) {}
} * expect = 0;


typedef std::map<string, string> mss;
mss * pvariables;


int main(int ac, char * av[])
try
{
    TRACE0

    sgl::testing();

    pvariables = new std::map<string, string>();
    gl::Remover<mss> dummy_variables(pvariables);

    expect = new Expect();
    gl::Remover<Expect> rem_expect(expect);

    os::net::NetInitialiser netinit;
    er::enumerate_codes();

    std::istream * in = &std::cin;
    if ( ac > 1 )
    {
        string s;
        for ( int i = 1; i < ac; i++ )
            s += string(av[i]) + '\n';
        in = new std::istringstream(s);
    }

    std::vector<std::istream *> inputs;

    while (true)
        try
        {
            try
            {
                if ( !*in )
                {
                    if ( inputs.empty() ) break;
                    delete in;
                    in = inputs.back();
                    inputs.pop_back();
                }

                string cmd;
                //cout << "> ";
                std::getline(*in, cmd);

                vs toks = gl::tokenise(cmd);

                if ( toks.empty() )
                    continue;

                if ( toks[0][0] == '#' )
                    continue;

                if ( toks[0] == "help" )
                {
                    cmd_help(toks);
                    continue;
                }

                if ( chk_var(toks) )
                {
                    os::Cout() << "<htv> (variable) " << cmd << os::endl;
                    continue;
                }

                os::Cout() << "<htv> " << cmd << os::endl;

                if ( toks[0] == "new" )
                    cmd_nw(toks);

                else if ( toks[0] == "open" )
                    cmd_open(toks);

                else if ( toks[0] == "save" )
                    cmd_save(toks);

                else if ( toks[0] == "sleep" )
                    cmd_sleep(toks);

                else if ( toks[0] == "activity" )
                    cmd_activ(toks);

                else if ( toks[0] == "show" )
                    cmd_show(toks);

                else if ( toks[0] == "erase" )
                    cmd_erase(toks);

                else if ( toks[0] == "shut" )
                    cmd_shut(toks);

                else if ( toks[0] == "send" )
                    cmd_send(toks);

                else if ( toks[0] == "rmdb" )
                    cmd_rmdb(toks);

                else if ( toks[0] == "start" )
                    cmd_start(toks);

                else if ( toks[0] == "cross" )
                    cmd_cross(toks);

                else if ( toks[0] == "expect" )
                    cmd_expect(toks);

                else if ( toks[0] == "connect" )
                    cmd_connect(toks);

                else if ( toks[0] == "refconn" )
                    cmd_refconn(toks);

                else if ( toks[0] == "reorg" )
                    cmd_reorg(toks);

                else if ( toks[0] == "inject" )
                    cmd_inject(toks);

                else if ( toks[0] == "echo" )
                    cmd_echo(toks);

                else if ( toks[0] == "nextsleep" )
                {
                    nextsleep = gl::toi(at(toks, 1));
                    continue;
                }

                else if ( toks[0] == "include" )
                {
                    string file = at(toks, 1);
                    std::istream * is = new std::ifstream(file.c_str());
                    if ( !*is ) throw "Cannot open " + file;
                    inputs.push_back(in);
                    in = is;
                    continue;
                }

                else if ( toks[0] == "quit" || toks[0] == "q" )
                {
                    delete canvas;
                    return 0;
                }

                else
                    os::Cout() << "unknown command [" << toks[0] << "]" << os::endl;

                if ( nextsleep )
                {
                    os::Thread::sleep(nextsleep);
                    nextsleep = 0;
                }

            }
            catch (...)
            {
                delete canvas;
                canvas = 0;
                throw;
            }
        }
        catch (gl::Exception e)
        {
            std::cout << "Fatal error (gl::Exception): " << e.str() << std::endl;
        }
        catch (const char * e) { std::cout << "Fatal error (char*): " << e << '\n'; }
        catch (string e) { std::cout << "Fatal error (string): " << e << '\n'; }

    if ( in != &std::cin ) delete in;
}
catch (gl::Exception e)
{
    std::cout << "Error: " << e.str() << '\n';
}
catch (std::exception e)
{
    std::cout << "Error (std): " << e.what() << '\n';
}
catch (...)
{
    std::cout << "Unknown Error" << '\n';
}


void callback(string s)
{
    os::Cout() << "[" << s << "]" << os::flush;
}

void cmd_erase(vs cmd)
{
    TRACE
    string dir = at(cmd, 1);
    bool r = os::FileSys::erase(dir);
    os::Cout() << "erasing " << dir << " " << (r ? "ok" : "failed") << os::endl;
}

void cmd_sleep(vs cmd)
{
    TRACE
    int n = gl::toi(at(cmd, 1));
    os::Thread::sleep(n);
}

void print_stat(Canvas::ActivityMap stat)
{
    TRACE
    if ( stat.m.empty() ) return;

    os::Cout oscout;

    Canvas::ActivityMap::mxc::const_iterator i = stat.m.begin();
    for (; i != stat.m.end(); i++ )
    {
        oscout << "(" << i->first << " " << i->second << ")";
    }
    oscout << os::endl;
}

void cmd_activ(vs cmd)
{
    TRACE
    if ( !canvas )
    {
        os::Cout() << "no canvas" << os::endl;
        return;
    }

    Canvas::ActivityMap stat = canvas->stat();

    while (1)
    {
        print_stat(stat);
        Canvas::ActivityMap stat2 = canvas->stat();
        if ( stat == stat2 ) break;
        stat = stat2;
    }
}

void cmd_show(vs cmd)
{
    TRACE
    if ( !canvas )
    {
        os::Cout() << "no canvas" << os::endl;
        return;
    }

    XY sz = canvas->size();

    os::Cout oscout;

    for ( int j = 0; j < sz.y(); j++ )
    {
        for ( int i = 0; i < sz.x(); i++ )
        {
            XY xy(i, j);
            Canvas::Db d = canvas->db(xy);
            Node * n = canvas->node(xy);
            string sd = (!d.empty() ? "#" : " ");
            string sn = (n ? "P" : " ");
            string h = (canvas->pubdata[xy].clocks.empty() ? "--" :
                        canvas->pubdata[xy].clocks[0].substr(0, 2) );
            oscout << "[" << sd << sn << h << "]";

            //h = (canvas->pubdata[xy].clocks.empty() ? "-" : canvas->pubdata[xy].clocks[0]);
            //os::Cout() << "{" << h << "}";
        }
        oscout << os::endl;
    }

    Canvas::mxvx & mp = canvas->conns;
    for ( Canvas::mxvx::const_iterator i = mp.begin(); i != mp.end(); i++ )
    {
        const Canvas::vx & v = i->second;
        if ( v.empty() ) continue;
        oscout << "(" << i->first << "):";
        for ( Canvas::vx::size_type j = 0; j < v.size(); j++ )
        {
            oscout << " (" << v[j] << ")";
        }
        oscout << '\n';
    }

    oscout << os::flush;

}

void cmd_save(vs cmd)
{
    TRACE
    string file = at(cmd, 1);
    std::ofstream of(file.c_str());
    if ( !of )
        throw gl::ex("cannot open " + file);
    if (canvas) canvas->save(of);
}


void cmd_open(vs cmd)
{
    TRACE
    string file = at(cmd, 1);
    std::ifstream in(file.c_str());
    if ( !in )
        throw gl::ex("cannot open " + file);
    delete canvas;
    canvas = 0;
    canvas = new Canvas(in);
}

void cmd_nw_canvas(vs cmd)
{
    TRACE
    string base = at(cmd, 2);
    int x = gl::toi( at(cmd, 3) );
    int y = gl::toi( at(cmd, 4) );

    delete canvas;
    canvas = 0;
    canvas = new Canvas(base, XY(x, y));
}

void cmd_shut(vs cmd)
{
    TRACE
    if (!canvas) return;

    string arg  = at(cmd, 1);
    if ( arg == "all" )
    {
        os::Cout() << "stopping all: " << os::flush;
        canvas->stopInAll(callback);
        os::Cout() << " done" << os::endl;
        return;
    }

    int x = gl::toi( at(cmd, 1) );
    int y = gl::toi( at(cmd, 2) );

    canvas -> delNode(XY(x, y));
}

void cmd_rmdb(vs cmd)
{
    TRACE
    int x = gl::toi( at(cmd, 1) );
    int y = gl::toi( at(cmd, 2) );

    if (!canvas) return;

    canvas -> delDb(XY(x, y));
}

void cmd_nw_pub(vs cmd)
{
    TRACE
    int x = gl::toi( at(cmd, 2) );
    int y = gl::toi( at(cmd, 3) );

    if (!canvas) return;

    XY a(x, y);
    string c;

    if ( cmd.size() == 4 )
        c = canvas->hint;
    else
    {
        c = at(cmd, 4);
        if ( c == "hint" ) c = canvas->hint;
        for ( size_t i = 5; i < cmd.size(); i++ )
            c += " " + at(cmd, i);
    }

    os::Cout() << "Cmd: " << canvas->getCmd(a, c) << os::endl;
    canvas->addNode(a, c);
}

void cmd_nw_cmd(vs cmd)
{
    TRACE
    int x = gl::toi( at(cmd, 2) );
    int y = gl::toi( at(cmd, 3) );

    if (!canvas) return;

    XY a(x, y);
    string c = canvas->getCmd(a);
    os::Cout() <<  c << os::endl;
}

void cmd_nw_db(vs cmd)
{
    TRACE
    string sx = at(cmd, 2);

    if ( sx == "all" )
    {
        Canvas::callback f = 0;
        if (canvas) canvas->addDbAll(f);
        return;
    }

    string sy = at(cmd, 3);
    int x = gl::toi( sx );
    int y = gl::toi( sy );
    string tfile = at(cmd, 4);

    if (!canvas) return;
    XY a(x, y);

    if ( cmd.size() == 5 )
    {

        if ( tfile == "all" )
            canvas->addDbAll(a);
        else
            canvas->addDb(a, tfile);
        return;
    }

    string uN = tfile;
    string sN = at(cmd, 5);
    string fN = at(cmd, 6);
    int nG = gl::toi(at(cmd, 7).c_str());
    string mag = at(cmd, 8); mag = mag.substr(1, mag.size() - 2);
    int sz = gl::toi(at(cmd, 9).c_str());
    int th = gl::toi(at(cmd, 10).c_str());

    canvas->addDb(a, uN, sN, fN, nG, mag, sz, th);
}

void cmd_nw(vs cmd)
{
    TRACE
    if ( cmd.size() < 2 ) return;

    string c = at(cmd, 1);
    if ( c == "canvas" ) return cmd_nw_canvas(cmd);
    else if ( c == "pub" ) return cmd_nw_pub(cmd);
    else if ( c == "cmd" ) return cmd_nw_cmd(cmd);
    else if ( c == "db" ) return cmd_nw_db(cmd);
    else
        throw gl::ex("Bad new format");

}

void cmd_send(vs cmd)
{
    TRACE
    int x = gl::toi( at(cmd, 1) );
    int y = gl::toi( at(cmd, 2) );

    if (!canvas) return;

    string c = at(cmd, 3);
    for ( size_t i = 4; i < cmd.size(); i++ )
        c += " " + at(cmd, i);

    if ( !expect->on )
    {
        os::Cout() << "Reply: " << canvas->send(XY(x, y), c) << os::endl;
        return;
    }

    string r;
    for ( int i = 0; i < expect->maxN; i++ )
    {
        r = canvas->send(XY(x, y), c);
        std::vector<string> v = gl::tokenise(r);
        if ( v.size() > expect->idx && v[expect->idx] == expect->str )
        {
            expect->on = false;
            return;
        }

        os::Thread::sleep(10);
    }

    expect->on = false;
    os::Cout() << "Failed: " << r << os::endl;
}


void cmd_start(vs cmd)
{
    TRACE
    if ( !canvas ) throw gl::ex("start: Canvas null");

    string arg1 = at(cmd, 1);
    if ( arg1 == "all" )
    {
        os::Cout() << "starting: " << os::flush;
        canvas->startInAll(callback);
        os::Cout() << " done" << os::endl;
        return;
    }
    os::Cout() << "???" << os::endl;
}

void cmd_cross(vs cmd)
{
    TRACE
    if ( !canvas ) throw gl::ex("start: Canvas null");

    string arg1 = at(cmd, 1);
    if ( arg1 == "all" )
    {
        os::Cout() << "crossing: " << os::flush;
        canvas->crossAll(callback);
        os::Cout() << " done" << os::endl;
        return;
    }
    os::Cout() << "???" << os::endl;
}

void cmd_expect(vs cmd)
{
    TRACE
    expect->idx = gl::toi(at(cmd, 1));
    expect->str = at(cmd, 2);

    expect->maxN = 1000;
    if ( cmd.size() > 3 ) expect->maxN = gl::toi(at(cmd, 3));

    expect->on = true;
}


void cmd_connect(vs cmd)
{
    TRACE
    int x1 = gl::toi( at(cmd, 1) );
    int y1 = gl::toi( at(cmd, 2) );
    int x2 = gl::toi( at(cmd, 3) );
    int y2 = gl::toi( at(cmd, 4) );

    if (!canvas) return;

    XY a1(x1, y1);
    XY a2(x2, y2);

    canvas->createConnection(a1, a2);
}

void cmd_refconn(vs cmd)
{
    TRACE
    if (!canvas) return;

    if ( at(cmd, 1) == "all" )
    {
        canvas->refreshAllConn();
        return;
    }

    int x = gl::toi( at(cmd, 1) );
    int y = gl::toi( at(cmd, 2) );

    canvas->refreshConn(XY(x, y));
}

void cmd_inject(vs cmd)
{
    TRACE
    int x = gl::toi( at(cmd, 1) );
    int y = gl::toi( at(cmd, 2) );

    if (!canvas) return;

    string c = at(cmd, 3);
    for ( size_t i = 4; i < cmd.size(); i++ )
        c += " " + at(cmd, i);

    canvas->inject(XY(x, y), c);
}

void var_func(string & s)
{
    string b = s.substr(2, s.size() - 3);
    size_t i = b.find(":");
    if ( i == string::npos )
    {
        os::Cout() << "Expecting ':'" << os::endl;
        return;
    }

    int x = gl::toi(b.substr(0, i));
    int y = gl::toi(b.substr(i + 1));

    string ipp = "127.0.0.1:" + gl::tos( canvas->xy2port( XY(x, y) ) );

    s = ipp;
}

bool chk_var(vs & cmd)
{
    if ( cmd.size() > 2 && cmd[1] == "=" )
    {
        (*pvariables)[cmd[0]] = cmd[2];
        for ( size_t i = 3; i < cmd.size(); i++ )
            (*pvariables)[cmd[0]] += " " + cmd[i];
        return true;
    }

    for ( int i = 0; i < 1000; i++ )
    {
        bool chng = false;

        for ( size_t j = 0; j < cmd.size(); j++ )
        {
            string & c = cmd[j];

            if ( c.size() > 2 && c[0] == '$' && c[1] == '{' && c[c.size() - 1] == '}' )
                var_func(c);

            mss::iterator k = pvariables->find(cmd[j]);
            if ( k == pvariables->end() ) continue;
            cmd[j] = k->second;
            chng = true;
        }

        if ( !chng ) break;
    }

    return false;
}

void cmd_reorg(vs cmd)
{
    TRACE
    if (!canvas) return;

    if ( at(cmd, 1) == "all" )
    {
        canvas->forceAllReo();
        return;
    }

    int x = gl::toi( at(cmd, 1) );
    int y = gl::toi( at(cmd, 2) );

    canvas->forceOneReo(XY(x, y));
}

void cmd_echo(vs cmd)
{
    TRACE

    string c;
    for ( size_t i = 1; i < cmd.size(); i++ )
    {
        if ( i > 1 ) c += ' ';
        c += at(cmd, i);
    }

    os::Cout() << c << os::endl;
}

