// Hasq Technology Pty Ltd (C) 2013-2015

function widHelpTab()
{
    var r = '';

    r += '<table width="70%"">@n';
    r += '<tr>@n';
    r += '<td width="100%">@n';

    r += '<div id="main_help_accordion">@n';

    r += '<H3>Server tab</H3>@n';
    r += '<div>@n';
    r += '<table>@n';
    r += '<tr>@n';
    r += '<td>@n';
    INCLUDEFILE
    txt/hq_help_server_tab.htm
    r += '</tr>@n';
    r += '</table>@n';
    r += '</div>@n';

    r += '<H3>Database tab</H3>@n';
    r += '<div>@n';
    r += '<table>@n';
    r += '<tr>@n';
    r += '<td>@n';
    INCLUDEFILE
    txt/hq_help_database_tab.htm
    r += '</tr>@n';
    r += '</table>@n';
    r += '</div>@n';

    r += '<H3>Records tab</H3>@n';
    r += '<div>@n';
    r += '<table>@n';
    r += '<tr>@n';
    r += '<td>@n';
    INCLUDEFILE
    txt/hq_help_records_tab.htm
    r += '</tr>@n';
    r += '</table>@n';
    r += '</div>@n';

    r += '<H3>Hash calc tab</H3>@n';
    r += '<div>@n';
    r += '<table>@n';
    r += '<tr>@n';
    r += '<td>@n';
    INCLUDEFILE
    txt/hq_help_hash_calc_tab.htm
    r += '</tr>@n';
    r += '</table>@n';
    r += '</div>@n';

    r += '<H3>Command tab</H3>@n';
    r += '<div>@n';
    r += '<table>@n';
    r += '<tr>@n';
    r += '<td>@n';
    INCLUDEFILE
    txt/hq_help_command_tab.htm
    r += '</tr>@n';
    r += '</table>@n';
    r += '</div>@n';

    r += '<H3>Tokens tab</H3>@n';
    r += '<div>@n';
    r += '<table>@n';
    r += '<tr>@n';
    r += '<td>@n';
    INCLUDEFILE
    txt/hq_help_tokens_tab.htm
    r += '</tr>@n';
    r += '</table>@n';
    r += '<div id="tokens_tab_help_accordion">@n';

    r += '<H2>Create tab</H2>@n';
    r += '<div>@n';
    r += '<table>@n';
    r += '<tr>@n';
    r += '<td>@n';
    INCLUDEFILE
    txt/hq_help_tokens_create_tab.htm
    r += '</tr>@n';
    r += '</table>@n';
    r += '</div>@n';

    r += '<H2>Verify tab</H2>@n';
    r += '<div>@n';
    r += '<table>@n';
    r += '<tr>@n';
    r += '<td>@n';
    INCLUDEFILE
    txt/hq_help_tokens_verify_tab.htm
    r += '</tr>@n';
    r += '</table>@n';
    r += '</div>@n';

    r += '<H2>Data tab</H2>@n';
    r += '<div>@n';
    r += '<table>@n';
    r += '<tr>@n';
    r += '<td>@n';
    INCLUDEFILE
    txt/hq_help_tokens_data_tab.htm
    r += '</tr>@n';
    r += '</table>@n';
    r += '</div>@n';

    r += '<H2>Send tab</H2>@n';
    r += '<div>@n';
    r += '<table>@n';
    r += '<tr>@n';
    r += '<td>@n';
    INCLUDEFILE
    txt/hq_help_tokens_send_tab.htm
    r += '</tr>@n';
    r += '</table>@n';
    r += '</div>@n';

    r += '<H2>Receive tab</H2>@n';
    r += '<div>@n';
    r += '<table>@n';
    r += '<tr>@n';
    r += '<td>@n';
    INCLUDEFILE
    txt/hq_help_tokens_receive_tab.htm
    r += '</tr>@n';
    r += '</table>@n';
    r += '</div>@n';

    r += '</div>@n';
    r += '</div>@n';

    r += '</div>@n';

    r += '</tr>@n';
    r += '</table>@n';

    return r;
}
