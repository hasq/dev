// Hasq Technology Pty Ltd (C) 2013-2016

#include <fstream>
#include <sstream>

#include "gl_err.h"
#include "sg_cout.h"
#include "os_net.h"

#include "hq_servant.h"
#include "hq_svttask.h"


Servant::~Servant()
{
    if ( gs->svtArea.jobQueue.size() )
    {
        string text = gs->svtArea.jobQueue.front().text();
        text = "Error: Servant has jobs [" + text + "]";
        os::Cout() << text << os::endl;
    }

    std::deque<SvtTask *> & taskQueue = gs->svtArea.taskQueue;

    if ( taskQueue.size() )
    {
        os::Cout() << "Error: Servant has " <<
                   taskQueue.size() << " tasks: ["
                   << taskQueue.front()->text() << "]" << os::endl;
    }
}

Servant::Servant(GlobalSpace * g) : Blockable(&g->stopPublisher)
    , gs(g)
{
    const string & file = gs->config->servantFile;
    if ( file.empty() ) return;

    // there is something to do
    // signal itself to start work
    getMainSemaphore()->up();

    if ( file[0] == '@' )
    {
        std::istringstream is(file.substr(1));
        while (1)
        {
            string s;
            std::getline(is, s, ';');
            if ( !is ) break;
            addTask_safe(s);
        }

        return;
    }

    std::ifstream in(file.c_str());
    if ( !in )
        throw gl::ex("Cannot open servant file $1", file);

    while (1)
    {
        string line;
        std::getline(in, line);
        if ( !in ) break;
        if ( line.empty() ) continue;
        if ( line[0] == '#' ) continue;
        gl::replaceAll(line, "\r", "");
        gl::replaceAll(line, "\n", "");
        if ( line.empty() ) continue;
        addTask_safe(line);
    }

}

void Servant::runOnceUnconditionally()
{
    while (1)
    {
        SvtTask * task = 0;
        SvtJob job;
        {
            SvtArea & sa = gs->svtArea;
            sgl::Mutex mutex_sa(sa.access2svtArea);

            if ( !sa.jobQueue.empty() )
            {
                job = sa.jobQueue.front();
                sa.jobQueue.pop_front();
            }
            else if ( !sa.taskQueue.empty() )
            {
                task = sa.taskQueue.front();
                sa.taskQueue.pop_front();
            }
            else
                return;

        } // release mutex

        if ( gs->config->dbg.svt )
            os::Cout() << os::prmpt("svt", gs->config->dbg.id)
                       << (task ? task->text() : job.text()) << os::endl;

        if ( gs->stopPublisher )
            return;

        if ( !task )
        {
            job.process();
            continue;
        }

        gl::Remover<SvtTask> rem_task(task);

        try
        {
            task->process();
        }
        catch (gl::ex e)
        {
            error("Offensive command (exec)", task->text(), e.str() );
        }
        catch (...)
        {
            error("Offensive command (exec)", task->text(), "unknown" );
        }
    }
}

void Servant::addTask_line(const string & cmdLine)
{
    try
    {
        std::vector<string> toks = gl::tokenise(cmdLine);

        if ( dictionary.process(toks) )
        {
            if ( gs->config->dbg.svt )
            {
                os::Cout out;
                out << os::prmpt("svt", gs->config->dbg.id);
                for ( size_t i = 0; i < toks.size(); i++ )
                    out << (i ? " " : "") << toks[i];
                out << os::endl;
            }

            return;
        }

        SvtTask * t = SvtTask::parse(gs, toks);
        if (t)
        {
            t->setText(cmdLine);
            sgl::Mutex mutex_sa(gs->svtArea.access2svtArea);
            gs->svtArea.taskQueue.push_back(t);
        }
    }
    catch (gl::ex e)
    {
        error("Offensive command (parse)", cmdLine, e.str() );
    }
    catch (...)
    {
        error("Offensive command (parse)", cmdLine, "unknown" );
    }
}

void Servant::addTask_safe(const string & cmdLine)
{
    std::vector<string> toks = gl::tokenise(cmdLine);

    if ( toks.empty() ) return;

    if ( toks[0] == "begin" )
    {
        be_stack.push_back("");
        return;
    }

    if ( be_stack.empty() )
        return addTask_line(cmdLine);

    if ( toks[0] == "end" )
    {
        addTask_line(be_stack.back());
        be_stack.pop_back();
        return;
    }

    string cL = cmdLine;
    while ( !cL.empty() && cL[0] == ' ' ) cL = cL.substr(1);
    be_stack[ be_stack.size() - 1 ] += " " + cL;
}

void Servant::error(const string & text, const string & msg, const string & ex)
{
    std::ostringstream o;

    o << text << ": " << msg << "\nError: " << ex;

    os::Cout() << o.str() << os::endl;

    gs->logger.add(Logger::Critical, "Servant: " + o.str());
}

// returns true if no action required - constructing dictionary
bool SvtDictionary::process(std::vector<string> & toks)
{
    if ( toks.empty() ) return false;

    if ( toks[0] == "define" )
    {
        int separator = gl::findidx(toks, ":");

        if ( separator < 2 )
            throw gl::ex("Bad define, separator not found");

        data.erase(toks[1]);

        for ( int i = 2; i < separator; i++ )
            data[toks[1]].args.push_back(toks[i]);

        for ( int i = separator + 1; i < (int)toks.size(); i++ )
            data[toks[1]].cmd.push_back(toks[i]);

        return true;
    }

    if ( !data.empty() )
        apply(toks);

    return false;

}

void SvtDictionary::apply(std::vector<string> & toks)
{
    for ( int j = 0; j < 10000; j++ )
    {
        bool applied = false;

        for ( msv::iterator i = data.begin(); i != data.end(); i++ )
        {
            if ( apply(i->first, i->second, toks) ) applied = true;
        }

        if ( !applied )
            return;
    }

    throw gl::ex("Too deep definition recursion");
}

bool SvtDictionary::apply(const string & func,
                          const Value & v, std::vector<string> & toks)
{
    int idx = gl::findidx(toks, func);
    if ( idx < 0 ) return false;

    size_t ide = idx + v.args.size() + 1;
    if ( toks.size() < ide )
        throw gl::ex("List of arguments for [" + func + "] is too small");

    vs cmd = v.cmd;
    for ( size_t i = 0; i < v.args.size(); i++ )
    {
        for ( size_t j = 0; j < cmd.size(); j++ )
            if ( cmd[j] == v.args[i] )
                cmd[j] = toks[idx + i + 1];
    }

    vs::iterator b = toks.begin();
    toks.erase( b + idx, b + ide );
    toks.insert( b + idx, cmd.begin(), cmd.end() );

    return true;
}

