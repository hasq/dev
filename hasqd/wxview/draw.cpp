// Hasq Technology Pty Ltd (C) 2013-2015

#include <cmath>

#include "wxviewer.h"

struct Colors
{
    static const int SZ = 10;
    wxColor c[SZ];
    int ctr;
    wxColor next() { return c[(ctr %= SZ)++]; }
    wxColor get(int i) { return c[i % SZ]; }
    Colors(): ctr(0)
    {
        c[0] = wxColor(100, 0, 0);
        c[1] = wxColor(200, 0, 0);
        c[2] = wxColor(100, 100, 0);
        c[3] = wxColor(0, 200, 0);
        c[4] = wxColor(0, 100, 100);
        c[5] = wxColor(0, 0, 200);
        c[6] = wxColor(0, 0, 100);
        c[7] = wxColor(100, 0, 0);
        c[8] = wxColor(50, 50, 50);
        c[9] = wxColor(0, 0, 0);
    }
} colors;


struct Drawer
{
    wxDC * mDc;
    double mXpos, mYpos;
    double mW, mH;
    Canvas * mCanv;

    double mCellSize;
    double mXoff, mYoff;

    void init();

    void cell1(int i, int j, Node * n, const Canvas::Db & db,
               const Canvas::ActivityMap & st, const Canvas::PubdataMap & pd);
    void arrow(XY start, XY end);
    void mesh();

    static unsigned long digest(const string & r);
    static unsigned long digest(const std::vector<string> & v);
};

unsigned long Drawer::digest(const string & r)
{
    string s = db::Hash<db::Md5>(r).str();
    struct a2x { unsigned long f(char c) { return c > '_' ? (c - 'a') : (c - '0'); } };
    unsigned long ul = a2x().f(s[0]);
    ul *= 16; ul += a2x().f(s[1]);
    ul *= 16; ul += a2x().f(s[2]);
    ul *= 16; ul += a2x().f(s[3]);
    ul *= 16; ul += a2x().f(s[4]);
    ul *= 16; ul += a2x().f(s[5]);

    return ul;
}

unsigned long Drawer::digest(const std::vector<string> & v)
{
    string r;
    for ( unsigned i = 0; i < v.size(); i++ )
        r += v[i];

    return digest(r);
}

void DrawPane::drawCanv(wxDC & dc, double xpos, double ypos, double w, double h)
{
    int szx = mCanv->size().x();
    int szy = mCanv->size().y();
    if ( szx < 1 || szy < 1 ) return;

    Drawer drawer;
    drawer.mDc = &dc;
    drawer.mXpos = xpos;
    drawer.mYpos = ypos;
    drawer.mW = w;
    drawer.mH = h;
    drawer.mCanv = mCanv;

    drawer.init();

    drawer.mesh();

    // draw connections
    dc.SetPen( wxPen( wxColor(180, 0, 0), 1 ) );
    Canvas::mxvx & mp = mCanv->conns;
    for ( Canvas::mxvx::const_iterator i = mp.begin(); i != mp.end(); i++ )
    {
        const Canvas::vx & v = i->second;
        for ( Canvas::vx::size_type j = 0; j < v.size(); j++ )
        {
            drawer.arrow( i->first, v[j] );
        }
    }

    // draw cells
    for ( int j = 0; j < szy; j++ )
        for ( int i = 0; i < szx; i++ )
        {
            XY a(i, j);
            drawer.cell1(i, j, mCanv->node(a), mCanv->db(a), mStat, mPubdata );
        }

}

void Drawer::init()
{
    mCellSize = mW * 1.0 / mCanv->size().x();

    mXoff = (mW - mCanv->size().x() * mCellSize) / 2;
    mXoff += mCellSize / 2;

    mYoff = (mH - mCanv->size().y() * mCellSize) / 2;
    mYoff += mCellSize / 2;
}

const wxBrush & code2color(char a)
{
    switch (a)
    {
        case 'h': return *wxCYAN_BRUSH;
        case 'p': return *wxCYAN_BRUSH;
        case 'i': return *wxWHITE_BRUSH;
        case 'a': return *wxRED_BRUSH;
        case 'z': return *wxRED_BRUSH;
        case 'l': return *wxGREEN_BRUSH;
        case 'r': return *wxGREEN_BRUSH;
        case 'n': return *wxBLUE_BRUSH;
    }
    return *wxBLACK_BRUSH;
    /*
    wxBLACK_BRUSH
    wxBLUE_BRUSH
    wxCYAN_BRUSH
    wxGREEN_BRUSH
    wxGREY_BRUSH
    wxLIGHT_GREY_BRUSH
    wxMEDIUM_GREY_BRUSH
    wxRED_BRUSH
    wxTRANSPARENT_BRUSH
    wxWHITE_BRUSH
    */
}

void Drawer::cell1(int i, int j, Node * n, const Canvas::Db & db,
                   const Canvas::ActivityMap & st, const Canvas::PubdataMap & pd)
{
    double cx = mXoff + mCellSize * i - 1;
    double cy = mYoff + mCellSize * j - 1;

    double le = cx - mCellSize / 2;
    double ri = cx + mCellSize / 2;
    double to = cy - mCellSize / 2;
    double bo = cy + mCellSize / 2;

    int borderSize = 1;

    if (0)
    {
        mDc->SetPen( wxPen( wxColor(180, 180, 180), 1 ) );
        mDc->DrawLine( mXpos + le, mYpos + bo, mXpos + ri, mYpos + bo );
        mDc->DrawLine( mXpos + ri, mYpos + to, mXpos + ri, mYpos + bo );

        mDc->DrawLine( mXpos + le, mYpos + to, mXpos + ri, mYpos + to );
        mDc->DrawLine( mXpos + le, mYpos + to, mXpos + le, mYpos + bo );
    }

    if ( n && n->selected() )
    {
        mDc->SetPen( wxPen( wxColor(180, 0, 0), 2 ) );
        int off = 4;
        mDc->DrawLine( mXpos + le + off, mYpos + bo - off, mXpos + ri - off, mYpos + bo - off );
        mDc->DrawLine( mXpos + ri - off, mYpos + to + off, mXpos + ri - off, mYpos + bo - off );

        mDc->DrawLine( mXpos + le + off, mYpos + to + off, mXpos + ri - off, mYpos + to + off );
        mDc->DrawLine( mXpos + le + off, mYpos + to + off, mXpos + le + off, mYpos + bo - off );
    }

//return;

    // left wall
    if ( i == 0 )
    {
        mDc->SetPen( wxPen( wxColor(0, 0, 0), borderSize ) );
        mDc->DrawLine( mXpos + le, mYpos + to, mXpos + le, mYpos + bo );
    }

    // top wall
    if ( j == 0 )
    {
        mDc->SetPen( wxPen( wxColor(0, 0, 0), borderSize ) );
        mDc->DrawLine( mXpos + le, mYpos + to, mXpos + ri, mYpos + to );
    }

    // right
    if ( i == mCanv->size().x() - 1 )
    {
        mDc->SetPen( wxPen( wxColor(0, 0, 0), borderSize ) );
        mDc->DrawLine( mXpos + ri, mYpos + to, mXpos + ri, mYpos + bo );
    }

    // bottom
    if ( j == mCanv->size().y() - 1 )
    {
        mDc->SetPen( wxPen( wxColor(0, 0, 0), borderSize ) );
        mDc->DrawLine( mXpos + le, mYpos + bo, mXpos + ri, mYpos + bo );
    }

    int size = mCellSize / 10 + 1;

    // draw node
    if ( n )
    {
        XY xy(i, j);
        Canvas::ActivityMap::mxc::const_iterator i = st.m.find(xy);

        if ( i != st.m.end() ) mDc->SetBrush(code2color(i->second));
        else mDc->SetBrush(*wxMEDIUM_GREY_BRUSH);

        double wshadow = size / 2;
        mDc->SetPen( wxPen( wxColor(180, 180, 180), wshadow ) );
        mDc->DrawCircle( wxPoint(mXpos + cx, mYpos + cy), 3 * size );

        wshadow = size / 3;
        mDc->SetPen( wxPen( wxColor(120, 120, 120), wshadow ) );
        mDc->DrawCircle( wxPoint(mXpos + cx, mYpos + cy), 3 * size );

        mDc->SetPen( wxPen( wxColor(0, 0, 0), size / 6 ) );
        mDc->DrawCircle( wxPoint(mXpos + cx, mYpos + cy), 3 * size );

        mDc->SetBrush(*wxLIGHT_GREY_BRUSH);

        Canvas::PubdataMap::const_iterator j = pd.find(xy);
        if ( j != pd.end() )
        {
            const PubData & p = j->second;
            const std::vector<string> & v = p.clocks;
            if ( v.size() )
            {
                unsigned long ul = digest(v);
                mDc->SetBrush(wxBrush(colors.get(ul)));
                mDc->DrawCircle( wxPoint(mXpos + cx, mYpos + cy), size );
            }
        }
    }

    // draw database
    if ( !db.empty() )
    {
        for ( int i = 0; i < db.size(); i++ )
        {
            unsigned long ul = digest(db.name(i));
            mDc->SetBrush(wxBrush(colors.get(ul)));
            mDc->SetPen( wxPen( wxColor(0, 0, 0), size / 6 ) );
            int offx = (i % 4) * size;
            int offy = (i / 4) * size;
            mDc->DrawRectangle( mXpos + cx - 3 * size + offx
                                , mYpos + cy - 3 * size + offy, 1.5 * size, 1.5 * size );
        }
    }

}

void Drawer::arrow(XY start, XY end)
{
    static Colors cols;

    mDc->SetPen( wxPen( cols.next(), 1 ) );


    double cx1 = mXoff + mCellSize * start.x() - 1;
    double cy1 = mYoff + mCellSize * start.y() - 1;
    double cx2 = mXoff + mCellSize * end.x() - 1;
    double cy2 = mYoff + mCellSize * end.y() - 1;

    double size = mCellSize / 10.0 + 1;
    size /= 4;

    double vx = cx2 - cx1;
    double vy = cy2 - cy1;

    // rotate
    double tmp = vy;
    vy = vx;
    vx = -tmp;

    double length = std::sqrt(vx * vx + vy * vy);
    vx *= size / length;
    vy *= size / length;

    mDc->DrawLine( mXpos + cx1 + vx, mYpos + cy1 + vy, mXpos + cx2 + vx, mYpos + cy2 + vy );

    mDc->DrawCircle( wxPoint(mXpos + cx2, mYpos + cy2), 2 * size );

    // draw arrow

    double mid_x = (cx1 * 1.5 + cx2) / 2.5 + vx;
    double mid_y = (cy1 * 1.5 + cy2) / 2.5 + vy;

    double asize = 2;
    vx *= asize;
    vy *= asize;

    double bx = -vy;
    double by = vx;

    mDc->DrawLine( mXpos + mid_x, mYpos + mid_y, mXpos + mid_x + bx + vx, mYpos + mid_y + by + vy);
    mDc->DrawLine( mXpos + mid_x, mYpos + mid_y, mXpos + mid_x + bx - vx, mYpos + mid_y + by - vy);
}

void Drawer::mesh()
{
    mDc->SetPen( wxPen( wxColor(180, 180, 180), 1 ) );

    int szx = mCanv->size().x();
    int szy = mCanv->size().y();

    for ( int i = 1; i < szx; i++ )
        mDc->DrawLine( mXpos + i * mCellSize, mYpos, mXpos + i * mCellSize, mYpos + mH );

    for ( int i = 1; i < szy; i++ )
        mDc->DrawLine( mXpos, mYpos + i * mCellSize, mXpos + mW, mYpos + i * mCellSize );
}
