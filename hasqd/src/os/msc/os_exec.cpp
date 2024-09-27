#include <winsock2.h>
#include <windows.h>

#include <sstream>
#include <algorithm>

#include "os_exec.h"

typedef std::istringstream istr;
typedef std::ostringstream ostr;

class os::ac::ProcessLocal_Impl
{
        STARTUPINFOA si;
        PROCESS_INFORMATION pi;

        bool mOut;
        string mOutput;

        HANDLE pr, pw;

    public:
        ProcessLocal_Impl(const string & cmd, const string & dir, bool out, bool * ok);
        ~ProcessLocal_Impl();

        bool isRunning() const;
        void die();
        void wait(int);

        int getCode() const;
        string getOutput();

        string getId() const;
};


bool os::ac::Pum::operator<(const Pum & p) const
{
    if ( proj < p.proj ) return true;
    if ( proj > p.proj ) return false;

    if ( udir < p.udir ) return true;
    if ( udir > p.udir ) return false;

    return model < p.model;
}


// delegators

os::ac::ProcessLocal::ProcessLocal(const string & cmd, const string & dir, bool out, bool * ok)
    : mImpl( new os::ac::ProcessLocal_Impl(cmd, dir, out, ok) )
{
    mId = mImpl->getId();
}

os::ac::ProcessLocal::~ProcessLocal() { delete mImpl; }
void os::ac::ProcessLocal::wait(int x) const { mImpl->wait(x); }
int os::ac::ProcessLocal::getCode() const { return mImpl->getCode(); }
string os::ac::ProcessLocal::getOutput() const { return mImpl->getOutput(); }

void os::ac::ProcessLocal::die()
{
    mImpl->die();
    mAborted = true;
    mRunning = false;
}

bool os::ac::ProcessLocal::isRunning()
{
    bool r = mImpl->isRunning();
    mRunning = r;
    if ( r ) mAborted = false;
    return r;
}


// implementation class

os::ac::ProcessLocal_Impl::ProcessLocal_Impl(const string & cmd, const string & dir, bool out, bool * ok)
    : mOut(out)
{
    if (ok) *ok = true;
    const bool W = false;

    ZeroMemory( &si, sizeof(si) );
    si.cb = sizeof(si);
    ZeroMemory( &pi, sizeof(pi) );

    BOOL inheritH = FALSE;

    if ( mOut )
    {
        SECURITY_ATTRIBUTES sa;
        sa.bInheritHandle = TRUE;
        sa.nLength = sizeof(sa);
        sa.lpSecurityDescriptor = NULL;

        if ( ! CreatePipe(&pr, &pw, &sa, 0) )
        {
            if (ok)
                *ok = false;
            else
                throw "Create pipe failed [" + cmd + "]";

            return;
        }

        si.dwFlags = STARTF_USESTDHANDLES;
        si.hStdOutput = pw;
        inheritH = TRUE;
    }


    BOOL r =
        CreateProcessA(
            NULL, (char *)cmd.c_str(),
            NULL, NULL, inheritH,
            (W ? CREATE_NEW_CONSOLE : CREATE_NO_WINDOW),
            NULL, ( dir == "" ? NULL : ( (char *)dir.c_str() ) ),
            &si, &pi );

    if ( mOut ) CloseHandle(pw);

    if ( !r )
    {
        if ( mOut ) CloseHandle(pr);

        if (ok)
            *ok = false;
        else
            throw "Create process failed: [" + cmd + "]";

        return;
    }
}

os::ac::ProcessLocal_Impl::~ProcessLocal_Impl()
{
    // leave processes runnning
    //if( isRunning() ) die();

    if ( mOut ) CloseHandle(pr);

    CloseHandle( pi.hProcess );
    CloseHandle( pi.hThread );
}

void os::ac::ProcessLocal_Impl::die()
{
    TerminateProcess(pi.hProcess, 0);
}

void os::ac::ProcessLocal_Impl::wait(int x)
{
    if ( x >= 0 )
    {
        WaitForSingleObject(pi.hProcess, x);
        return;
    }

    WaitForSingleObject(pi.hProcess, INFINITE);
}

bool os::ac::ProcessLocal_Impl::isRunning() const
{
    DWORD st;
    GetExitCodeProcess(pi.hProcess, &st);
    return (st == STILL_ACTIVE);
}

int os::ac::ProcessLocal_Impl::getCode() const
{
    DWORD st;
    GetExitCodeProcess(pi.hProcess, &st);
    return st;
}

string os::ac::ProcessLocal_Impl::getId() const
{
    ostr os;
    os << "0x" << std::hex << (pi.hProcess);
    return os.str();
}


string os::ac::ProcessLocal_Impl::getOutput()
{
    if ( !mOut ) return "";

    DWORD rd;
    const int SZ = 200;
    char buf[SZ + 1];
    BOOL bs = FALSE;

    while (1)
    {
        bs = ReadFile( pr, buf, SZ, &rd, NULL );
        if ( !bs || rd == 0 ) break;
        string x(buf, rd);
        mOutput += x;
    }

    return mOutput;
}

bool os::execInShell(const string & cmd, const string & dir)
{
    return execProc("cmd /c \"" + cmd + "\"", dir);
}

