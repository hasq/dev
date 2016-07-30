#ifndef TRANSLIT_H
#define TRANSLIT_H
#include <string.h>
using std::string;

string translit(const string & s, bool mode = false, bool rus_only = false);
string untranslit(const string & s);

#endif
