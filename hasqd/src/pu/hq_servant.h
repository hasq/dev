// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_SERVANT
#define _HQ_SERVANT

#include <string>
#include <map>
#include <vector>

#include "os_block.h"

#include "hq_record.h"

#include "hq_globalspace.h"

using std::string;

class SvtDictionary
{
        typedef std::vector<string> vs;

        struct Value { vs args, cmd; };

        typedef std::map<string, Value> msv;

        msv data;

        bool process(std::vector<string> & toks);
        void apply(std::vector<string> & toks);
        bool apply(const string & func, const Value & v, std::vector<string> & toks);

        friend class Servant;
};

class Servant : public os::Blockable
{
        GlobalSpace * gs;

        void error(const string & text, const string & mgs, const string & ex);

        std::vector<string> be_stack;
        void addTask_line(const string & cmdLine);

        SvtDictionary dictionary;

    public:

        Servant(GlobalSpace * g);
        ~Servant();

        void runOnceUnconditionally();

        os::Semaphore * getMainSemaphore() const { return &gs->svtArea.svtSemaphore; }

        void addTask_safe(const string & cmdLine);
};

#endif
