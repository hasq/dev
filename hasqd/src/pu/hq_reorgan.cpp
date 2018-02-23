// Hasq Technology Pty Ltd (C) 2013-2016

#include "gl_utils.h"

#include "sg_mutex.h"

#include "hq_reorgan.h"

int Reorganiser::getNumberNbs() const { return gl::st2i(gs->conArea.max_neighbours); }

Reorganiser::Reorganiser(GlobalSpace * g) :
    gs(g),
    cntr(g),
    dag(gs->config->nodename, getNumberNbs())
{
}

bool Reorganiser::moveDead1()
{
    // move movable dead nbs to potential
    {
        ConArea & ca = gs->conArea;
        sgl::Mutex mtx(ca.access2conArea);
        std::vector<Connection> & nbs = ca.neighbours;
        std::vector<Connection> & pts = ca.otherfamily;

        for ( size_t i = 0; i < nbs.size(); i++ )
        {
            if ( nbs[i].isAlive() ) continue;
            if ( nbs[i].locked ) continue;

            gl::add(pts, nbs[i]);

            for ( size_t j = i + 1; j < nbs.size(); j++ )
                nbs[j - 1] = nbs[j];

            nbs.pop_back();
            return true;
        }
    } // release

    return false;
}

// very complex function with much subtlety
Reorganiser & Reorganiser::discoverNet()
{
    moveDead();

    // discover other nodes but remove dead nbs
    std::vector<Connection> myfam = cntr.getFamily_safe();
    std::vector<Connection> mynbs = cntr.getNbs_safe();

    gl::merge(nodes_2chk, myfam);
    gl::merge(nodes_2chk, mynbs);

    const string & me = gs->config->nodename;


    // Before going through nodes, lets make intermediate containers
    // this is necessary to avoid adding nodes which are not dead
    // on another node links, but proven dead here.
    // Instead of adding all nodes to dag, we collect them first
    // and then add after this while loop is done
    std::vector<string> dead_nodes;
    std::vector<string> dag_add;
    typedef std::pair<string, string> pss;
    std::vector<pss> dag_link;

    while ( !nodes_2chk.empty() )
    {
        Connection node = nodes_2chk.back();
        nodes_2chk.pop_back();

        std::vector<Connector::FamNode> vfam = cntr.askFamNodes(node);

        bool nodeIsMyNbs = gl::isin(mynbs, node);
        cntr.updateFam_safe(node);

        if ( !node.isAlive() )
        {
            gl::add(dead_nodes, node.name);
            if ( nodeIsMyNbs )
            {
                moveDead();
                mynbs = cntr.getNbs_safe();
            }
            continue;
        }

        gl::add(nodes, node); // maybe new in family

        for ( size_t i = 0; i < vfam.size(); i++ )
        {
            const Connector::FamNode & fn = vfam[i];

            const string & fnname = fn.connection.name;

            if ( fnname == me )
                continue;

            if ( !findInNodes(fnname) )
                nodes_2chk.push_back(fn.connection);

            gl::add(dag_add, node.name);
            //dag.add(node.name, false);

            if ( fn.dead )
                continue;

            gl::add(dag_add, fnname);
            //dag.add(fnname, false);

            if ( fn.neighbour )
                dag_link.push_back( pss(node.name, fnname) );
            //dag.link(node.name, fnname);
        }
    } // while

    // now process accumulated dag containers
    for ( size_t i = 0; i < dag_add.size(); i++ )
        if ( !gl::isin(dead_nodes, dag_add[i]) )
            dag.add(dag_add[i], false);

    for ( size_t i = 0; i < dag_link.size(); i++ )
    {
        const string & n1 = dag_link[i].first;
        const string & n2 = dag_link[i].second;
        if ( gl::isin(dead_nodes, n1) ) continue;
        if ( gl::isin(dead_nodes, n2) ) continue;
        dag.link(n1, n2);
    }

    // now add my nbs and links
    // need because nb could be DL (dead and locked) so not added
    for ( size_t i = 0; i < mynbs.size(); i++ )
    {
        dag.add(mynbs[i].name, mynbs[i].locked);
        dag.link(me, mynbs[i].name);
    }

    return *this;
}

void Reorganiser::reorgNbs()
{
    dag.evaluate();

    const std::vector<ma::Node *> & dag_nbs = dag.me()->nbs;

    // 1 lock mutexes
    // 2 update family
    // 3 remove from nbs those which are not in dag_nbs
    // 4 add to nbs those which are in dag_nbs

    // 1
    ConArea & ca = gs->conArea;
    sgl::Mutex mtx(ca.access2conArea);

    // 2
    updateFamily();

    std::vector<Connection> & nbs = ca.neighbours;
    std::vector<Connection> & pot = ca.otherfamily;

    // 3
    {
        std::vector<Connection> new_nbs;
        for ( size_t j = 0; j < nbs.size(); j++ )
        {
            bool found = false;

            for ( size_t i = 0; i < dag_nbs.size(); i++ )
            {
                string dagNbsName = dag_nbs[i]->name;
                if ( dagNbsName != nbs[j].name ) continue;
                found = true;
                break;
            }

            if (found)
                new_nbs.push_back(nbs[j]);
            else
                gl::add(pot, nbs[j]);
        }

        if ( new_nbs.size() != nbs.size() )
            nbs.swap(new_nbs);
    }

    // 4
    for ( size_t i = 0; i < dag_nbs.size(); i++ )
    {
        string dagNbsName = dag_nbs[i]->name;
        bool found = false;

        for ( size_t j = 0; j < nbs.size(); j++ )
        {
            if ( dagNbsName != nbs[j].name ) continue;
            found = true;
            break;
        }

        if ( found )
            continue;

        std::vector<Connection> new_pot;

        found = false;
        for ( size_t j = 0; j < pot.size(); j++ )
        {
            if ( dagNbsName == pot[j].name )
            {
                found = true;
                nbs.push_back(pot[j]);
                continue;
            }
            new_pot.push_back(pot[j]);
        }

        if ( found )
            pot.swap(new_pot);

    } // for

}

void Reorganiser::updateFamily_safe()
{
    ConArea & ca = gs->conArea;
    sgl::Mutex mtx(ca.access2conArea);
    updateFamily();
}

void Reorganiser::updateFamily()
{
    // have mutex already
    ConArea & ca = gs->conArea;
    const std::vector<Connection> & nbs = ca.neighbours;
    std::vector<Connection> & pot = ca.otherfamily;

    for ( size_t i = 0; i < nodes.size(); i++ )
    {
        if ( gl::isin(nbs, nodes[i]) ) continue;
        if ( gl::isin(pot, nodes[i]) ) continue;
        pot.push_back( nodes[i] );
    }

    gs->svtArea.addJob_safe(SvtJob(gs, SvtJob::Conupdate));
}

bool Reorganiser::findInNodes(const string & name)
{
    for ( size_t i = 0; i < nodes.size(); i++ )
        if ( nodes[i].name == name ) return true;

    for ( size_t i = 0; i < nodes_2chk.size(); i++ )
        if ( nodes_2chk[i].name == name ) return true;

    return false;
}

