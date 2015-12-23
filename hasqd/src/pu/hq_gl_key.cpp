// Hasq Technology Pty Ltd (C) 2013-2015

#include <iostream>

#include "gl_err.h"
#include "gl_defs.h"

#include "ma_skc.h"
#include "ma_utils.h"

#include "os_sysinfo.h"
#include "sg_mutex.h"
#include "sg_cout.h"

#include "hq_svttask.h"
#include "hq_globalspace.h"

KeyArea::KeyArea(const std::vector<string> & ini_skc_keys, const string & skcseed):
    access2keyArea(1)
{
    string seed = skcseed;
    if ( skcseed.empty() )
    {
        std::ostringstream os;
        os << os::Timer(0).get();
        seed = os.str();
    }

    ivec = ma::skc::hashHex(seed);

    if ( skcseed.empty() )
    {
        if (0)
            ivec = ma::skc::hashHex(os::random8());
        else
        {
            std::ostringstream os;
            os << os::Timer(0).get();
            ivec = ma::skc::hashHex(os.str());
        }
    }

    skcKeys = ini_skc_keys;

    if ( skcseed.empty() )
    {
        std::ostringstream os;
        os << os::Timer(0).get();
        seed = os.str();
    }

    salt = ma::skc::hashHex(ivec + seed);

    //pubKey.init("11235831459437...",20);
}

std::vector<string> KeyArea::showSkcKeys(bool randomise)
{
    std::vector<string> r;
    {
        sgl::Mutex mutex_ka(access2keyArea);
        r = skcKeys;
    }

    for ( size_t i = 0; i < r.size(); i++ )
    {
        string sec;

        if ( randomise )
            sec = newIvec().substr(0, SkcOutputSecLevel);

        r[i] = ma::skc::hashHex( r[i] + sec );
    }

    return r;
}

void KeyArea::digest(string & s)
{
    s = ma::skc::hashHex(s);
}

void KeyArea::addSkcKey(const string & k)
{
    sgl::Mutex mutex_ka(access2keyArea);
    skcKeys.push_back(k);
}

void KeyArea::popSkcKey()
{
    sgl::Mutex mutex_ka(access2keyArea);

    if ( skcKeys.empty() )
        return;

    skcKeys.erase( skcKeys.begin() );
}

string KeyArea::skcenc(const string & msg, bool b64, bool hex)
{
    std::vector<string> r;
    string iv, sa;
    {
        sgl::Mutex mutex_ka(access2keyArea);
        r = skcKeys;
        iv = newIvec();
        sa = newSalt();
    }

    if ( r.empty() )
        return msg;

    string c = ma::skc::enc(r[0], msg, sa, iv);

    if ( b64 )
        c = ma::b64enc(c);
    else if ( hex )
        c = ma::toHex(c);

    return c;
}

string KeyArea::skcdec(const string & msg, bool b64, bool hex)
{
    std::vector<string> r;
    {
        sgl::Mutex mutex_ka(access2keyArea);
        r = skcKeys;
    }

    if ( r.empty() )
        return "";

    string c = msg;

    if ( b64 )
        c = ma::b64dec(c);
    else if ( hex )
        c = ma::toBin(c);

    for ( size_t i = 0; i < r.size(); i++ )
    {
        string x = ma::skc::dec(r[i], c);

        if ( !x.empty() )
            return x;
    }

    return "";
}
