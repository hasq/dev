// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_GL_KEY
#define _HQ_GL_KEY

#include <string>
#include <vector>

#include "os_sem.h"

#include "ma_pkc.h"

using std::string;

class KeyArea
{
        os::Semaphore access2keyArea;

        string salt;
        string ivec;
        std::vector<string> skcKeys;
        ma::Pko pubKey;

        static const int SkcOutputSecLevel = 4;

        static void digest(string & s);
        string newIvec() { digest(ivec); return ivec; }
        string newSalt() { digest(salt); return salt; }

    public:

        std::vector<string> showSkcKeys(bool randomise);
        string peekIvec() const { string x(ivec); digest(x); return x; }
        string peekSalt() const { string x(salt); digest(x); return x; }
        string showPkcKey() const { return pubKey.str(); }

    public:
        KeyArea(const std::vector<string> & skckeys, const string & skcseed);

        void addSkcKey(const string & k);
        void popSkcKey();

        string skcenc(const string & msg, bool b64, bool hex);
        string skcdec(const string & msg, bool b64, bool hex);

        bool empty() const { return skcKeys.empty(); }
};

#endif

