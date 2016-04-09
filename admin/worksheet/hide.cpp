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

    string nm, pw;
    cout << "Enter your name: ";
    std::cin >> nm;
    cout << "If you do not know the password, ask your team";
    cout << "Enter password : ";
    std::cin >> pw;

    std::ofstream of("myname");
    of << nm <<'\n' <<pw;

    cout << "Thank you, " << nm << "!\nStart again";
    return "";
}

int main(int ac, char * av[])
try
{
    {
        std::ofstream of("timesheet", std::ios::app);
        if ( !of )
        {
            cout << "Timesheet not accessible. Maybe you forgot to lock it?\n";
            return 1;
        }
    }

    string name = getname();
    if ( name.empty() ) return 0;

    cout << "\n Welcome " << name << "!\n";
}

