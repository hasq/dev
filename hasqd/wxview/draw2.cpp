// Hasq Technology Pty Ltd (C) 2013-2015

#include "wxviewer.h"

void DrawPane::OnContextItem( wxCommandEvent & event )
{
    int id = event.GetId();

    status( _("Item: ") + towx(id) );

    Refresh();
}


wxMenu * DrawPane::createContextMenu(XY xy)
{
    ctx_curpos = xy;
    wxMenu * menu = new wxMenu;
    Node * n = mCanv->node(xy);
    if ( !n )
    {
        menu->Append( IDC_New, _("Start node at ") + towx(xy) + " ..." );
        menu->Append( IDC_DbMak, _("Create cell database ...") );
        menu->Append( IDC_DbRem, _("Erase cell database") );
    }
    else
    {
        menu->Append( IDC_Shut, _("Shutdown node at ") + towx(xy) );
        menu->Append( IDC_Send, _("Send command ...") );
        menu->Append( IDC_Conn, _("Refresh connections") );
        menu->Append( IDC_Mkcon, _("Connect to selected") );
        if ( !mCanv->areSomeOtherSelected(ctx_curpos) ) menu->Enable(IDC_Mkcon, false);
        menu->Append( IDC_Cross, _("Connect to cross neighbours") );
        menu->Append( IDC_Inject, _("Servant injection ...") );
        menu->Append( IDC_Reo, _("Force reorganise") );
    }

#define NEWHAN(x,y) \
    GetEventHandler()->Connect( x, wxEVT_COMMAND_MENU_SELECTED, \
     (wxObjectEventFunction) (wxEventFunction)  \
    (wxCommandEventFunction) &DrawPane::y );

    NEWHAN(IDC_New, OnCtx_new)
    NEWHAN(IDC_Shut, OnCtx_shut)
    NEWHAN(IDC_DbMak, OnCtx_dbmak)
    NEWHAN(IDC_DbRem, OnCtx_dbrem)
    NEWHAN(IDC_Send, OnCtx_send)
    NEWHAN(IDC_Conn, OnCtx_conn)
    NEWHAN(IDC_Mkcon, OnCtx_mkcon)
    NEWHAN(IDC_Cross, OnCtx_cross)
    NEWHAN(IDC_Inject, OnCtx_inject)
    NEWHAN(IDC_Reo, OnCtx_reo)

#undef NEWHAN

    return menu;
}

void DrawPane::deleteContextMenu(wxMenu * menu)
{
#define DELHAN(x) \
    GetEventHandler()->Disconnect( x );

    DELHAN(IDC_New)
    DELHAN(IDC_Shut)
    DELHAN(IDC_DbMak)
    DELHAN(IDC_DbRem)
    DELHAN(IDC_Send)
    DELHAN(IDC_Conn)
    DELHAN(IDC_Mkcon)
    DELHAN(IDC_Cross)
    DELHAN(IDC_Inject)
    DELHAN(IDC_Reo)

#undef DELHAN

    delete menu;
}

void DrawPane::startOne()
{
    try
    {
        mCanv->addNode(ctx_curpos);
    }
    catch (gl::ex e)
    {
        wxMessageBox( towx("Error: " + e.str()), _("ERROR"), wxOK | wxICON_INFORMATION, NULL );
        return;
    }

    status( _("New: ") + towx(ctx_curpos) );

    Refresh();
}

void DrawPane::OnCtx_new( wxCommandEvent & event )
{
    DialogNewNode dia ( ctx_curpos, mCanv->hint, this, -1, _("New node"),
                        wxDefaultPosition, wxSize(530, 220) );

    if ( dia.ShowModal() != wxID_OK ) return;

    string c = dia.cmd->GetValue();
    mCanv->hint = c;

    try
    {
        mCanv->addNode(ctx_curpos);
    }
    catch (gl::ex e)
    {
        wxMessageBox( towx("Error: " + e.str()), _("ERROR"), wxOK | wxICON_INFORMATION, NULL );
        return;
    }

    int id = event.GetId();

    status( _("New: ") + towx(id) );

    Refresh();
}

DialogNewNode::DialogNewNode ( XY cp, const string & cmdH, wxWindow * parent, wxWindowID id,
                               const wxString & title,
                               const wxPoint & position, const wxSize & size, long style )
    : wxDialog( parent, id, title, position, size, style)
{

    SetSize(size);
    wxPoint p;

    int NL = 10;

    p.x = NL; p.y = 20;

    new wxStaticText ( this, -1, _("Position"), p );
    p.x += 70;
    new wxStaticText ( this, -1, towx(cp.x()) + _(" X ") + towx(cp.y()), p );

    p.x = NL; p.y += 20;

    new wxStaticText( this, -1, _("Command"), p );
    p.x += 70;
    cmd = new wxTextCtrl ( this, -1, towx(cmdH), p, wxSize(400, 100) );

    p.y = size.GetHeight() - 60;
    p.x = size.GetWidth() - 100;
    wxButton * b = new wxButton( this, wxID_OK, _("OK"), p, wxDefaultSize );
    p.x -= 100;
    wxButton * c = new wxButton( this, wxID_CANCEL, _("Cancel"), p, wxDefaultSize );
}

void DrawPane::OnCtx_shut( wxCommandEvent & event )
{
    try
    {
        mCanv->delNode(ctx_curpos);
    }
    catch (gl::ex e)
    {
        err(e);
        return;
    }

    status( _("Shutdown: ") + towx(ctx_curpos) );

    Refresh();
}

void DrawPane::OnCtx_reo( wxCommandEvent & event )
{
    try
    {
        mCanv->forceOneReo(ctx_curpos);
    }
    catch (gl::ex e)
    {
        err(e);
        return;
    }

    status( _("Reo: ") + towx(ctx_curpos) );

    Refresh();
}

DialogNewDb::DialogNewDb ( XY cp, wxWindow * parent, wxWindowID id,
                           const wxString & title,
                           const wxPoint & position, const wxSize & size, long style )
    : wxDialog( parent, id, title, position, size, style)
{

    SetSize(size);
    wxPoint p;

    int NL = 10;

    p.x = NL; p.y = 10;

    new wxStaticText( this, -1, _("Default"), p );
    p.x += 70;
    chk = new wxCheckBox ( this, IDD_NewDbChk, towx(" all hashes"), p );
    chk->SetValue(false);

    p.x = NL; p.y += 25;
    new wxStaticText ( this, -1, _("Position"), p );
    p.x += 70;

    if ( cp.x() < 0 )
        new wxStaticText ( this, -1, _("All cells"), p );
    else
        new wxStaticText ( this, -1, towx(cp.x()) + _(" X ") + towx(cp.y()), p );

    p.x = NL; p.y += 25;
    new wxStaticText( this, -1, _("Db name"), p );
    p.x += 70;
    uN = new wxTextCtrl ( this, -1, towx("_wrd"), p, wxSize(80, -1) );

    p.x = NL; p.y += 30;
    new wxStaticText( this, -1, _("Hash name"), p );
    p.x += 70;
    sN = new wxTextCtrl ( this, -1, towx("wrd"), p, wxSize(80, -1) );

    p.x = NL; p.y += 30;
    new wxStaticText( this, -1, _("Full name"), p );
    p.x += 70;
    fN = new wxTextCtrl ( this, -1, towx("Word"), p, wxSize(80, -1) );

    p.x = NL; p.y += 30;
    new wxStaticText( this, -1, _("G-number"), p );
    p.x += 70;
    nG = new wxTextCtrl ( this, -1, towx("1"), p, wxSize(80, -1) );

    p.x = NL; p.y += 30;
    new wxStaticText( this, -1, _("Magic"), p );
    p.x += 70;
    mag = new wxTextCtrl ( this, -1, towx(""), p, wxSize(80, -1) );

    p.x = NL; p.y += 30;
    new wxStaticText( this, -1, _("SizeKb"), p );
    p.x += 70;
    sz = new wxTextCtrl ( this, -1, towx("100"), p, wxSize(80, -1) );

    p.x = NL; p.y += 30;
    new wxStaticText( this, -1, _("Thickness"), p );
    p.x += 70;
    th = new wxTextCtrl ( this, -1, towx("0"), p, wxSize(80, -1) );

    p.y = size.GetHeight() - 60;
    p.x = size.GetWidth() - 100;
    wxButton * b = new wxButton( this, wxID_OK, _("OK"), p, wxDefaultSize );
    p.x -= 100;
    wxButton * c = new wxButton( this, wxID_CANCEL, _("Cancel"), p, wxDefaultSize );
}

void DialogNewDb::On_Chk( wxCommandEvent & event )
{
    bool a = !chk->GetValue();
    uN->Enable(a);
    sN->Enable(a);
    fN->Enable(a);
    nG->Enable(a);
    mag->Enable(a);
    sz->Enable(a);
    th->Enable(a);
}

void DrawPane::OnCtx_dbmak( wxCommandEvent & event )
{
    DialogNewDb dia ( ctx_curpos, this, -1, _("New db"),
                      wxDefaultPosition, wxSize(230, 350) );

    if ( dia.ShowModal() != wxID_OK ) return;

    string uN = dia.uN->GetValue();
    string sN = dia.sN->GetValue();
    string fN = dia.fN->GetValue();
    string nG_s = dia.nG->GetValue();
    int nG = gl::toi(nG_s);
    string mag = dia.mag->GetValue();
    int sz = gl::toi(dia.sz->GetValue());
    int th = gl::toi(dia.th->GetValue());

    try
    {
        if ( dia.chk->GetValue() )
            mCanv->addDbAll(ctx_curpos);
        else
            mCanv->addDb(ctx_curpos, uN, sN, fN, nG, mag, sz, th);
    }
    catch (gl::ex e)
    {
        err(e);
        return;
    }

    status( _("DB make: ") + towx(ctx_curpos) );

    Refresh();
}

void DrawPane::OnCtx_dbrem( wxCommandEvent & event )
{
    try
    {
        mCanv->delDb(ctx_curpos);
    }
    catch (gl::ex e)
    {
        err(e);
        return;
    }

    status( _("DB remove: ") + towx(ctx_curpos) );

    Refresh();
}

DialogShowText::DialogShowText ( XY cp, wxWindow * parent, wxWindowID id,
                                 const wxString & title,
                                 const wxPoint & position, const wxSize & size, long style )
    : wxDialog( parent, id, title, position, size, style)
{

    SetSize(size);
    wxPoint p;

    int NL = 10;

    p.x = NL; p.y = 10;

    new wxStaticText ( this, -1, _("Position"), p );
    p.x += 70;
    new wxStaticText ( this, -1, towx(cp.x()) + _(" X ") + towx(cp.y()), p );

    p.x = NL; p.y += 20;

    new wxStaticText( this, -1, _("Text"), p );
    p.x += 70;
    text = new wxTextCtrl ( this, -1, towx(""), p, wxSize(450, 450), wxTE_MULTILINE );

    p.y = size.GetHeight() - 60;
    p.x = size.GetWidth() - 100;
    wxButton * b = new wxButton( this, wxID_OK, _("OK"), p, wxDefaultSize );
    p.x -= 100;
    //wxButton * c = new wxButton( this, wxID_CANCEL, _("Cancel"), p, wxDefaultSize );
}


void DrawPane::OnCtx_conn( wxCommandEvent & event )
{
    int n = -1;
    try
    {
        status( _("Connecting to ") + towx(ctx_curpos) + " ..." );
        n = mCanv->refreshConn(ctx_curpos);
    }
    catch (gl::ex e)
    {
        err(e);
        status( _("Connection failed") );
        return;
    }

    status( _("Connections refreshed: ") + towx(n) );

    Refresh();
}

void DrawPane::interconnectSelected()
{
    try
    {
        mCanv->interconnectSelected();
    }
    catch (gl::ex e)
    {
        err(e);
        status( _("Connection failed") );
        return;
    }

    Refresh();
}

int DrawPane::refreshAllConn()
{
    int n = -1;
    try
    {
        status( _("Connecting to all ...") );
        n = mCanv->refreshAllConn();
    }
    catch (gl::ex e)
    {
        err(e);
        status( _("Connection failed") );
        return -1;
    }

    status( _("Connections refreshed: ") + towx(n) );

    Refresh();

    return n;
}

void DrawPane::OnCtx_mkcon( wxCommandEvent & event )
{
    try
    {
        status( _("Making connections for ") + towx(ctx_curpos) + " ..." );
        mCanv->createConnections(ctx_curpos);
    }
    catch (gl::ex e)
    {
        err(e);
        status( _("Connection failed") );
        return;
    }

    status( _("Connections created") );
    Refresh();
}


void DrawPane::toggleSelected()
{
    try
    {
        mCanv->toggleSelected();
    }
    catch (gl::ex e)
    {
        err(e);
        status( _("Failed") );
        return;
    }

    Refresh();
}

void DrawPane::OnCtx_cross( wxCommandEvent & event )
{
    try
    {
        status( _("Making cross connections for ") + towx(ctx_curpos) + " ..." );
        mCanv->crossOne(ctx_curpos);
    }
    catch (gl::ex e)
    {
        err(e);
        status( _("Connection failed") );
        return;
    }

    status( _("Connections created") );
    Refresh();
}

void DrawPane::crossAll()
{
    try
    {
        status( _("Crossing all ...") );
        static_pane = this;
        mCanv->crossAll(static_status);
    }
    catch (gl::ex e)
    {
        err(e);
        status( _("Failed") );
        return;
    }

    status( _("Connections created") );
    Refresh();
}

void DrawPane::startInAll()
{
    try
    {
        status( _("Starting nodes in all cells") );
        static_pane = this;
        mCanv->startInAll(static_status);
    }
    catch (gl::ex e)
    {
        err(e);
        status( _("Failed") );
        Refresh();
        return;
    }

    status( _("Done") );
    Refresh();
}

void DrawPane::stopInAll()
{
    try
    {
        status( _("Shutting down all nodes") );
        static_pane = this;
        mCanv->stopInAll(static_status);
    }
    catch (gl::ex e)
    {
        err(e);
        status( _("Failed") );
        return;
    }

    status( _("Done") );
    Refresh();
}

void DrawPane::dbmak()
{
    DialogNewDb dia ( ctx_curpos, this, -1, _("New db in all cells"),
                      wxDefaultPosition, wxSize(230, 350) );

    if ( dia.ShowModal() != wxID_OK ) return;

    string uN = dia.uN->GetValue();
    string sN = dia.sN->GetValue();
    string fN = dia.fN->GetValue();
    string nG_s = dia.nG->GetValue();
    int nG = gl::toi(nG_s);
    string mag = dia.mag->GetValue();
    int sz = gl::toi(dia.sz->GetValue());
    int th = gl::toi(dia.th->GetValue());

    try
    {
        status( _("Making databases in all cells") );
        static_pane = this;
        if ( dia.chk->GetValue() )
            mCanv->addDbAll(static_status);
        else
            mCanv->addDb(static_status, uN, sN, fN, nG, mag, sz, th);
    }
    catch (gl::ex e)
    {
        err(e);
        status( _("Failed") );
        return;
    }

    status( _("Done") );
    Refresh();
}

void DrawPane::dbdel()
{
    try
    {
        status( _("Eraseing all databases") );
        static_pane = this;
        mCanv->dbdel(static_status);
    }
    catch (gl::ex e)
    {
        err(e);
        status( _("Failed") );
        return;
    }

    status( _("Done") );
    Refresh();
}

void DrawPane::anim_next()
{
    if ( anim_xy.x() < 0 ) return;
    XY sz = mCanv->size();

    anim_xy = XY ( anim_xy.x() + 1, anim_xy.y() );

    if ( anim_xy.x() < sz.x() ) return;

    anim_xy = XY ( 0, anim_xy.y() + 1 );

    if ( anim_xy.y() < sz.y() ) return;

    anim_xy = XY ( -1, -1 );
}

void DrawPane::OnCtx_inject( wxCommandEvent & event )
{
    DialogShowText dia ( ctx_curpos, this, -1, _("Servant injection"),
                         wxDefaultPosition, wxSize(550, 550) );

    dia.text->SetValue( injection );

    if ( dia.ShowModal() != wxID_OK ) return;

    injection = dia.text->GetValue();

    try
    {
        status( _("Servant injection for ") + towx(ctx_curpos) + " ..." );
        mCanv->inject(ctx_curpos, injection);
    }
    catch (gl::ex e)
    {
        err(e);
        status( _("Failed") );
        return;
    }

    status( _("Commend injected: see \"info log critical\" for possible errors") );
    Refresh();
}

