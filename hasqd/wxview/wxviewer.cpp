// Hasq Technology Pty Ltd (C) 2013-2015


#include <sstream>
#include <fstream>
#include <string>
#include <time.h>
#include <algorithm>

#include "wx/wx.h"
#include "wx/sizer.h"
#include "wx/dcbuffer.h"
#include "wx/dir.h"

#include "gl_utils.h"
#include "gl_except.h"

#include "wxviewer.h"

const bool DBLBUFF = true;


BEGIN_EVENT_TABLE(MyFrame, wxFrame)
    EVT_MENU(ID_Quit,  MyFrame::OnQuit)
    EVT_MENU(ID_About, MyFrame::OnAbout)
    EVT_MENU(ID_Keyboard, MyFrame::OnKeyboard)
    EVT_MENU(ID_MenuCross, MyFrame::OnMenuCross)
    EVT_MENU(ID_Save, MyFrame::OnSave)
    EVT_MENU(ID_New, MyFrame::OnNew)
    EVT_MENU(ID_Open, MyFrame::OnOpen)
    EVT_MENU(ID_MenuAllConn, MyFrame::OnMenuAllConn)
    EVT_MENU(ID_MenuInterSel, MyFrame::OnMenuInterSel)
    EVT_MENU(ID_MenuToggle, MyFrame::OnMenuToggle)
    EVT_MENU(ID_MenuStart, MyFrame::OnMenuStart)
    EVT_MENU(ID_MenuShut, MyFrame::OnMenuShut)
    EVT_MENU(ID_MenuDbmak, MyFrame::OnMenuDbmak)
    EVT_MENU(ID_MenuDbdel, MyFrame::OnMenuDbdel)
    EVT_MENU(ID_MenuAnimate, MyFrame::OnMenuAnimate)
    EVT_MENU(ID_MenuStopAni, MyFrame::OnMenuStopAni)
    EVT_MENU(ID_MenuLastReply, MyFrame::OnMenuLastReply)
    EVT_MENU(ID_MenuForceAllReo, MyFrame::OnMenuForceAllReo)
END_EVENT_TABLE()

BEGIN_EVENT_TABLE(DrawPane, wxPanel)
    EVT_LEFT_DOWN(DrawPane::mouseDownL)
    EVT_KEY_DOWN(DrawPane::keyPressed)
    EVT_PAINT(DrawPane::paintEvent)
    EVT_SIZE(DrawPane::OnSize)
    EVT_CONTEXT_MENU(DrawPane::OnContextMenu)
    //EVT_RIGHT_DOWN(DrawPane::mouseDownR)

END_EVENT_TABLE()

BEGIN_EVENT_TABLE(DialogNewCan, wxDialog)
END_EVENT_TABLE()

BEGIN_EVENT_TABLE(DialogNewNode, wxDialog)
END_EVENT_TABLE()

BEGIN_EVENT_TABLE(DialogNewDb, wxDialog)
    EVT_CHECKBOX( IDD_NewDbChk, DialogNewDb::On_Chk )
END_EVENT_TABLE()

BEGIN_EVENT_TABLE(DialogShowText, wxDialog)
END_EVENT_TABLE()

BEGIN_EVENT_TABLE(DialogSendCmdEx, wxDialog)
    EVT_BUTTON( IDD_bZero, DialogSendCmdEx::On_bZero )
    EVT_BUTTON( IDD_bAdd, DialogSendCmdEx::On_bAdd )
    EVT_BUTTON( IDD_bLast, DialogSendCmdEx::On_bLast )
    EVT_BUTTON( IDD_bData, DialogSendCmdEx::On_bData )
    EVT_BUTTON( IDD_bRange, DialogSendCmdEx::On_bRange )
    EVT_BUTTON( IDD_bPing, DialogSendCmdEx::On_bPing )
    EVT_BUTTON( IDD_bInfo, DialogSendCmdEx::On_bInfo )
    EVT_BUTTON( IDD_bFile, DialogSendCmdEx::On_bFile )
    EVT_BUTTON( IDD_bHtml, DialogSendCmdEx::On_bHtml )
    EVT_BUTTON( IDD_bJob, DialogSendCmdEx::On_bJob )
    EVT_BUTTON( IDD_bCon, DialogSendCmdEx::On_bCon )
    EVT_BUTTON( IDD_bNote, DialogSendCmdEx::On_bNote )
    EVT_BUTTON( IDD_bRecord, DialogSendCmdEx::On_bRecord )
    EVT_BUTTON( IDD_bRecpwd, DialogSendCmdEx::On_bRecpwd )
END_EVENT_TABLE()

IMPLEMENT_APP(MyApp)


DrawPane * static_pane = 0;

bool MyApp::OnInit()
{
    wxBoxSizer * sizer = new wxBoxSizer(wxHORIZONTAL);
    mFrame = new MyFrame( wxT("Hasq Technology Publisher Viewer v0.1"), wxPoint(-1, -1), wxSize(800, 600));

    mPane = new DrawPane( (wxFrame *) mFrame );
    mFrame->setPane(mPane);

    mFrame->loadCanv();

    mPane->SetDoubleBuffered(DBLBUFF);

    sizer->Add(mPane, 1, wxEXPAND);

    mFrame->SetSizer(sizer);
    mFrame->SetAutoLayout(true);

    mFrame->Show(true);
    SetTopWindow(mFrame);

    mTimer = new RenderTimer(mPane);
    mTimer->start();

    return true;
}


MyFrame::MyFrame(const wxString & title, const wxPoint & pos, const wxSize & size)
    : wxFrame(NULL, -1, title, pos, size)
{
    wxMenu * menuFile = new wxMenu;

    menuFile->Append( ID_New, _("&New\tCtrl-N") );
    menuFile->Append( ID_Open, _("&Open\tCtrl-O") );
    menuFile->AppendSeparator();
    menuFile->Append( ID_Save, _("&Save\tCtrl-S") );
    menuFile->AppendSeparator();
    menuFile->Append( ID_Quit, _("E&xit\tCtrl-Q") );

    wxMenu * menuEdit = new wxMenu;
    menuEdit->Append( ID_MenuSelectAll,   _("Select &All\tCtrl-A") );
    menuEdit->Append( ID_MenuUnselectAll,   _("&Unselect all\tCtrl-U") );
    menuEdit->Append( ID_MenuToggle,   _("&Toggle selection\tT") );
    menuEdit->Enable(ID_MenuSelectAll, false);
    menuEdit->Enable(ID_MenuUnselectAll, false);

    wxMenu * menuCanv = new wxMenu;

    menuCanv->Append( ID_MenuAllConn,    _("&Refresh all connections\tR") );
    menuCanv->Append( ID_MenuInterSel, _("&Interconnect selected\tI") );
    menuCanv->Append( ID_MenuCross, _("&Cross interconnect all\tC") );

    menuCanv->AppendSeparator();

    menuCanv->Append( ID_MenuStart, _("&Start nodes everywhere\tS") );
    menuCanv->Append( ID_MenuShut, _("Shut&down all nodes\tD") );

    menuCanv->AppendSeparator();
    menuCanv->Append( ID_MenuDbmak, _("&Make databases ...\tM") );
    menuCanv->Append( ID_MenuDbdel, _("&Erase all databases\tE") );
    //menuCanv->Enable(ID_MenuDbmak, false);
    menuCanv->AppendSeparator();
    menuCanv->Append( ID_MenuAnimate, _("&Animate command ...\tA") );
    menuCanv->Append( ID_MenuStopAni, _("St&op animation") );

    menuCanv->AppendSeparator();
    menuCanv->Append( ID_MenuForceAllReo, _("&Force all reorganise\tF") );

    wxMenu * menuTools = new wxMenu;

    menuTools->Append( ID_MenuLastReply, _("See &last reply ...\tL") );

    wxMenu * menuHelp = new wxMenu;

    menuHelp->Append( ID_Keyboard, _("&Keyboard") );
    menuHelp->AppendSeparator();
    menuHelp->Append( ID_About, _("&About...") );

    wxMenuBar * menuBar = new wxMenuBar;
    menuBar->Append( menuFile, _("&File") );
    menuBar->Append( menuEdit, _("&Edit") );
    menuBar->Append( menuCanv, _("&Canvas") );
    menuBar->Append( menuTools, _("&Tools") );
    menuBar->Append( menuHelp, _("&Help") );

    SetMenuBar( menuBar );

    CreateStatusBar();
    SetStatusText( wxString("Try Help->Keyboard for keyboard commands", wxConvUTF8) );

    mFile = "current.htv";

}

bool MyFrame::Destroy()
{
    SetStatusText( towx("Closing pubs on destroy ...") );
    mPane->delCanv();
    SetStatusText( towx("Exiting ...") );
    return wxFrame::Destroy();
}

void MyFrame::OnQuit(wxCommandEvent & WXUNUSED(event))
{
    SetStatusText( towx("Closing pubs on quit ...") );
    mPane->delCanv();
    SetStatusText( towx("Exiting ...") );
    Close(true);
}

void MyFrame::OnAbout(wxCommandEvent & WXUNUSED(event))
{
    wxMessageBox( towx("Hasq Technology Publisher Viewer.\n"
                       "Copyright 2013-2015\n"
                       "http://hasq.org/"
                      ),
                  _("Hasq Technology Pty Ltd"),
                  wxOK | wxICON_INFORMATION, this );
}

void MyFrame::OnKeyboard(wxCommandEvent & WXUNUSED(event))
{
    wxMessageBox( towx("\n"
                       "Ctrl + Click - start node with default cmd\n"
                       "Alt + Click - shutdown node\n"
                       "r - refresh all connections\n"
                       "...\n"
                       ""),
                  _("keyboard commands"),
                  wxOK | wxICON_INFORMATION, this );
}


DrawPane::DrawPane(wxFrame * parent) :
    wxPanel(parent, wxID_ANY, wxDefaultPosition, wxDefaultSize, wxBORDER_NONE),
    mCanv(0),
    anim_xy(-1, -1)
{
    mFrame = parent;
    injection = "# list of any servant commands\n"
                "for i 0 10 tcp self { [ a _wrd * ] recpwd _wrd i rdn password }\n";
}


void DrawPane::paintEvent(wxPaintEvent & evt)
{
    wxPaintDC dc(this);
    render(dc);
}

void DrawPane::paintNow()
{
    wxClientDC dc(this);
    render(dc);
}

void DrawPane::OnSize(wxSizeEvent & e)
{
    Refresh();
}


void DrawPane::render(wxDC & dc)
{
    dc.Clear();

    int w = 0, h = 0;
    dc.GetSize(&w, &h);
    dc.SetBrush(*wxMEDIUM_GREY_BRUSH);
    dc.SetPen( wxPen( wxColor(25, 25, 25), 1 ) );
    dc.DrawRectangle( 0, 0, w, h );

    if ( !mCanv ) return;

    xpos = 0, ypos = 0;
    xsz = mCanv->size().x();
    ysz = mCanv->size().y();

    if ( w < 10 || h < 10 ) return;

    double xscale = xsz / w;
    double yscale = ysz / h;
    double scale = ( xscale > yscale ? xscale : yscale );
    scale /= 0.99;

    ysz /= scale;
    xsz /= scale;

    xpos = (w - xsz) / 2;
    ypos = (h - ysz) / 2;

    dc.SetBrush(*wxLIGHT_GREY_BRUSH);
    dc.SetPen( wxPen( wxColor(55, 55, 75), 1 ) );
    dc.DrawRectangle( xpos - 1, ypos - 1, xsz + 2, ysz + 2 );

    drawCanv(dc, xpos, ypos, xsz, ysz);
}



void DrawPane::processAnim()
{
    if ( !mCanv ) return;

    bool needrefreash = false;

    Canvas::ActivityMap stat = mCanv->stat();
    if ( !(mStat == stat) )
    {
        mStat = stat;
        mPubdata = mCanv->getPubdata();
        needrefreash = true;
    }


    // no activity check if we are in command animation
    if ( anim_xy.x() >= 0 )
    {
        while ( anim_xy.x() >= 0 && !mCanv->node(anim_xy) ) anim_next();
        if ( anim_xy.x() >= 0 )
        {

            try
            {
                string r = mCanv->send(anim_xy, anim_cmd);
                status("Sent to " + towx(anim_xy) + " : " + r);
            }
            catch (gl::ex e)
            {
                status("Error (" + towx(anim_xy) + ") " + e.str());
            }
            anim_next();
        }

    }

    if ( needrefreash ) Refresh();
}

void DrawPane::keyPressed(wxKeyEvent & event)
{
    if ( !mCanv ) return;

    std::ostringstream os;
    int code = event.GetKeyCode();
    os << code;
    std::string s = "Code: " + os.str();

    if ( WXK_SPACE == code ) ;
    else if ( WXK_RIGHT == code ) ;
    else if ( WXK_LEFT == code ) ;
    else if ( WXK_UP == code ) ;
    else if ( WXK_DOWN == code ) ;

    paintNow();
}

void DrawPane::delCanv()
{
    delete mCanv;
    mCanv = 0;
}

void DrawPane::loadCanv(std::istream & is)
{
    delCanv();
    mCanv = new Canvas(is);
}



RenderTimer::RenderTimer(DrawPane * pane) : wxTimer()
{
    RenderTimer::pane = pane;
}

void RenderTimer::Notify()
{
    static bool in = false;
    if ( in ) return;
    in = true;
    pane->processAnim();
    in = false;
}

void RenderTimer::start()
{
    wxTimer::Start(200);
}

void DrawPane::mouseDownL(wxMouseEvent & e)
{
    wxPoint p = e.GetPosition();
    wxPoint c = wxPoint(xpos, ypos);

    p -= c;

    XY s = mCanv->size();

    double cellszx = xsz / s.x();
    double cellszy = ysz / s.y();

    double i = p.x / cellszx;
    double j = p.y / cellszy;

    XY xy(static_cast<int>(i), static_cast<int>(j));

    if ( e.ControlDown() )
    {
        ctx_curpos = xy;
        startOne();
        return;
    }
    else if ( e.AltDown() )
    {
        ctx_curpos = xy;
        wxCommandEvent event;
        OnCtx_shut(event);
        return;
    }


    string msg1 = mCanv->select(xy);
    string msg2 = mCanv->db(xy).names();

    status(towx(msg1 + " Dbs:" + msg2));
    Refresh();
}


void MyFrame::OnMenuStart(wxCommandEvent & WXUNUSED(event))
{
    mPane->startInAll();
}

void MyFrame::OnMenuShut(wxCommandEvent & WXUNUSED(event))
{
    mPane->stopInAll();
}

void MyFrame::OnMenuCross(wxCommandEvent & WXUNUSED(event))
{
    mPane->crossAll();
}

void DrawPane::status(wxString s)
{
    mFrame->SetStatusText( s );
}

wxString towx(std::string s)
{
    wxString r(s.c_str(), wxConvUTF8);
    return r;
}

std::string wxto(wxString s)
{
    return (std::string)s.mb_str(wxConvUTF8);
}

wxString towx(int x)
{
    return towx(gl::tos(x));
}

std::string tos(int x)
{
    std::ostringstream os;
    os << x;
    return os.str();
}

int sto(std::string s)
{
    int x = -1;
    std::istringstream is(s);
    is >> x;
    return x;
}

int sto(wxString s)
{
    return sto( wxto(s) );
}

void DrawPane::statusSolution()
{
    wxString s1 = _("Found solution in ");
    wxString s2 = _(" steps (use f)");

    status( s1 + s2 );
}

void DrawPane::statusCurrent()
{
    status( _("DrawPane::statusCurrent") );
}

std::vector<std::string> getListOfFiles()
{
    std::vector<std::string> r;

    wxDir dir(wxGetCwd());

    if ( !dir.IsOpened() )
        return r;

    wxString filename;

    bool cont = dir.GetFirst(&filename);
    while ( cont )
    {
        std::string s = wxto(filename);
        int sz = s.size();
        if ( sz > 5 && s.substr(sz - 5) == ".maze" )
            r.push_back(s);

        cont = dir.GetNext(&filename);
    }

    std::sort(r.begin(), r.end());

    return r;
}

void MyFrame::loadCanv(const std::string & s)
{
    std::ifstream in(s.c_str());
    if ( !in)
    {
        SetStatusText( towx("Failed to open [" + s + "]") );
        return;
    }
    mPane->loadCanv(in);

    SetStatusText( towx("Loaded " + s) );
}

void MyFrame::loadCanv()
{
    try { loadCanv(mFile); }
    catch (...) {}
}


void MyFrame::OnOpen(wxCommandEvent & WXUNUSED(event))
{
    if (0)
    {
        wxFileDialog dia(this);

        if ( dia.ShowModal() != wxID_OK ) return;

        wxArrayString files;
        dia.GetFilenames(files);

        if ( files.size() < 1 ) return;

        mFile = files[0];
    }
    else
    {
        mFile = wxLoadFileSelector("Canvas", ".htv");
        if ( mFile.empty() ) return;
    }

    loadCanv(mFile);
    Refresh();
}

void MyFrame::OnSave(wxCommandEvent & WXUNUSED(event))
{
    if ( !mPane->getCanv() ) return;

    if ( mFile.empty() )
    {
        mFile = wxSaveFileSelector("Canvas", ".htv");
    }

    std::ofstream of(mFile.c_str());
    mPane->getCanv()->save(of);
}


void MyFrame::OnMenuAllConn(wxCommandEvent & WXUNUSED(event))
{
    int n = mPane->refreshAllConn();
    SetStatusText( _("Connections: ") + towx(n) );
}

void MyFrame::OnMenuInterSel(wxCommandEvent & WXUNUSED(event))
{
    SetStatusText( _("Interconnecting selected ...") );
    mPane->interconnectSelected();
    SetStatusText( _("Interconnecting selected: done") );
}

void MyFrame::OnMenuToggle(wxCommandEvent & WXUNUSED(event))
{
    mPane->toggleSelected();
}

void MyFrame::OnMenuDbmak(wxCommandEvent & WXUNUSED(event))
{
    mPane->dbmak();
}

void MyFrame::OnMenuDbdel(wxCommandEvent & WXUNUSED(event))
{
    mPane->dbdel();
}

void MyFrame::OnMenuStopAni(wxCommandEvent & WXUNUSED(event))
{
    mPane->OnMenuStopAni();
}

void MyFrame::OnMenuForceAllReo(wxCommandEvent & WXUNUSED(event))
{
    mPane->OnMenuForceAllReo();
}

void MyFrame::OnMenuAnimate(wxCommandEvent & WXUNUSED(event))
{
    try
    {
        mPane->OnMenuAnimate();
    }
    catch (gl::ex e)
    {
        err(e);
        return;
    }
    catch (...)
    {
        err(gl::ex("Unknown error"));
        return;
    }
}

void DrawPane::OnMenuAnimate()
{
    DialogSendCmdEx dia ( mCanv, XY(-1, -1), mFrame, -1, _("Send command to all"),
                          wxDefaultPosition, wxSize(600, 460) );

    dia.cmd->SetValue( towx("ping") );

    if ( dia.ShowModal() != wxID_OK ) return;

    string cmd = dia.cmd->GetValue();
    anim_start(cmd);
}

void DrawPane::OnMenuStopAni()
{
    anim_xy = XY(-1, -1);
}

void DrawPane::OnMenuForceAllReo()
{
    mCanv->forceAllReo();
}

void MyFrame::OnNew(wxCommandEvent & WXUNUSED(event))
{
    DialogNewCan dia ( this, -1, _("New canvas"),
                       wxDefaultPosition, wxSize(230, 220) );

    dia.mX->SetValue( towx(8) );
    dia.mY->SetValue( towx(6) );

    if ( dia.ShowModal() != wxID_OK ) return;

    int sizex = sto( dia.mX->GetValue() );
    if ( sizex < 1 || sizex > 10000 ) sizex = 1;
    int sizey = sto( dia.mY->GetValue() );
    if ( sizey < 1 || sizey > 10000 ) sizey = 1;

    mFile = "";

    try
    {
        mPane->newCanv(dia.mBase->GetValue().c_str(), sizex, sizey);
    }
    catch (gl::ex e)
    {
        err(e);
        return;
    }
}

void DrawPane::newCanv(const string & base, int x, int y)
{
    Canvas * c = new Canvas(base, XY(x, y)); // this may throw

    // now it is safe to swap the canvas
    delCanv();
    mCanv = c;
    Refresh();
}

DialogNewCan::DialogNewCan ( wxWindow * parent, wxWindowID id, const wxString & title,
                             const wxPoint & position, const wxSize & size, long style )
    : wxDialog( parent, id, title, position, size, style)
{

    SetSize(size);
    wxPoint p;

    int NL = 10;

    p.x = NL; p.y = 20;

    new wxStaticText( this, -1, _("Base"), p );
    p.x += 30;
    mBase = new wxTextCtrl ( this, -1, towx(""), p, wxSize(80, -1) );

    p.x = NL; p.y += 40;

    new wxStaticText( this, -1, _("Size"), p );
    p.x += 30;
    mX = new wxTextCtrl ( this, -1, towx("3"), p, wxSize(40, -1) );
    p.x += 45;
    new wxStaticText( this, -1, _("X"), p );
    p.x += 15;
    mY = new wxTextCtrl ( this, -1, towx("3"), p, wxSize(40, -1) );

    p.y = size.GetHeight() - 60;
    p.x = size.GetWidth() - 100;
    wxButton * b = new wxButton( this, wxID_OK, _("OK"), p, wxDefaultSize );
    p.x -= 100;
    wxButton * c = new wxButton( this, wxID_CANCEL, _("Cancel"), p, wxDefaultSize );
}

void DrawPane::mouseDownR(wxMouseEvent & e)
{
    status( _("DrawPane::mouseDownR") );
}

void DrawPane::OnContextMenu( wxContextMenuEvent & event )
{
    wxPoint p = event.GetPosition();
    wxPoint w = GetScreenPosition();
    wxPoint c = wxPoint(xpos, ypos);

    p -= w;
    p -= c;

    XY s = mCanv->size();

    double cellszx = xsz / s.x();
    double cellszy = ysz / s.y();

    double i = p.x / cellszx;
    double j = p.y / cellszy;

    XY xy(static_cast<int>(i), static_cast<int>(j));

    wxMenu * menu = createContextMenu(xy);
    wxPoint mp = event.GetPosition();
    mp = ScreenToClient( mp );
    PopupMenu( menu, mp );
    deleteContextMenu(menu);
}

wxString towx(wxPoint p)
{
    return towx(p.x) + _(":") + towx(p.y);
}

wxString towx(XY a)
{
    return towx(a.x()) + _(":") + towx(a.y());
}

void err(gl::ex e)
{
    wxMessageBox( towx("Error: " + e.str()), _("ERROR"), wxOK | wxICON_INFORMATION, NULL );
}

void MyFrame::OnMenuLastReply(wxCommandEvent & WXUNUSED(event))
{
    DialogShowText dia ( mPane->last_ctx_pos(), this, -1, _("Last reply"),
                         wxDefaultPosition, wxSize(550, 550) );

    dia.text->SetValue( towx(mPane->last_reply) );

    if ( dia.ShowModal() != wxID_OK ) return;
}

