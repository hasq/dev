// Hasq Technology Pty Ltd (C) 2013-2016

#include <cctype> // isdigit
#include <fstream>

#include "gl_utils.h"
#include "gl_except.h"
#include "gl_token.h"

#include "ma_utils.h"
#include "sg_cout.h"
#include "sg_client.h"

#include "hq_globalspace.h"
#include "hq_svttask.h"

#include "hq_connector.h"
#include "hq_agent.h"

SvtTask * SvtTask::parse(GlobalSpace * gs, const vs & cmd, size_t & i)
{
    if ( cmd.empty() ) throw gl::Never("empty task");

    const string & f = at(cmd, i++);

    if ( f == "quit" )
        return new SvtTaskQuit(gs);

    if ( f == "[" )
        return new SvtTaskString(gs, cmd, i);

    if ( f == "{" )
        return new SvtTaskSeq(gs, cmd, i, false);

    if ( f == "<" )
        return new SvtTaskSeq(gs, cmd, i, true);

    if ( f == "println" )
        return new SvtTaskPrint(gs, cmd, i, false);

    if ( f == "print" )
        return new SvtTaskPrint(gs, cmd, i, true);

    if ( f == "show" )
        return new SvtTaskShow(gs);

    if ( f == "set" )
        return new SvtTaskSet(gs, cmd, i);

    if ( f == "del" )
        return new SvtTaskDel(gs, cmd, i);

    if ( f == "recpwd" )
        return new SvtTaskRecpwd(gs, cmd, i);

    if ( f == "tcp" )
        return new SvtTaskTcp(gs, cmd, i);

    if ( f == "hash" )
        return new SvtTaskHash(gs, cmd, i);

    if ( f == "sleep" )
        return new SvtTaskSleep(gs, cmd, i);

    if ( f == "replace" )
        return new SvtTaskReplace(gs, cmd, i);

    if ( f == "file" )
        return new SvtTaskFile(gs, cmd, i);

    if ( f == "conupdate" )
        return new SvtTaskConupdate(gs);

    if ( f == "sendnote" )
        return new SvtTaskSendNote(gs, cmd, i);

    if ( f == "nb" )
        return new SvtTaskNb(gs, cmd, i);

    if ( f == "for" )
        return new SvtTaskFor(gs, cmd, i);

    if ( f == "expect" || f == "ex" )
        return new SvtTaskExpect(gs, cmd, i);

    if ( f == "addkey" )
        return new SvtTaskAddkey(gs, cmd, i);

    if ( f == "skc" )
        return new SvtTaskSkc(gs, cmd, i);

    if ( f == "save" )
        return new SvtTaskSave(gs, cmd, i);

    if ( f == "arg" )
        return new SvtTaskArg(gs, cmd, i);

    if ( f == "agent" || f == "ag" )
        return new SvtTaskAgent(gs, cmd, i);

    if ( f == "net" )
        return new SvtTaskNet(gs, cmd, i);

    else if ( cmd.size() > i && at(cmd, i) == "=" )
        return new SvtTaskAssign(gs, cmd, ++i, f);

    return new SvtTaskVar(gs, cmd, --i);
}

const string & SvtTask::at(const vs & q, size_t i)
{
    ///if ( i < 0 ) throw gl::Never("Servant parser - bad index");
    if ( i >= q.size() ) throw gl::Never("Servant parser - not enough args: " + gl::tos(i));
    return q[i];
}

void SvtTask::clear_tasks()
{
    while ( !tasks.empty() )
    {
        delete tasks.back();
        tasks.pop_back();
    }
}

string SvtTaskQuit::process()
{
    gs->stopPublisher = true;

    os::Path d(gs->config->dropDir);
    if ( d.isdir() ) d.erase();

    if ( !gs->config->noSecretary )
    {
        ///gl::ProtHq prot(gl::ProtHq::Client);
        auto f = gs->config;
        os::net::TcpClient c(&f->clntHq, f->seIpLink, f->netLimits, nullptr);
        if ( c.isConnected() ) c.send_msg("bye");
    }
    return "";
}

SvtTaskAssign::SvtTaskAssign(GlobalSpace * g, const vs & cmd, size_t & i, const string & k): SvtTask(g), key(k)
{
    tasks.push_back( SvtTask::parse(g, cmd, i) );
}

string SvtTaskAssign::process()
{
    if ( tasks.size() != 1 ) throw gl::Never("Internal error: bad var statement");
    string r = gs->svtArea.vars[key] = tasks[0]->process();
    return r;
}

SvtTaskVar::SvtTaskVar(GlobalSpace * g, const vs & cmd, size_t & i): SvtTask(g)
{
    name = at(cmd, i++);
}

string SvtTaskVar::process()
{
    typedef std::map<string, string> mss;
    mss & vars = gs->svtArea.vars;

    mss::iterator j = vars.find(name);

    if ( j == vars.end() )
    {
        if ( name.size() > 1 && name[0] == '"' && name[name.size() - 1] == '"' )
            return name.substr(1, name.size() - 2);

        throw gl::ex("Bad input: " + name);
    }

    return j->second;
}

SvtTaskString::SvtTaskString(GlobalSpace * g, const vs & cmd, size_t & i): SvtTask(g)
{
    text = gl::unslash(at(cmd, i++));

    if ( text == "]" )
    {
        text = "";
        return;
    }

    while (1)
    {
        if ( i >= cmd.size() )
            return;
        const string x = at(cmd, i++);

        if ( x == "]" )
            return;

        text += ' ' + gl::unslash(x);
    }

}

SvtTaskSeq::SvtTaskSeq(GlobalSpace * g, const vs & cmd, size_t & i, bool u)
    : SvtTask(g), glue(u)
{
    while (1)
    {
        SvtTask * t = parse(g, cmd, i);
        if ( i >= cmd.size() )
        {
            // unexpected eol
            delete t;
            clear_tasks();
            break;
        }
        if ( t ) tasks.push_back(t);
        if ( at(cmd, i++) == (glue ? ">" : "}") )
            return;
        --i;
    }

    if ( tasks.empty() )
        throw gl::ex("invalid {} or <>");
}

string SvtTaskSeq::process()
{
    string text = tasks[0]->process();
    size_t sz = tasks.size();

    for ( size_t i = 1; i < sz; i++ )
        text += (glue ? "" : " ") + tasks[i]->process();

    return text;
}

SvtTaskPrint::SvtTaskPrint(GlobalSpace * g, const vs & cmd, size_t & i, bool one): SvtTask(g)
{
    while ( i < cmd.size() )
    {
        if ( at(cmd, i) == "}" ) break;
        tasks.push_back( parse(g, cmd, i) );
        if ( one ) break;
    }
}

string SvtTaskPrint::process()
{
    size_t sz = tasks.size();

    std::ostringstream oss;
    for ( size_t i = 0; i < sz; i++ )
    {
        if (i)
            oss << '\n';
        oss << tasks[i]->process();
    }


    if ( gs->config->dbg.prn )
    {
        os::Cout out;
        out << oss.str() << '\n';
        out << os::flush;
    }

    return oss.str();
}

string SvtTaskShow::process()
{
    typedef std::map<string, string> mss;
    mss & vars = gs->svtArea.vars;

    mss::iterator j = vars.begin();

    if ( gs->config->dbg.prn )
    {
        os::Cout out;

        for ( ; j != vars.end(); j++ )
            out << j->first << " = " << j->second << '\n';

        out << os::flush;
    }
    return "";
}

SvtTaskDel::SvtTaskDel(GlobalSpace * g, const vs & cmd, size_t & i): SvtTask(g)
{
    for ( size_t j = 1; j < cmd.size(); j++ )
        keys.push_back(at(cmd, i));
}

string SvtTaskDel::process()
{
    typedef std::map<string, string> mss;
    mss & vars = gs->svtArea.vars;

    size_t sz = keys.size();
    for ( size_t i = 0; i < sz; i++ )
    {
        mss::iterator j = vars.find(keys[i]);

        if ( j != vars.end() )
        {
            vars.erase(j);
        }
        else
            throw gl::ex("delete: no such variable " + keys[i]);
    }
    return "";
}

SvtTaskRecpwd::SvtTaskRecpwd(GlobalSpace * g, const vs & cmd, size_t & i): SvtTask(g)
{
    un = at(cmd, i++);
    nvar = at(cmd, i++);

    number = false;
    if ( std::isdigit(nvar[0]) )
    {
        N = gl::toii(nvar);
        number = true;
    }

    rdn = at(cmd, i++);
    pass = at(cmd, i++);

    string::size_type j = rdn.find(":");
    if ( j == string::npos ) return;

    rdn_index = rdn.substr(j + 1);
    rdn = rdn.substr(0, j);
}

string SvtTaskRecpwd::process()
{
    typedef std::map<string, string> mss;
    mss & vars = gs->svtArea.vars;

    if ( !number )
    {
        mss::iterator j = vars.find(nvar);

        if ( j == vars.end() )
            throw gl::ex("Variable does not exist: " + nvar);

        N = gl::toii( j->second );
    }

    string srdn = rdn;
    if ( !rdn_index.empty() )
    {
        mss::iterator j = vars.find(rdn_index);

        if ( j == vars.end() )
            throw gl::ex("Variable does not exist: " + rdn_index);

        srdn += j->second;
    }

    string rc = gs->database.makeFromPasswdStr(un, N, srdn, pass, "");

    if ( !rc.empty() )
        return rc;

    return ("RecpwdFailed");
}

SvtTaskTcp::SvtTaskTcp(GlobalSpace * g, const vs & cmd, size_t & i): SvtTask(g), saddr(at(cmd, i))
{
    tasks.push_back( parse(g, cmd, ++i) );
}

void SvtTask::translateIpAddr(string & s)
{
    if ( s == "self" )
        s = gs->config->seIpLink.str();
    else
        gs->svtArea.translateVar(s);

    if ( s.find(":") == string::npos )
        throw gl::ex("Bad tcp address $1, expecting ip:port", s);
}

/*///
os::IpAddr SvtTaskTcp::makeIpAddr(const string & x)
{
    string s = x;
    translateIpAddr(s);

    bool ok = false;
    os::IpAddr r(s, ok);
    if ( !ok ) throw gl::ex("Bad address $1", s);
    return r;
}
*/

string SvtTaskTcp::process()
{
    if ( tasks.size() != 1 ) throw gl::Never("Internal error: bad tcp statement");
    ///os::net::TcpClient c(&prot, makeIpAddr(saddr), gs->config->netLimits);
    string text = tasks[0]->process();

    ///c.send_msg(text);
    ///string r = c.recvMsgOrEmpty();

    string srv = saddr;
    translateIpAddr(srv);

    ///sgl::Client x(gs->clntProtocol, gs->config->netLimits, srv );
    sgl::Client x(gs->netenv.link(srv));
    if ( !x.isok() ) return "unreachable";
    string r = x.ask(text);

    return r;
}

SvtTaskHash::SvtTaskHash(GlobalSpace * g, const vs & cmd, size_t & i): SvtTask(g), sn(at(cmd, i))
{
    tasks.push_back( parse(g, cmd, ++i) );
}

string SvtTaskHash::process()
{
    if ( tasks.size() != 1 ) throw gl::Never("Internal error: bad hash statement");

    string tsk = tasks[0]->process();

    if ( sn == "b64e" ) return ma::b64enc(tsk);
    if ( sn == "b64d" ) return ma::b64dec(tsk);

    db::Dn * dn = db::Dn::create( sn, tsk, true );

    if ( !dn )
        throw gl::ex("Bad hash type: " + sn);

    string r = dn->str();
    delete dn;
    return r;
}

SvtTaskSleep::SvtTaskSleep(GlobalSpace * g, const vs & cmd, size_t & i)
    : SvtTask(g), delay(gl::toi(at(cmd, i++))) {}

string SvtTaskSleep::process()
{
    os::Thread::sleep(delay);
    return "sleeping";
}

SvtTaskReplace::SvtTaskReplace(GlobalSpace * g, const vs & cmd, size_t & i): SvtTask(g)
{
    tasks.push_back( parse(g, cmd, i) );
    tasks.push_back( parse(g, cmd, i) );
    tasks.push_back( parse(g, cmd, i) );
}

string SvtTaskReplace::process()
{
    if ( tasks.size() != 3 ) throw gl::Never("Bad SvtTaskReplace args");
    string s0 = tasks[0]->process();
    string s1 = tasks[1]->process();
    string s2 = tasks[2]->process();
    gl::replaceAll( s0, s1, s2 );
    return s0;
}


SvtTaskFile::SvtTaskFile(GlobalSpace * g, const vs & cmd, size_t & i): SvtTask(g)
{
    file = at(cmd, i++);
}

string SvtTaskFile::process()
{
    return gl::file2str(file);
}

string SvtTaskConupdate::process()
{
    Connector(gs).update_neighbours();
    return "";
}

SvtTaskNoteB::SvtTaskNoteB(GlobalSpace * g, const vs & cmd, size_t & i): SvtTask(g)
{
    dbname = at(cmd, i++);
    N = gl::toii(at(cmd, i++));
    tasks.push_back( parse(g, cmd, i) );
}

string SvtTaskSendNote::process()
{
    if ( tasks.size() != 1 ) throw gl::Never("Bad SvtTaskNote args");
    string Dn = tasks[0]->process();

    Connector(gs).sendNotification(dbname, N, Dn);

    return "";
}

SvtTaskNb::SvtTaskNb(GlobalSpace * g, const vs & cmd, size_t & i): SvtTask(g)
{
    ipport = at(cmd, i++);
}

string SvtTaskNb::process()
{
    Connector(gs).assignNeighbour(ipport);
    return "";
}

SvtTaskFor::SvtTaskFor(GlobalSpace * g, const vs & cmd, size_t & i): SvtTask(g)
{
    var = at(cmd, i++);
    istart = gl::toi(at(cmd, i++));
    iend = gl::toi(at(cmd, i++));
    tasks.push_back( parse(g, cmd, i) );
}

string SvtTaskFor::process()
{
    if ( tasks.size() != 1 ) throw gl::Never("Bad SvtTaskFor args");

    string r;
    typedef std::map<string, string> mss;
    mss & vars = gs->svtArea.vars;

    mss::iterator j = vars.find(var);

    if ( j != vars.end() )
        throw gl::ex("Variable exists: " + var);

    if ( istart > iend )
        for ( int i = istart; i >= iend; i-- )
        {
            vars[var] = gl::tos(i);
            r += tasks[0]->process();
        }
    else
        for ( int i = istart; i <= iend; i++ )
        {
            vars[var] = gl::tos(i);
            r += tasks[0]->process();
        }

    vars.erase(var);
    return r;
}

SvtTaskExpect::SvtTaskExpect(GlobalSpace * g, const vs & cmd, size_t & i): SvtTask(g)
{
    index = gl::toi(at(cmd, i++));
    value = at(cmd, i++);
    max_rep = gl::toi(at(cmd, i++));
    tasks.push_back( parse(g, cmd, i) );
}

string SvtTaskExpect::process()
{
    if ( tasks.size() != 1 ) throw gl::Never("Bad SvtTaskExpect args");

    string r;

    string val = value;
    gs->svtArea.translateVar(val);

    for ( int i = 0; (i < max_rep || max_rep == -1 ); i++ )
    {
        r = tasks[0]->process();
        gl::Token tok(&r);
        if ( !tok.next(index) ) continue;
        if ( tok.is(val.c_str()) ) return r;
        os::Thread::yield();
    }

    os::Cout() << "Expect error: [" << r << "] expected ["
               << val << "] at [" << index << "]" << os::endl;

    return "error";
}

SvtTaskAddkey::SvtTaskAddkey(GlobalSpace * g, const vs & cmd, size_t & i): SvtTask(g)
{
    tasks.push_back( parse(g, cmd, i) );
}

string SvtTaskAddkey::process()
{
    if ( tasks.size() != 1 ) throw gl::Never("Bad SvtTaskAddkey args");
    string key = tasks[0]->process();
    gs->keyArea.addSkcKey(key);
    return key;
}


SvtTaskSave::SvtTaskSave(GlobalSpace * g, const vs & cmd, size_t & i): SvtTask(g)
{
    file = at(cmd, i++);
    tasks.push_back( parse(g, cmd, i) );
}

string SvtTaskSave::process()
{
    if ( tasks.size() != 1 ) throw gl::Never("Bad SvtTaskSave args");
    string text = tasks[0]->process();

    std::ofstream of(file.c_str(), std::ios::binary);
    of << text;

    return text;
}

SvtTaskSkc::SvtTaskSkc(GlobalSpace * g, const vs & cmd, size_t & i): SvtTask(g)
{
    string f = at(cmd, i++);
    if ( f == "enc" ) func = Enc;
    else if ( f == "dec" ) func = Dec;
    else if ( f == "addkey" ) func = Add;
    else if ( f == "popkey" ) func = Pop;
    else if ( f == "show" ) func = Show;
    else
        throw gl::ex("skc function requires: addkey, popkey, show, enc or dec");

    if ( func == Enc || func == Dec )
    {
        string b = at(cmd, i++);
        if ( b == "b64" ) { b64 = true; hex = false; }
        else if ( b == "hex" ) { b64 = false; hex = true; }
        else if ( b == "bin" ) { b64 = false; hex = false; }
        else
            throw gl::ex("skc function requires 'b64' or 'bin'");
    }

    if ( func == Show || func == Pop )
        return;

    tasks.push_back( parse(g, cmd, i) );
}

string SvtTaskSkc::process()
{
    switch (func)
    {
        case Pop: gs->keyArea.popSkcKey(); return "";
        case Show:
        {
            string sa = gs->keyArea.peekSalt();
            string iv = gs->keyArea.peekIvec();
            std::vector<string> keys = gs->keyArea.showSkcKeys(false);
            string r = sa + '\n';
            r += iv + '\n';
            for ( size_t i = 0; i < keys.size(); i++ )
                r += keys[i] + '\n';
            return r;
        }
        case Enc:
        case Dec:
        case Add:
            break;
    }

    if ( tasks.size() != 1 ) throw gl::Never("Bad SvtTaskSkc args");
    string m = tasks[0]->process();

    switch (func)
    {
        case Enc: return gs->keyArea.skcenc(m, b64, hex);
        case Dec: return gs->keyArea.skcdec(m, b64, hex);
        case Add:
            gs->keyArea.addSkcKey(m);
            return m;

        case Pop:
        case Show:
            break;
    }

    throw gl::Never("Bad SvtTaskSkc args");
}


SvtTaskSet::SvtTaskSet(GlobalSpace * g, const vs & cmd, size_t & i): SvtTask(g)
{
    string scmd = at(cmd, i++);

    if ( scmd == "date" ) ecmd = Date;
    else throw gl::ex("Bad SvtTaskSet args: [" + scmd + "]");

    tasks.push_back( parse(g, cmd, i) );
}

string SvtTaskSet::process()
{
    if ( tasks.size() != 1 ) throw gl::Never("Bad SvtTaskSet args");
    string args = tasks[0]->process();

    if ( ecmd == Date )
    {
        if ( args.size() != 8 ) gl::ex("Bad SvtTaskSet args: date must be of length 8 +[" + args + "]");
        os::Timer::setGmd(args);
    }

    return args;
}

SvtTaskArg::SvtTaskArg(GlobalSpace * g, const vs & cmd, size_t & i): SvtTask(g)
{
    index = gl::toi(at(cmd, i++));
    tasks.push_back( parse(g, cmd, i) );
}

string SvtTaskArg::process()
{
    if ( tasks.size() != 1 ) throw gl::Never("Bad SvtTaskArg args");
    string str = tasks[0]->process();

    std::vector<string> vs = gl::tokenise(str);

    if ( index < 0 || index >= (int)vs.size() ) return "ARG_INDEX_OUT";

    return vs[index];
}

SvtTaskAgent::SvtTaskAgent(GlobalSpace * g, const vs & cmd, size_t & i): SvtTask(g)
{
    sub1 = at(cmd, i++);

    if ( Agent::sub2Cmd(sub1) ) sub2 += at(cmd, i++);
    if ( Agent::sub3Cmd(sub1) ) sub3 += at(cmd, i++);
    if ( Agent::sub3Cmd(sub1) ) translateIpAddr(sub2);

    if ( !Agent::validCmd(sub1) ) throw gl::ex("Invalid command: " + sub1);
    while ( i < cmd.size() ) tasks.push_back( parse(g, cmd, i) );
}

string SvtTaskAgent::process()
{
    std::vector<string> args;

    for ( size_t i = 0; i < tasks.size(); i++ )
        args.push_back( tasks[i]->process() );

    gs->agent.run(sub1, sub2, sub3, args);

    return "";
}

///string SvtTaskTcp::process() { return proc(*(gs->clntProtocol)); }

SvtTaskNet::SvtTaskNet(GlobalSpace * g, const vs & cmd, size_t & i): SvtTask(g)
{
    sub = at(cmd, i++);
    while ( i < cmd.size() ) tasks.push_back( parse(g, cmd, i) );
}

string SvtTaskNet::process()
{
    std::vector<string> args;

    for ( size_t i = 0; i < tasks.size(); i++ )
        args.push_back( tasks[i]->process() );

    if ( sub == "protocol" )
    {
        if ( args.empty() ) return show_prot();

        if ( args.size() != 1 )
            throw gl::ex("Too many args for 'net'");

        return set_prot(args[0]);
    }

    throw gl::ex("Unknown subcommand " + sub);
}

string SvtTaskNet::show_prot()
{
    const gl::Protocol * p = gs->netenv.clntProtocol;

    if ( dynamic_cast<const gl::ProtHq *>(p) ) return "hasq";
    if ( dynamic_cast<const gl::HttpGet *>(p) ) return "http_get";
    if ( dynamic_cast<const gl::HttpPost *>(p) ) return "http_post";
    throw gl::Never("Bad protocol class");
}

string SvtTaskNet::set_prot(const string & v)
{
    string was = show_prot();
    if ( v.empty() ) return was;

    auto & cp = gs->netenv.clntProtocol;

    if (false);
    else if ( v == "hasq" )      cp = &gs->config->clntHq;
    else if ( v == "http_get" )  cp = &gs->config->clntHttpGet;
    else if ( v == "http_post" ) cp = &gs->config->clntHttpPost;
    else throw gl::ex("Invalid value $1, use (hasq|http_get|http_post)", v);

    return was + " -> " + v;
}
