// Hasq Technology Pty Ltd (C) 2013-2016

function gHelp(x)
{
    var r = '';

    if ( x == 'span_password_pic' )
    {
        INCLUDEFILE
     txt/ts_tok_state.htm
    }
    else if (x == 'span_info')
    {
        INCLUDEFILE
        txt/ts_info.htm
    }
    else if (x == 'span_shield')
    {
        INCLUDEFILE
        txt/ts_shield.htm
    }
    else if (x == 'span_token_lock')
    {
        INCLUDEFILE
        txt/ts_yellow_lock.htm
    }
    else if (x == 'token_hash')
    {
        INCLUDEFILE
        txt/ts_token_hash.htm
    }
    else if (x == 'token_name')
    {
        INCLUDEFILE
        txt/ts_token_name.htm
    }
    else if (x == 'master_key')
    {
        INCLUDEFILE
        txt/ts_master_key.htm
    }
    else if (x == 'token_data')
    {
        INCLUDEFILE
        txt/ts_token_data.htm
    }
    else if (x == 'create_new_token')
    {
        INCLUDEFILE
        txt/ts_create_new_token.htm
    }
    else if (x == 'show_keys')
    {
        INCLUDEFILE
        txt/ts_show_keys.htm
    }
    else if (x == 'paste_keys')
    {
        INCLUDEFILE
        txt/ts_paste_keys.htm
    }
    else if (x == 'search_for_tokens')
    {
        INCLUDEFILE
        txt/ts_search_for_tokens.htm
    }
    else if (x == 'span_password_zxcvbn')
    {
        INCLUDEFILE
        txt/ts_zxcvbn.htm
    }
    else if (x == 'span_data_length')
    {
        INCLUDEFILE
        txt/ts_data_length.htm
    }
    else if (x == 'span_reload')
    {
        INCLUDEFILE
        txt/ts_span_reload.htm
    }
    return r;
}
