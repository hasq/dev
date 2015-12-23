// Hasq Technology Pty Ltd (C) 2013-2015

#ifndef _HQ_CONNECTOR
#define _HQ_CONNECTOR

#include "hq_record.h"

#include "hq_globalspace.h"

class Connector
{
        GlobalSpace * gs;


        db::Record * trygetrec(const string & dbname, gl::intint N,
                               const string & Dn, const string & from);

        db::Record * trygetrec(Connection & con, const string & dbname,
                               gl::intint N, const string & Dn);

        void take_care_of_hints();
        void populate_neighbours();
        void sendConflict(const string & dbname, const string & Dn);
        static void updateCon(const Connection & c, std::vector<Connection> & v);

    public:
        Connector(GlobalSpace * g): gs(g) {}

        void update_neighbours();

        void sendNotification(const string & dbname, gl::intint N, const string & Dn);
        void sendNotification(int dbidx, gl::intint N, const string & Dn);

        er::Code notificationReceived(int dbidx, gl::intint N,
                                      const string & Dn, const string & from);

        er::Code notificationReceived(const string & dbname, gl::intint N,
                                      const string & Dn, const string & from);

        void assignNeighbour(const string & ipport);

        // check if is alive and get its name
        bool isaliveName(const string & ipport, string & name);

        // just check if is alive
        bool isalivePing(const string & ipport);

        enum TalkStatus { Dead, ReplyErr, ReplyOk };
        TalkStatus talk_ip(const string & ipport, const string & cmd, string & reply);
        TalkStatus talk(Connection & ctn, const string & cmd, string & reply);

        std::vector<Connection> getNbs_safe();
        std::vector<Connection> getFamily_safe();
        void updateNbs_safe(const Connection & c);
        void updateFam_safe(const Connection & c);

        std::vector<db::Record *> getRangeFrom
        (
            const string & ipport, int idx,
            const string & sdn, gl::intint b,
            gl::intint e, bool * alive
        );

        void sendConflict(int idx, const string & sdn);
        void checkConflict(int idx, const string & sdn);


        // sectiond for family discovery
        struct FamNode
        {
            Connection connection;
            bool neighbour;
            bool dead;
        };
        std::vector<FamNode> askFamNodes(Connection & ctn);

        // returns empty ipport if not found
        Connection findInFamByName_safe(const string & name);
};



#endif
