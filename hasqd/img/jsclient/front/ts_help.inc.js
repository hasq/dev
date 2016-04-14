// Hasq Technology Pty Ltd (C) 2013-2016

function gHelp(x)
{
    var o =
    {
///        span_password_pic: 'FIXME (ts_message.js)<br\>span_password_pic',
///        span_token_pic: 'FIXME (ts_message.js)<br\>span_token_pic',
///        span_info: p_,
///        token_name: 'FIXME (ts_message.js)<br\>token_name',
///        token_hash: 'FIXME (ts_message.js)<br\>token_hash',
        master_key: 'FIXME (ts_message.js)<br\>master_key',
        welcome_to_tokenswap: 'FIXME (ts_message.js)<br\>welcome_to_tokenswap',
        token_data: 'FIXME (ts_message.js)<br\>token_data',
        create_new_token: 'FIXME (ts_message.js)<br\>create_new_token',
        show_keys: 'FIXME (ts_message.js)<br\>show_keys',
        paste_keys: 'FIXME (ts_message.js)<br\>paste_keys',
        search_for_tokens: 'FIXME (ts_message.js)<br\>search_for_tokens'
    };

    if (o[x]) return o[x];

    var r = "";

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
    else if (x == 'span_token_pic')
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

    return r;
}
