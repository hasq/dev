// Hasq Technology Pty Ltd (C) 2013-2015

#include <algorithm>

#include "wxviewer.h"

void DrawPane::OnCtx_send( wxCommandEvent & event )
{
    DialogSendCmdEx dia ( mCanv, ctx_curpos, this, -1, _("Send command"),
                          wxDefaultPosition, wxSize(600, 460) );

    dia.cmd->SetValue( cmd );

    if ( dia.ShowModal() != wxID_OK ) return;

    cmd = dia.cmd->GetValue();

    try
    {
        status( _("Sending (please wait): ") + towx(cmd) );
        string reply = mCanv->send(ctx_curpos, cmd);
        last_reply = reply;

        const bool SHOW_BOX = false;
        if ( SHOW_BOX )
        {
            if ( reply.size() > 1000 ) reply = reply.substr(0, 1000) + " ... (cut by GUI)";
            wxMessageBox( towx(reply), _("Reply"), wxOK | wxICON_INFORMATION, NULL );
        }

        if ( reply.size() > 100 ) reply = reply.substr(0, 100) + " ...";
        status( _("Received: [") + towx(reply) + _("]") );
    }
    catch (gl::ex e)
    {
        wxMessageBox( towx("Error: " + e.str()), _("ERROR"), wxOK | wxICON_INFORMATION, NULL );
        return;
    }

    Refresh();
}


DialogSendCmdEx::DialogSendCmdEx ( Canvas * canv, XY cp, wxWindow * parent, wxWindowID id,
                                   const wxString & title,
                                   const wxPoint & position, const wxSize & size, long style )
    : wxDialog( parent, id, title, position, size, style)
{

    mCanv = canv;
    ctx_curpos = cp;

    SetSize(size);
    wxPoint p;

    int NL = 10;

    p.x = NL; p.y = 10;

    new wxStaticText ( this, -1, _("Position"), p );
    p.x += 70;

    if ( cp.x() < 0 )
        new wxStaticText ( this, -1, _("All"), p );
    else
        new wxStaticText ( this, -1, towx(cp.x()) + _(" X ") + towx(cp.y()), p );

    p.x = NL; p.y += 20;

    new wxStaticText( this, -1, _("Command"), p );
    p.x += 70;
    cmd = new wxTextCtrl ( this, -1, towx(""), p, wxSize(500, 50), wxTE_MULTILINE );

    p.x = NL; p.y += 60;
    //new wxStaticText( this, -1, _("Generate"), p ); p.x += 70;
    int b_sp = 48;
    int hb = 25;
    bZero = new wxButton ( this, IDD_bZero, towx("zero"), p, wxSize(40, hb) ); p.x += b_sp;
    bAdd = new wxButton ( this, IDD_bAdd, towx("add"), p, wxSize(40, hb) ); p.x += b_sp;
    bLast = new wxButton ( this, IDD_bLast, towx("last"), p, wxSize(40, hb) ); p.x += b_sp;
    bData = new wxButton ( this, IDD_bData, towx("data"), p, wxSize(40, hb) ); p.x += b_sp;
    bRange = new wxButton ( this, IDD_bRange, towx("range"), p, wxSize(40, hb) ); p.x += b_sp;
    bPing = new wxButton ( this, IDD_bPing, towx("conf"), p, wxSize(40, hb) ); p.x += b_sp;
    bInfo = new wxButton ( this, IDD_bInfo, towx("info"), p, wxSize(40, hb) ); p.x += b_sp;
    bFile = new wxButton ( this, IDD_bFile, towx("file"), p, wxSize(40, hb) ); p.x += b_sp;
    bHtml = new wxButton ( this, IDD_bHtml, towx("html"), p, wxSize(40, hb) ); p.x += b_sp;
    bJob = new wxButton ( this, IDD_bJob, towx("job"), p, wxSize(40, hb) ); p.x += b_sp;
    bCon = new wxButton ( this, IDD_bCon, towx("conn"), p, wxSize(40, hb) ); p.x += b_sp;
    bNote = new wxButton ( this, IDD_bNote, towx("note"), p, wxSize(40, hb) ); p.x += b_sp;

    //bZero->Enable(false);
    //bAdd->Enable(false);
    //bLast->Enable(false);
    //bData->Enable(false);
    //bRange->Enable(false);
    //bPing->Enable(false);
    //bInfo->Enable(false);
    //bFile->Enable(false);
    //bHtml->Enable(false);
    //bJob->Enable(false);
    //bCon->Enable(false);
    //bNote->Enable(false);

    p.x = NL; p.y += 40;
    bRecord = new wxButton ( this, IDD_bRecord, towx("Record"), p, wxSize(60, hb) ); p.x += 70;
    tRecord = new wxTextCtrl ( this, -1, towx(""), p, wxSize(500, -1) );

    p.x = NL; p.y += 40;
    new wxStaticText( this, -1, _("N"), p ); p.x += 40;
    tN = new wxTextCtrl ( this, -1, _("0"), p, wxSize(40, -1) ); p.x += 80;
    new wxStaticText( this, -1, _("UN"), p ); p.x += 30;
    tUn = new wxTextCtrl ( this, -1, _("_wrd"), p, wxSize(40, -1) ); p.x += 80;
    new wxStaticText( this, -1, _("Sign"), p ); p.x += 30;
    tSign = new wxTextCtrl ( this, -1, _("*"), p, wxSize(40, -1) ); p.x += 80;
    bRecpwd = new wxButton ( this, IDD_bRecpwd, towx("Recpwd"), p, wxSize(60, hb) ); p.x += 70;

    p.x = NL; p.y += 40;
    new wxStaticText( this, -1, _("DN"), p ); p.x += 40;
    tDn = new wxTextCtrl ( this, -1, _(""), p, wxSize(120, -1) ); p.x += 160;

    new wxStaticText( this, -1, _("RDN"), p ); p.x += 40;
    tRdn = new wxTextCtrl ( this, -1, _("rdn"), p, wxSize(120, -1) ); p.x += 160;

    p.x = NL; p.y += 30;
    new wxStaticText( this, -1, _("K"), p ); p.x += 40;
    tK = new wxTextCtrl ( this, -1, _(""), p, wxSize(120, -1) ); p.x += 160;

    new wxStaticText( this, -1, _("PWD"), p ); p.x += 40;
    tPwd = new wxTextCtrl ( this, -1, _("password"), p, wxSize(120, -1) ); p.x += 160;

    p.x = NL; p.y += 30;
    new wxStaticText( this, -1, _("G"), p ); p.x += 40;
    tG = new wxTextCtrl ( this, -1, _(""), p, wxSize(120, -1) ); p.x += 160;

    p.x = NL; p.y += 30;
    new wxStaticText( this, -1, _("O"), p ); p.x += 40;
    tO = new wxTextCtrl ( this, -1, _(""), p, wxSize(120, -1) ); p.x += 160;
    p.x = NL; p.y += 30;

    new wxStaticText( this, -1, _("T"), p ); p.x += 40;
    tT = new wxTextCtrl ( this, -1, _(""), p, wxSize(120, -1) ); p.x += 160;

    p.x = NL; p.y += 30;
    new wxStaticText( this, -1, _("D"), p ); p.x += 40;
    tD = new wxTextCtrl ( this, -1, _(""), p, wxSize(120, -1) ); p.x += 160;

    // OK and Cancel
    p.y = size.GetHeight() - 60;
    p.x = size.GetWidth() - 100;
    wxButton * b = new wxButton( this, wxID_OK, _("OK"), p, wxDefaultSize );
    p.x -= 100;
    wxButton * c = new wxButton( this, wxID_CANCEL, _("Cancel"), p, wxDefaultSize );
}


void DialogSendCmdEx::On_bPing( wxCommandEvent & event )
{
    if ( tDn->GetValue().empty() ) On_bRecpwd(event);
    string dn = tDn->GetValue();
    string un = tUn->GetValue();
    cmd->SetValue( _("conflict ") + un + " " + dn );
}

void DialogSendCmdEx::On_bZero_or_bAdd( wxCommandEvent & event, string s )
{
    wxString sp = _(" ");

    if ( tRecord->GetValue().empty() ) On_bRecord(event);

    cmd->SetValue( _("") + s + sp
                   + tSign->GetValue() + sp
                   + tUn->GetValue() + sp
                   + tRecord->GetValue() );
}

void DialogSendCmdEx::On_bZero( wxCommandEvent & event )
{
    On_bZero_or_bAdd(event, "zero");
}

void DialogSendCmdEx::On_bAdd( wxCommandEvent & event )
{
    On_bZero_or_bAdd(event, "add");
}

void DialogSendCmdEx::On_bRecpwd( wxCommandEvent & event )
{
    string un = tUn->GetValue();
    string N = tN->GetValue();
    string rdn = tRdn->GetValue();
    string pwd = tPwd->GetValue();

    try
    {
        string r = mCanv->recpwd(ctx_curpos, un, N, rdn, pwd);

        std::vector<string> toks = gl::tokenise(r);

        int sz = toks.size();
        if ( sz < 4u )
        {
            err(gl::ex("Recpwd failed: possibly database does not exist for UN=" + un
                       + "\nMore details:\n" + r));
            return;
        }

        tN->SetValue( towx(toks[0]) );
        tDn->SetValue( towx(toks[1]) );
        tK->SetValue( towx(toks[2]) );
        int i = 3;
        string gs;
        for ( ; i < sz - 1; i++ )
        {
            if ( i != 3 ) gs += ' ';
            gs += toks[i];
        }

        tG->SetValue( towx(gs) );
        tO->SetValue( towx(toks[i]) );

    }
    catch (gl::ex e)
    {
        err(e);
        return;
    }

}

void DialogSendCmdEx::On_bRecord( wxCommandEvent & event )
{
    if ( tDn->GetValue().empty() ) On_bRecpwd(event);

    wxString sp = _(" ");
    wxString r = tN->GetValue();

    r += sp + tDn->GetValue();
    r += sp + tK->GetValue();
    r += sp + tG->GetValue();
    r += sp + tO->GetValue();
    if ( !tT->GetValue().empty() ) r += sp + tT->GetValue();
    if ( !tD->GetValue().empty() ) r += sp + tD->GetValue();

    tRecord->SetValue( r );
}


void DialogSendCmdEx::On_bInfo( wxCommandEvent & event )
{
    wxString s = cmd->GetValue();

    wxString a[] =
    {
        "info db", "info nbs", "info sys", "info id", "info fam",
        "info log connect", "info log critical", "info log conflict"
        , "ping"
    };

    const int SZ = sizeof(a) / sizeof(a[0]);

    wxString * b = std::find( a, a + SZ, s );

    if ( b == a + SZ ) b = a;
    else if ( b == a + SZ - 1 ) b = a;
    else ++b;

    cmd->SetValue(*b);
}

void DialogSendCmdEx::On_bLast( wxCommandEvent & event )
{
    string scmd = cmd->GetValue();

    if ( tDn->GetValue().empty() ) On_bRecpwd(event);

    if ( scmd.empty() ) goto last;
    {
        std::vector<string> v = gl::tokenise(scmd);
        if ( v.empty() ) goto last;
        if ( v[0] != "last" ) goto last;
    }

    cmd->SetValue( _("record ") + tUn->GetValue() + _(" -1 ") + tDn->GetValue() );
    return;

last:
    cmd->SetValue( _("last ") + tUn->GetValue() + _(" ") + tDn->GetValue() );
}

void DialogSendCmdEx::On_bData( wxCommandEvent & event )
{
    wxString sp = _(" ");
    if ( tDn->GetValue().empty() ) On_bRecpwd(event);
    cmd->SetValue( _("data ") + tUn->GetValue() + sp + tDn->GetValue() );
}

void DialogSendCmdEx::On_bRange( wxCommandEvent & event )
{
    if ( tDn->GetValue().empty() ) On_bRecpwd(event);
    cmd->SetValue( _("range ") + tUn->GetValue() + _(" 0 -1 ") + tDn->GetValue() );
}

void DialogSendCmdEx::On_bFile( wxCommandEvent & event )
{
    cmd->SetValue( _("file /") );
}

void DialogSendCmdEx::On_bHtml( wxCommandEvent & event )
{
    cmd->SetValue( _("html /") );
}

void DialogSendCmdEx::On_bJob( wxCommandEvent & event )
{
    cmd->SetValue( _("job 1000") );
}

void DialogSendCmdEx::On_bCon( wxCommandEvent & event )
{
    cmd->SetValue( _("connect 127.0.0.1:13131") );
}

void DialogSendCmdEx::On_bNote( wxCommandEvent & event )
{
    wxString sp = _(" ");
    if ( tDn->GetValue().empty() ) On_bRecpwd(event);
    wxString N = tN->GetValue();
    cmd->SetValue( _("note ") + tUn->GetValue() + sp + N + sp + tDn->GetValue() );
}


