// Hasq Technology Pty Ltd (C) 2013-2015

#ifndef _HQ_REORGAN
#define _HQ_REORGAN

#include "ma_dag.h"

#include "hq_globalspace.h"
#include "hq_connector.h"

class Reorganiser
{
        GlobalSpace * gs;
        Connector cntr;
        ma::Dag dag;
        std::vector<Connection> nodes;
        std::vector<Connection> nodes_2chk;

        int getNumberNbs() const;

    public:

        Reorganiser(GlobalSpace * g);

        Reorganiser& discoverNet();
        void reorgNbs();
        void updateFamily_safe();

    private:

        void moveDead() { while ( moveDead1() ); }
        bool moveDead1();
        bool findInNodes(const string & name);
        void updateFamily();
};


#endif
