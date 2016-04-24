#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <cctype>
#include <ctime>
#include <map>
#include <set>
#include <algorithm>

using std::string;
using std::cout;
using std::pair;

string getname()
{
    std::ifstream in("myname");
    if ( in )
    {
        string name;
        in >> name;
        if ( !name.empty() ) return name;
    }

    in.close();

    string nm;
    cout << "Enter your name: ";
    std::cin >> nm;

    std::ofstream of("myname");
    of << nm;

    cout << "Thank you, " << nm << "!\nStart again";
    return "";
}

typedef std::vector< pair<int, string> > vis;

vis loadtasks(bool active)
{
    std::ifstream in("tech_tasks.txt", std::ios::binary);

    vis r;

    while (in)
    {
        string line;
        std::getline(in, line);

        if ( line.size() < 3 ) continue;

        if ( !active )
        {
            if ( line[0] == '#' ) line = line.substr(1);
            else continue;
        }

        if ( !std::isdigit(line[0]) ) continue;

        std::istringstream is(line);
        int n = 0;
        is >> n;
        if ( n < 1 || n > 1000000 ) throw "Bad task number [" + line + "]";

        string task = line.substr(3, 15);

        while ( task[task.size() - 1] == ' ' )
            task = task.substr(0, task.size() - 1);

        r.push_back(pair<int, string>(n, task));
    }

    // check double indices
    for ( size_t i = 0; i < r.size(); i++ )
        for ( size_t j = i + 1; j < r.size(); j++ )
            if ( r[i].first == r[j].first )
                throw "Same index: [" + r[i].second + "] [" + r[j].second + "]";

    std::sort(r.begin(), r.end());

    return r;
}

static string atleast2(int s)
{
    std::ostringstream os; os << s;
    string m = os.str();
    while ( m.size() < 2 ) m = string("0") + m;
    return m;
}

string getGmd()
{
    std::time_t t = ::time(0);
    struct std::tm * x = ::localtime(&t);
    string s;
    s += atleast2(x->tm_year + 1900).substr(2, 2);
    s += atleast2(x->tm_mon + 1);
    s += atleast2(x->tm_mday);
    return s;
}

int getidx(const vis & tasks, int n)
{
    int idx = -1;
    for ( int i = 0; i < tasks.size(); i++ )
        if ( tasks[i].first == n ) idx = i;

    return idx;
}

int main(int ac, char * av[])
try
{
    if ( ac > 1 && string(av[1]) == "report" )
    {
        void report();
        report();
        return 0;
    }

    {
        std::ofstream of("timesheet", std::ios::app | std::ios::binary);
        if ( !of )
        {
            cout << "Timesheet not accessible. Maybe you forgot to lock it?\n";
            return 1;
        }
    }

    string name = getname();
    if ( name.empty() ) return 0;

    cout << "\n Welcome " << name << "!\n";

    vis tasks = loadtasks(true);
    if ( tasks.empty() ) throw string() + "Cannot load task file";

ask1:
    cout << "---------------------------------------------------\n";
    for ( vis::iterator i = tasks.begin(); i != tasks.end(); ++i )
        cout << i->first << "    " << "[" << i->second << "]\n";

    int n = 0;
    cout << "Select the task you have worked on (0 to exit): ";
    std::cin >> n;
    if ( n == 0 ) return 0;

    int idx = getidx(tasks, n);

    if ( idx == -1 ) goto ask1;

    int task = tasks[idx].first;

ask2:
    double h = -1;
    cout << "Number of hours you spent on task "
         << task << " [" << tasks[idx].second << "] : ";

    std::cin >> h;
    if ( h < 0.001 || h > 24 ) goto ask2;

    string comm;
    cout << "Enter task progress or comment : ";
    std::getline(std::cin, comm);
    std::getline(std::cin, comm);

    if ( comm.empty() ) comm = "[" + tasks[idx].second + "]";

    string date = getGmd();

    std::ostringstream os;
    os << date << "    " << name << "    " << task << "    " << h << "    " << comm;

    cout << "---------------------------------------------------\n";
    cout << os.str() << '\n' << "Is this correct (y/n) : ";

    string yn;
    std::cin >> yn;
    if ( yn != "y" ) goto ask1;

    {
        std::ofstream of("timesheet", std::ios::app | std::ios::binary);
        if ( !of ) throw string() + "Cannot write to timesheet";
        of << os.str() << '\n';
        cout << "\nTimesheet updated.\n\n";
    }

    goto ask1;
}
catch (string e)
{
    std::cout << "Error: " << e << "\n";
}
catch (...)
{
    std::cout << "Error\n";
}

struct Item
{
    double hours;
    std::set<int> tasks;
    Item(): hours(0) {}
};
typedef std::map<string, Item> Names;
typedef std::map<string, Names> Weeks;
Weeks weeks;

void genweeks()
{
    std::time_t t1 = { 1400000000L };
    std::time_t t2 = { 2000000000L };

    string o;
    for ( std::time_t t = t1; t < t2; t += 10000 ) // day is ~80000
    {
        struct std::tm * x = ::localtime(&t);
        if ( x->tm_wday != 0 ) continue;
        string s;
        s += atleast2(x->tm_year + 1900).substr(2, 2);
        s += atleast2(x->tm_mon + 1);
        s += atleast2(x->tm_mday);
        if ( o == s) continue;
        o = s;
        weeks[s] = Names();
    }
}

struct Rec
{
    string date;
    string name;
    int task;
    double hours;
    string wkend;
};

typedef std::vector< Rec > Recs;

Recs loadrecs()
{
    std::ifstream in("timesheet");

    Recs r;

    while (in)
    {
        string line;
        std::getline(in, line);
        if ( line.size() < 3 || !std::isdigit(line[0]) ) continue;
        std::istringstream is(line);

        Rec rc;
        is >> rc.date >> rc.name >> rc.task >> rc.hours;
        r.push_back(rc);
    }

    return r;
}

typedef std::map<string, double> HrsPeople;
HrsPeople hrsP;
typedef std::map<int, double> HrsTask;
HrsTask hrsT;

void report()
{
    genweeks();
    Recs recs = loadrecs();

    for ( size_t i = 0; i < recs.size(); i++ )
    {
        Rec & rc = recs[i];
        rc.wkend = weeks.lower_bound(rc.date)->first;

        if (0)
            cout << rc.wkend << ' ' << rc.name << ' '
                 << rc.task << ' ' << rc.hours << '\n';

        Item & it = weeks[rc.wkend][rc.name];
        it.hours += rc.hours;
        it.tasks.insert(rc.task);

        HrsPeople::iterator iterP = hrsP.find(rc.name);
        if ( iterP == hrsP.end() )
            iterP = hrsP.insert(std::pair<string, int>(rc.name, 0)).first;
        iterP->second += rc.hours;

        HrsTask::iterator iterT = hrsT.find(rc.task);
        if ( iterT == hrsT.end() )
            iterT = hrsT.insert(pair<int, double>(rc.task, 0)).first;
        iterT->second += rc.hours;

    }

    cout << "Time, hrs\n";

    for ( Weeks::iterator i = weeks.begin(); i != weeks.end(); ++i )
    {
        Names & names = i->second;
        if ( names.empty() ) continue;
        cout << "\nWeek ending " << (i->first) << '\n';
        for ( Names::iterator j = names.begin(); j != names.end(); ++j )
        {
            Item & it = j->second;
            cout << " " << (j->first) << "    " << it.hours << "    (";

            for ( std::set<int>::iterator k = it.tasks.begin(); k != it.tasks.end(); ++k)
                cout << ' ' << (*k);

            cout << " )\n";
        }
    }

    cout << "\n---------------------------------------------------\n";
    cout << "Total, by people\n";
    for ( HrsPeople::iterator i = hrsP.begin(); i != hrsP.end(); ++i )
        cout << " " << i->first << "    " << i->second << "\n";

    vis tasks_act = loadtasks(true);
    vis tasks_don = loadtasks(false);

    cout << "\nTotal, by task\n";
    for ( HrsTask::iterator i = hrsT.begin(); i != hrsT.end(); ++i )
    {

        int n = i->first;
        string s;
        int idxa = getidx(tasks_act, n);
        int idxd = getidx(tasks_don, n);

        if ( idxd >= 0 ) s = tasks_don[idxd].second;
        if ( idxa >= 0 ) s = tasks_act[idxa].second;

        int sz = 20 - int(s.size());
        if ( sz > 0 ) s += string(sz, ' ');

        cout << " " << i->first << "    " << s << "-"
             << "    " << i->second << "\n";
    }
}

