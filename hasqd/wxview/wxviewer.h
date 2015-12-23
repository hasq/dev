// Hasq Technology Pty Ltd (C) 2013-2015

#include <sstream>
#include <fstream>
#include <string>

#include "wx/wx.h"
#include "wx/sizer.h"

#include "canvas.h"

class DrawPane;

class MyFrame: public wxFrame
{
        DrawPane * mPane;
        std::string mFile;
        os::net::NetInitialiser netinit;

    public:

        MyFrame(const wxString & title, const wxPoint & pos, const wxSize & size);
        void setPane(DrawPane * p) { mPane = p; }

        bool Destroy();

        void OnQuit(wxCommandEvent & event);
        void OnAbout(wxCommandEvent & event);
        void OnKeyboard(wxCommandEvent & event);
        void OnSave(wxCommandEvent & event);
        void OnNew(wxCommandEvent & event);
        void OnOpen(wxCommandEvent & event);
        void OnMenuAllConn(wxCommandEvent & event);
        void OnMenuInterSel(wxCommandEvent & event);
        void OnMenuToggle(wxCommandEvent & event);
        void OnMenuCross(wxCommandEvent & event);
        void OnMenuStart(wxCommandEvent & event);
        void OnMenuShut(wxCommandEvent & event);
        void OnMenuDbmak(wxCommandEvent & event);
        void OnMenuDbdel(wxCommandEvent & event);
        void OnMenuAnimate(wxCommandEvent & event);
        void OnMenuStopAni(wxCommandEvent & event);
        void OnMenuLastReply(wxCommandEvent & event);
        void OnMenuForceAllReo(wxCommandEvent & event);

        void loadCanv(const std::string & file);
        void loadCanv();
        void saveCanv();

        DECLARE_EVENT_TABLE()
};

extern DrawPane * static_pane;
class DrawPane : public wxPanel
{
        Canvas * mCanv;
        wxFrame * mFrame;

        Canvas::ActivityMap mStat;
        Canvas::PubdataMap mPubdata;

        double xpos, ypos;
        double xsz, ysz;

        XY ctx_curpos;
        string cmd;

        // animation section
        XY anim_xy;
        string anim_cmd;
        void anim_next();
        void anim_start(string s) { anim_cmd = s; anim_xy = XY(0, 0); }

        string injection;

    public:
        string last_reply;
        XY last_ctx_pos() const { return ctx_curpos; }

    private:

        wxMenu * createContextMenu(XY xy);
        void deleteContextMenu(wxMenu *);

    public:
        DrawPane(wxFrame * parent);
        void delCanv();
        void loadCanv(std::istream & is);
        void newCanv(const string & base, int x, int y);
        int refreshAllConn();
        void interconnectSelected();
        void toggleSelected();
        void crossAll();
        void startInAll();
        void startOne();
        void stopInAll();
        void dbmak();
        void dbdel();

        static void static_status(string s) { static_pane->status(s); }
        void status(wxString s);
        void statusSolution();
        void statusCurrent();
        void paintEvent(wxPaintEvent & evt);
        void paintNow();

        void render(wxDC & dc);
        void drawCanv(wxDC & dc, double xpos, double ypos, double w, double h);
        Canvas * getCanv() const { return mCanv; }

        void mouseDownL(wxMouseEvent & event);

        void keyPressed(wxKeyEvent & event);
        void processAnim();

        void OnSize(wxSizeEvent & e);

        void mouseDownR(wxMouseEvent & event);
        void OnContextMenu( wxContextMenuEvent & event );
        void OnContextItem( wxCommandEvent & event );

        void OnCtx_new( wxCommandEvent & event );
        void OnCtx_shut( wxCommandEvent & event );
        void OnCtx_dbmak( wxCommandEvent & event );
        void OnCtx_dbrem( wxCommandEvent & event );
        void OnCtx_send( wxCommandEvent & event );
        void OnCtx_conn( wxCommandEvent & event );
        void OnCtx_mkcon( wxCommandEvent & event );
        void OnCtx_cross( wxCommandEvent & event );
        void OnCtx_inject( wxCommandEvent & event );
        void OnCtx_reo( wxCommandEvent & event );

        void OnMenuAnimate();
        void OnMenuStopAni();
        void OnMenuForceAllReo();

        DECLARE_EVENT_TABLE()
};

class RenderTimer : public wxTimer
{
        DrawPane * pane;
    public:
        RenderTimer(DrawPane * pane);
        void Notify();
        void start();
};


class MyApp: public wxApp
{
        virtual bool OnInit();

        MyFrame * mFrame;
        DrawPane * mPane;
        RenderTimer * mTimer;
};


class DialogNewCan: public wxDialog
{
    public:

        DialogNewCan ( wxWindow * parent, wxWindowID id, const wxString & title,
                       const wxPoint & pos = wxDefaultPosition,
                       const wxSize & size = wxDefaultSize,
                       long style = wxDEFAULT_DIALOG_STYLE );

        wxTextCtrl * mX , * mY, * mBase;

    private:

        DECLARE_EVENT_TABLE()
};

class DialogNewNode: public wxDialog
{
    public:

        DialogNewNode ( XY cp, const string & cmdH, wxWindow * parent, wxWindowID id, const wxString & title,
                        const wxPoint & pos = wxDefaultPosition,
                        const wxSize & size = wxDefaultSize,
                        long style = wxDEFAULT_DIALOG_STYLE );

        wxTextCtrl * cmd;

        DECLARE_EVENT_TABLE()
};

class DialogNewDb: public wxDialog
{
    public:

        DialogNewDb ( XY cp, wxWindow * parent, wxWindowID id, const wxString & title,
                      const wxPoint & pos = wxDefaultPosition,
                      const wxSize & size = wxDefaultSize,
                      long style = wxDEFAULT_DIALOG_STYLE );

        wxTextCtrl * uN;
        wxTextCtrl * sN;
        wxTextCtrl * fN;
        wxTextCtrl * nG;
        wxTextCtrl * mag;
        wxTextCtrl * sz;
        wxTextCtrl * th;

        wxCheckBox * chk;
        void On_Chk( wxCommandEvent & event );

        DECLARE_EVENT_TABLE()
};


class DialogShowText: public wxDialog
{
    public:

        DialogShowText ( XY cp, wxWindow * parent, wxWindowID id, const wxString & title,
                         const wxPoint & pos = wxDefaultPosition,
                         const wxSize & size = wxDefaultSize,
                         long style = wxDEFAULT_DIALOG_STYLE );

        wxTextCtrl * text;

        DECLARE_EVENT_TABLE()
};

class DialogSendCmdEx: public wxDialog
{
        Canvas * mCanv;
        XY ctx_curpos;

    public:

        DialogSendCmdEx (  Canvas * canv, XY cp, wxWindow * parent, wxWindowID id, const wxString & title,
                           const wxPoint & pos = wxDefaultPosition,
                           const wxSize & size = wxDefaultSize,
                           long style = wxDEFAULT_DIALOG_STYLE );

        wxTextCtrl * cmd;

        wxButton * bZero, *bAdd, *bLast, *bData, *bRange, *bPing, *bInfo, *bFile
        , *bHtml, *bJob, *bCon, *bNote, *bRecord, *bRecpwd;

        wxTextCtrl * tUn, *tSign, *tRecord, *tN, *tDn, *tK, *tG, *tO, *tT, *tD
        , *tRdn, *tPwd;

        void On_bZero_or_bAdd( wxCommandEvent & event, string cmd );
        void On_bZero( wxCommandEvent & event );
        void On_bAdd( wxCommandEvent & event );
        void On_bLast( wxCommandEvent & event );
        void On_bData( wxCommandEvent & event );
        void On_bRange( wxCommandEvent & event );
        void On_bPing( wxCommandEvent & event );
        void On_bInfo( wxCommandEvent & event );
        void On_bFile( wxCommandEvent & event );
        void On_bHtml( wxCommandEvent & event );
        void On_bJob( wxCommandEvent & event );
        void On_bCon( wxCommandEvent & event );
        void On_bNote( wxCommandEvent & event );
        void On_bRecord( wxCommandEvent & event );
        void On_bRecpwd( wxCommandEvent & event );

        DECLARE_EVENT_TABLE()
};

enum
{
    ID_About,
    ID_Keyboard,
    ID_MenuAllConn,
    ID_MenuInterSel,
    ID_MenuToggle,
    ID_MenuCross,
    ID_MenuStart,
    ID_Save,
    ID_New,
    ID_Open,
    ID_MenuShut,
    ID_MenuDbmak,
    ID_MenuDbdel,
    ID_MenuAnimate
    , ID_MenuStopAni
    , ID_MenuLastReply
    , ID_MenuSelectAll
    , ID_MenuUnselectAll
    , ID_MenuForceAllReo

    , IDC_New
    , IDC_Shut
    , IDC_Send
    , IDC_DbMak
    , IDC_DbRem
    , IDC_Conn
    , IDC_Mkcon
    , IDC_Cross
    , IDC_Inject
    , IDC_Reo

    , IDD_bZero, IDD_bAdd, IDD_bLast, IDD_bData
    , IDD_bRange, IDD_bPing, IDD_bInfo, IDD_bFile
    , IDD_bHtml, IDD_bJob, IDD_bCon, IDD_bNote
    , IDD_bRecord, IDD_bRecpwd

    , IDD_NewDbChk

    , ID_Quit = wxID_EXIT
};

wxString towx(XY x);
wxString towx(wxPoint x);
wxString towx(int x);
wxString towx(std::string s);
std::string wxto(wxString s);
void err(gl::ex e);

