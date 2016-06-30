// Hasq Technology Pty Ltd (C) 2013-2016

#include <cstring>

#include "gl_err.h"
#include "gl_except.h"

#include "os_thread.h"

#include "hq_dbindex.h"

os::Path db::findDnFile(const string & dnstr, int level, const string & index_dir)
{
    os::Path idxdir(index_dir);

    if ( gl::st2i(dnstr.length()) >= level * 2 )
    {
        for ( int i = 0; i < level; i++ )
            idxdir += dnstr.substr(i * 2, 2);

        os::Dir dir = os::FileSys::readDir(idxdir);

        if ( !dir.dirs.empty() )
            return db::findDnFile(dnstr, level + 1, index_dir);

        for (size_t i = 0; i < dir.files.size(); i++ )
            if ( dir.files[i].first == dnstr )
                return idxdir + dnstr;
    }
    return os::Path();
}

os::Path db::makeDnFile(const string & dnstr, int level, const string & index_dir)
{
    os::Path idxdir(index_dir);

    if ( !idxdir.isdir() )
        os::FileSys::trymkdir(idxdir);

    for ( int i = 0; i < level; i++ )
        idxdir += dnstr.substr(i * 2, 2);

    os::Dir dir = os::FileSys::readDir(idxdir);

    if ( !dir.dirs.empty() )
        return db::makeDnFile(dnstr, level + 1, index_dir);

    if ( dir.files.size() < MAX_NFILES_INDIR )
        return idxdir + dnstr;

    for ( int i = 0; i < 256; i++ )
        os::FileSys::mkdir(idxdir + gl::tosHex(i, 2));

    for (size_t i = 0; i < dir.files.size(); i++ )
    {
        const string & name = dir.files[i].first;
        string sign = name.substr(level * 2, 2);
        os::FileSys::move(idxdir + name, idxdir + sign + name);
    }

    string sign = dnstr.substr(level * 2, 2);
    return idxdir + sign + dnstr;
}

template <class H>
os::Path db::Index<H>::findFile(const H & dn) const
{
    return db::findDnFile(dn.str(), 0, traits->getIndexPath().str());
}

template <class H>
os::Path db::Index<H>::findFile(const string & dnstr) const
{
    return db::findDnFile(dnstr, 0, traits->getIndexPath().str());
}


template <class H>
os::Path db::Index<H>::makeFilePath(const H & dn)
{
    return db::makeDnFile(dn.str(), 0, traits->getIndexPath().str());
}

template <class H>
er::Code db::Index<H>::getLast(const H & dn, RecordT<H> & rec) const
{
    os::Path dnfile = findFile(dn);

    if ( dnfile.empty() )
        return er::IDX_NODN;

    IndexReader  ir(dnfile);
    const char * data;
    er::CodeType code = ir.accessLast(data);

    if ( code != er::OK )
        return code;

    return rec.init(data, traits->nG());
}

template <class H>
er::Code db::Index<H>::getFirst(const H & dn, RecordT<H> & rec) const
{
    os::Path dnfile = findFile(dn);

    if ( dnfile.empty() )
        return er::IDX_NODN;

    IndexReader  ir(dnfile);
    const char * data;
    er::CodeType code = ir.accessFirst(data);

    if ( code != er::OK )
        return code;

    return rec.init(data, traits->nG());
}

template <class H>
er::Code db::Index<H>::getRecord(const H & dn, gl::intint N, RecordT<H> & rec) const
{
    os::Path dnfile = findFile(dn);

    if ( dnfile.empty() )
        return er::IDX_NODN;

    IndexReader  ir(dnfile);
    const char * data;
    er::CodeType code = ir.accessRecord(N, data);

    if ( code != er::OK )
        return code;

    std::string lrec(data);

    lrec.erase(lrec.length() - 1, 1);

    return rec.init(lrec, traits->nG());
}

template <class H>
er::Code db::Index<H>::getRange(const H & dn, gl::intint b, gl::intint e, gl::intint max,
                                gl::intint & would_be_count, std::vector< Record *> & vr) const
{
    os::Path dnfile = findFile(dn);

    if ( dnfile.empty() )
        return er::IDX_NODN;

    IndexReader  ir(dnfile);
    const char * data;
    gl::intint   count;
    er::CodeType code = ir.accessRange(b, e, max, would_be_count, data, count);

    if ( code != er::OK )
        return code;

    gl::intint   n1, n2;
    std::string  lrec;
    Record   *   rec;

    vr.reserve(gl::ii2st(count));
    n1 = n2 = 0;
    while ( data[n2] != 0 )
    {
        if ( data[n2] == '\n' )
        {
            lrec.assign(&data[n1], gl::ii2st(n2 - n1));
            rec = new RecordT<H>;
            REPORT(rec);

            er::Code ret = rec->init(lrec, traits->nG());

            if ( ret != er::OK )
            {
                for ( unsigned int i = 0; i < vr.size(); i++ )
                    delete vr[i];
                return ret;
            }
            vr.push_back(rec);

            n1 = n2 + 1;
        }
        n2++;
    }

    return er::OK;
}

template <class H>
er::Code db::Index<H>::getLastData(const H & dn, gl::intint from, int max, string & data) const
{
    os::Path dnfile = findFile(dn);

    if ( dnfile.empty() )
        return er::IDX_NODN;

    IndexReader ir(dnfile);
    gl::intint  nF = ir.getFirstN();
    gl::intint  nL = ir.getLastN();
    RecordT<H>  rec;
    er::Code    ret(er::OK);

    if ( nF == -1 || nL == -1 )
        return er::IR_NOT_INITED;

    ir.release();

    if ( from < 0 )
        from = nL + from + 1;

    if ( from < nF )
        return er::REQ_N_BAD;

    gl::intint to;

    if ( max < 0 )
        max = 0;
    if ( max == 0 )
        to = nF;
    else
    {
        to = from - max + 1;
        if ( to > nL )
            return er::REQ_N_BAD;
        if ( to < nF )
            to = nF;
    }
    if ( from > nL )
        from = nL;

    data = "";
    for ( gl::intint i = from; i >= to; i-- )
    {
        ret = getRecord(dn, i, rec);
        if ( ret != er::OK )
            return ret;

        if ( !rec.data().empty() )
        {
            data = gl::tos(i) + " " + rec.data();
            return er::OK;
        }
    }

    data = gl::tos(to);
    return er::OK;
}

template <class H>
er::Code db::Index<H>::addRecord(const RecordT<H> & rec)
{
    os::Path dnfile = findFile(rec.dn());

    if ( dnfile.empty() )
        dnfile = makeFilePath(rec.dn());

    {
        std::ofstream of(dnfile.str().c_str(), std::ios::app | std::ios::binary);

        of << rec.str() << '\n';
        if ( !of )
            throw gl::Never("db::Index<H>::addRecord: "
                            "Failed to write to file [$1]", dnfile.str());

        if ( !traits->thinness() )
            return er::OK;
    }

    const gl::intint lastN = rec.n();
    gl::intint thinness = traits->thinness();
    gl::intint firstN, bpos;

    {
        // Find N first of the first rec in the file
        IndexReader ir(dnfile);
        firstN = ir.getFirstN();

        if ( firstN + thinness * 2 > lastN ) // within limits
            return er::OK;

        firstN = lastN - thinness;

        // shrink file
        RangePos info;
        er::Code k = ir.getRangePos(firstN, firstN, info);
        if ( k ) return k;
        bpos = info.bpos;
    }

    // rename file to tmp
    os::Path tmp = dnfile; tmp.glue(".tmp");
    for ( int i = 0; i < 1000; i++ )
    {
        if ( os::rename(dnfile.str(), tmp.str()) ) break;
        os::Thread::sleep(1);
    }

    // read and write to original starting from N
    {
        std::ifstream in(tmp.str().c_str(), std::ios::binary);
        std::ofstream of(dnfile.str().c_str(), std::ios::binary);
        in.seekg(bpos);
        of << in.rdbuf();
    }

    // remove tmp
    tmp.erase();

    // validate
    {
        RangePos info;
        IndexReader ir(dnfile);
        er::Code k = ir.getRangePos(firstN, lastN, info);
        if ( k || info.b != firstN || info.e != lastN )
            throw gl::Never("DbIndex::AddRecord: file manipulation error "
                            + k.str() + gl::tos(info.b) + gl::tos(firstN) + gl::tos(info.e) + gl::tos(lastN));
    }

    return er::OK;
}

template <class H>
bool db::Index<H>::cutIndexAt(const string & sdn, gl::intint N)
{
    os::Path dnfile = findFile(sdn);
    db::RangePos rpos;

    if ( dnfile.empty() )
        return false;

    rpos.e = 0;

    if ( N == 0 )
        return os::FileSys::erase(dnfile);

    IndexReader ir(dnfile);

    N--;
    if ( ir.getRangePos(N, N, rpos) != er::OK )
        return false;

    return os::FileSys::truncate(dnfile.str(), rpos.epos + 1);
}

db::IndexReader::IndexReader(os::Path path, gl::intint initial_rdbuf_size) :
    code(er::IR_NOT_INITED), first_N(-1), last_N_data(0),
    last_N_data_size(0), rdbuf(0), avg_size(0), rdata(0)
{
    reinit(path, initial_rdbuf_size);
}

db::IndexReader::~IndexReader()
{
    release();
}

er::CodeType db::IndexReader::readFirstN()
{
    gl::intint sz = 100;
    char       buf[100];

    if ( code != er::OK )
        return code;
    if ( first_N != -1 )
        return er::OK;

    if ( last_N_pos == 0 )
    {
        first_N = last_N;
        return er::OK;
    }

    if ( sz > last_N_data_size )
        sz = last_N_data_size;

    file.seekg(0);
    file.read(buf, sz);

    if ( !getN(buf, sz, first_N) || first_N < 0 || first_N >= last_N )
        return er::IR_BAD_INTEGRITY;

    return er::OK;
}

er::CodeType db::IndexReader::calcAvg()
{
    er::CodeType ret;

    if ( code != er::OK )
        return code;
    if ( avg_size != 0 )
        return er::OK;

    ret = readFirstN();
    if ( ret != er::OK )
        return ret;

    if ( last_N_pos != 0 )
        avg_size = last_N_pos / (last_N - first_N);
    else
        avg_size = last_N_data_size;

    return er::OK;
}

er::CodeType db::IndexReader::find(gl::intint N, std::streamoff & pos)
{
    gl::intint     closeN = -1;
    std::streamoff closeNpos = -1;

    gl::intint     prevN = -1;
    gl::intint     rightN = -1;
    std::streamoff rightNpos = -1;
    gl::intint     local_avg_size;

    er::CodeType   ret = calcAvg();

    if ( ret != er::OK )
        return ret;

    if ( N < 0 )
        return er::IDX_NEG;
    else if ( N < first_N )
        return er::NO_RECS;
    else if ( N > last_N )
        return er::IDX_HIGH;
    else if ( N == first_N )
    {
        pos = 0;
        return er::OK;
    }
    else if ( N == last_N )
    {
        pos = last_N_pos;
        return er::OK;
    }

    if ( rdbuf_size == 0 )
    {
        rdbuf_size = last_N_data_size * X;
        if ( rdbuf_size > last_N_pos )
        {
            if ( last_N == first_N )
                rdbuf_size = last_N_data_size;
            else rdbuf_size = last_N_pos;
        }
        rdbuf = new char[gl::ii2i(rdbuf_size)];
        REPORT(rdbuf);
    }

    rdbuf_pos = avg_size * ( N - first_N ) - ( rdbuf_size - avg_size ) / 2;
    if ( rdbuf_pos < 0 )
        rdbuf_pos = 0;
    else if ( rdbuf_pos + rdbuf_size - 1 >= last_N_pos )
        rdbuf_pos = last_N_pos - rdbuf_size;

    while ( true )
    {

B :

        file.seekg(rdbuf_pos);
        file.read(rdbuf, rdbuf_size);

        for ( int i = 0; i < rdbuf_size - 2; i++ )
        {
            if ( rdbuf[i] == '\n' )
            {
                closeNpos = rdbuf_pos + i + 1;

                if ( getN(&rdbuf[i + 1], rdbuf_size - i - 1, closeN) )
                {
                    if ( closeN < first_N || closeN > last_N )
                        return er::IR_BAD_INTEGRITY;

                    if ( prevN == -1 )
                        prevN = closeN;
                    else
                    {
                        if ( closeN - prevN != 1 || closeN >= last_N )
                            return er::IR_BAD_INTEGRITY;
                        prevN = closeN;
                    }

                    if ( closeN == N )
                    {
                        pos = closeNpos;
                        return er::OK;
                    }
                    if ( closeN > N )
                    {
                        rightN = closeN;
                        rightNpos = closeNpos;

                        rdbuf_pos -= (closeN - N + (X - 1) / 2) * avg_size;
                        if ( rdbuf_pos < 0 )
                            rdbuf_pos = 0;
                        closeNpos = -1;
                        closeN = -1;
                        prevN = -1;
                        goto B;
                    }
                }
            }
        }
        if ( closeNpos == -1 )
        {
            rdbuf_pos += rdbuf_size - 2;
            if ( rdbuf_pos + rdbuf_size - 1 >= last_N_pos )
                rdbuf_pos = last_N_pos - rdbuf_size;
        }
        else
        {
            if ( closeN == -1 )
            {
                rdbuf_pos = closeNpos - 1;
                if ( rdbuf_pos + rdbuf_size - 1 >= last_N_pos )
                    rdbuf_pos = last_N_pos - rdbuf_size;
                closeNpos = -1;
            }
            else
            {
                if ( N < closeN )
                    return er::IR_BAD_INTEGRITY;
                if ( rightN == -1 )
                    local_avg_size = avg_size;
                else
                {
                    if ( rightN <= closeN )
                        return er::IR_BAD_INTEGRITY;
                    local_avg_size = ( rightNpos - closeNpos ) / ( rightN - closeN );
                }

                if ( N - closeN > ( X - 1 ) )
                    rdbuf_pos = closeNpos + ( N - closeN - ( X - 1 ) / 2 ) * local_avg_size;
                else rdbuf_pos = closeNpos - 1;
                if ( rdbuf_pos + rdbuf_size - 1 >= last_N_pos )
                    rdbuf_pos = last_N_pos - rdbuf_size;
                closeNpos = -1;
                closeN = -1;
            }
        }
        prevN = -1;
    }
}

er::CodeType db::IndexReader::findEnd(std::streamoff from, std::streamoff & pos)
{
    if ( from < 0 || from > last_N_pos + last_N_data_size )
        return er::IR_BAD_POS;

    if ( rdbuf_size == 0 )
    {
        rdbuf_size = last_N_data_size * X;
        if ( rdbuf_size > last_N_pos )
        {
            if ( last_N == first_N )
                rdbuf_size = last_N_data_size;
            else rdbuf_size = last_N_pos;
        }

        rdbuf = new char[gl::ii2i(rdbuf_size)];
        REPORT(rdbuf);

        rdbuf_pos = from;
        if ( rdbuf_pos + rdbuf_size - 1 >= last_N_pos + last_N_data_size - 1 )
            rdbuf_pos = last_N_pos + last_N_data_size - rdbuf_size;

        file.seekg(rdbuf_pos);
        file.read(rdbuf, rdbuf_size);
    }

    while ( true )
    {
        if ( from >= rdbuf_pos )
        {
            while ( from < rdbuf_pos + rdbuf_size )
            {
                if ( rdbuf[from - rdbuf_pos] == '\n' )
                {
                    pos = from;
                    return er::OK;
                }
                from++;
            }
        }

        rdbuf_pos = from;
        if ( rdbuf_pos + rdbuf_size - 1 >= last_N_pos + last_N_data_size - 1 )
            rdbuf_pos = last_N_pos + last_N_data_size - rdbuf_size;

        file.seekg(rdbuf_pos);
        file.read(rdbuf, rdbuf_size);
    }
}

er::CodeType db::IndexReader::read(std::streamoff from, std::streamoff to)
{
    if ( from < 0 || from > last_N_pos + last_N_data_size - 1 ||
            to < 0 || to > last_N_pos + last_N_data_size - 1 || from > to )
        return er::IR_BAD_POS;

    delete [] rdata;

    rdata = new char[static_cast<int>(to - from + 1 + 1)];
    REPORT(rdata);

    rdata[to - from + 1] = 0;

    if ( from >= rdbuf_pos && from < rdbuf_pos + rdbuf_size &&
            to >= rdbuf_pos && to < rdbuf_pos + rdbuf_size )
        std::memcpy(rdata, &rdbuf[from - rdbuf_pos], static_cast<size_t>(to - from + 1));
    else
    {
        file.seekg(from);
        file.read(rdata, to - from + 1);
    }

    return er::OK;
}

bool db::IndexReader::getN(const char * data, gl::intint max, gl::intint & N)
{
    std::string s;

    for ( int i = 0; i < max; i++ )
    {
        if ( data[i] == ' ' )
        {
            s.assign(data, i);
            N = gl::toii(s);
            return true;
        }
    }
    return false;
}

er::CodeType db::IndexReader::accessLast(const char *& data)
{
    if ( code == er::OK )
        data = last_N_data;
    return code;
}

er::CodeType db::IndexReader::accessFirst(const char *& data)
{
    er::CodeType ret = readFirstN();

    if ( ret != er::OK )
        return ret;

    return accessRecord(first_N, data);
}

er::CodeType db::IndexReader::accessRecord(gl::intint N, const char *& data)
{
    er::CodeType ret;
    std::streamoff pos1, pos2;

    if ( N < 0 )
        N = last_N + N + 1;

    ret = find(N, pos1);
    if ( ret != er::OK )
        return ret;

    ret = findEnd(pos1, pos2);
    if ( ret != er::OK )
        return ret;

    ret = read(pos1, pos2);
    if ( ret != er::OK )
        return ret;

    data = rdata;
    return er::OK;
}

er::CodeType db::IndexReader::accessRange(gl::intint N1, gl::intint N2, gl::intint max,
        gl::intint & would_be_count, const char *& data, gl::intint & count)
{
    std::streamoff pos1, pos2, pos3;
    er::CodeType   ret;

    would_be_count = count = 0;

    ret = readFirstN();
    if ( ret != er::OK )
        return ret;


    if ( N1 < 0 )
        N1 = last_N + N1 + 1;

    if ( N2 < 0 )
        N2 = last_N + N2 + 1;

    if ( N2 < N1 )
        return er::BAD_RANGE;


    if ( N1 > last_N )
        return er::IDX_HIGH;

    if ( N2 < 0 )
        return er::IDX_NEG;

    if ( N2 < first_N )
        return er::NO_RECS;


    if ( N1 < first_N )
        N1 = first_N;

    if ( N2 > last_N )
        N2 = last_N;

    would_be_count = N2 - N1 + 1;


    if ( max == 0 )
    {
        data = 0;
        count = 0;
        return er::OK;
    }

    if ( max > 0 && would_be_count > max )
        N1 = N2 - max + 1;


    ret = find(N1, pos1);
    if ( ret != er::OK )
        return ret;

    ret = find(N2, pos2);
    if ( ret != er::OK )
        return ret;

    ret = findEnd(pos2, pos3);
    if ( ret != er::OK )
        return ret;

    ret = read(pos1, pos3);
    if ( ret != er::OK )
        return ret;

    data = rdata;
    count = N2 - N1 + 1;

    return er::OK;
}

er::CodeType db::IndexReader::getRangePos(gl::intint N1, gl::intint N2, RangePos & info)
{
    std::streamoff pos1 = 0, pos2;
    er::CodeType ret;

    if ( code != er::OK )
        return code;

    if ( N1 < 0 )
        N1 = last_N + N1 + 1;

    if ( N2 < 0 )
        N2 = last_N + N2 + 1;

    if ( N2 < N1 )
        return er::BAD_RANGE;

    if ( N1 > last_N )
    {
        info.b = info.e = -1;
        info.bpos = info.epos = last_N_pos + last_N_data_size - 1;
        return er::OK;
    }

    ret = readFirstN();
    if ( ret != er::OK )
        return ret;

    if ( N2 < first_N )
    {
        info.b = info.e = -1;
        info.bpos = info.epos = 0;
        return er::OK;
    }

    if ( N1 < first_N )
        N1 = first_N;

    if ( N1 == last_N )
    {
        info.b = info.e = last_N;
        info.bpos = last_N_pos;
        info.epos = last_N_pos + last_N_data_size - 1;
        return er::OK;
    }

    if ( N1 == first_N )
    {
        info.b = first_N;
        info.bpos = 0;
    }
    else
    {
        ret = find(N1, pos1);
        if ( ret != er::OK )
            return ret;
        info.b = N1;
        info.bpos = pos1;
    }

    if ( N2 > last_N )
        N2 = last_N;

    if ( N2 == last_N )
    {
        info.e = last_N;
        info.epos = last_N_pos + last_N_data_size - 1;
        return er::OK;
    }

    if ( N2 != N1 )
    {
        ret = find(N2, pos1);
        if ( ret != er::OK )
            return ret;
    }

    ret = findEnd(pos1, pos2);
    if ( ret != er::OK )
        return ret;
    info.e = N2;
    info.epos = pos2;

    return er::OK;
}

gl::intint db::IndexReader::getFirstN()
{
    if ( readFirstN() != er::OK )
        return -1;

    return first_N;
}

gl::intint db::IndexReader::getLastN()
{
    if ( code != er::OK )
        return -1;

    return last_N;
}

void db::IndexReader::release()
{
    code = er::IR_NOT_INITED;
    first_N = -1;
    if ( file.is_open() ) file.close();
    delete [] last_N_data;
    delete [] rdbuf;
    delete [] rdata;
    last_N_data = rdbuf = rdata = 0;
    last_N_data_size = avg_size = 0;
}

void db::IndexReader::reinit(os::Path path, gl::intint initial_rdbuf_size)
{
    std::streamoff    fsize, pos;
    std::list<char *> blocks;
    gl::intint        rsize, size = 0, i = 0;
    bool              stop = false;

    release();

    file.open(path.str().c_str(), std::ios::in | std::ios::binary | std::ios::ate);
    if ( !file.is_open() )
        return;
    fsize = file.tellg();
    if ( fsize <= 0 )
        return;

    pos = fsize - 1;
    rdbuf_size = rsize = initial_rdbuf_size;

    while ( pos > 0 && !stop )
    {
        pos -= rdbuf_size;
        if ( pos < 0 )
        {
            rsize = rdbuf_size + pos;
            pos = 0;
        }

        if ( rsize > 0 )
        {
            rdbuf = new char[gl::ii2i(rsize)];
            REPORT(rdbuf);

            blocks.push_front(rdbuf);

            file.seekg(pos);
            file.read(rdbuf, rsize);

            i = rsize - 1;
            while ( i >= 0 )
            {
                if ( rdbuf[i] == '\n' )
                {
                    stop = true;
                    break;
                }
                i--;
            }
            size = rsize - i - 1;
            last_N_data_size += size;
        }
    }

    last_N_data_size++;

    last_N_data = new char[gl::ii2i(last_N_data_size)];
    REPORT(last_N_data);

    std::memcpy(last_N_data, &rdbuf[i + 1], gl::ii2st(size));
    delete [] blocks.front();
    blocks.pop_front();

    rdbuf = 0;

    while ( !blocks.empty() )
    {
        if ( last_N_data )
        {
            std::memcpy(&last_N_data[size], blocks.front(), gl::ii2st(rdbuf_size));
            size += rdbuf_size;
        }

        delete [] blocks.front();
        blocks.pop_front();
    }

    if ( last_N_data )
    {
        last_N_data[size] = 0;
        if ( !getN(last_N_data, last_N_data_size, last_N) || last_N < 0 )
            return;
        last_N_pos = fsize - last_N_data_size;
        rdbuf_size = 0;
        code = er::OK;
    }
}


os::Path db::IndexGenerator::MetaNameGenerator::sub_dir() const
{
    if ( n < 10 ) return "";
    string s = gl::tos(n);
    os::Path r;
    for ( size_t i = 0; i < s.size() - 1; i++ )
    {
        r += s.substr(i, 1);
    }
    return r;
}

void db::IndexGenerator::MetaNameGenerator::init(const string & meta_dir)
{
    meta_path = meta_dir;
    n = -1;
    short_name = "";
    if ( !meta_dir.empty() )
    {
        os::Dir dir = os::FileSys::readDirEx(meta_path, false, true);
        if ( dir.files.size() > 0 )
        {
            size_t pos1, pos2;

            pos1 = dir.files[0].first.rfind('.');
            if ( pos1 != string::npos )
            {
                pos2 = dir.files[0].first.rfind('.', pos1 - 1);
                if ( pos2 != string::npos )
                    short_name = dir.files[0].first.substr(pos2 + 1, pos1 - pos2 - 1);
            }
        }
    }
}

os::Path db::IndexGenerator::MetaNameGenerator::next()
{
    n++;
    os::Path r = dir() + gl::tos(n);
    r.glue(string(".meta.") + short_name + ".txt");
    return r;
}

er::CodeType db::IndexGenerator::processMeta(const string & meta_file, const string & index_dir_out,
        const db::TraitsData & traits)
{
    std::ifstream     file(meta_file.c_str(), std::ios::in | std::ios::binary | std::ios::ate);
    std::streamoff    fsize;
    char       *      buf;
    string            base;
    string::size_type pos;
    er::CodeType      ret;

    pos = meta_file.find_last_of('/');
    pos = meta_file.find_last_of('/', pos - 1);
    if ( pos == meta_file.npos )
        return er::IG_PATH_NOT_FOUND;
    base = meta_file.substr(0, pos + 1);

    if ( !file.is_open() )
        return er::IG_FILE_NOT_FOUND;

    fsize = file.tellg();
    if ( fsize <= 0 )
        return er::IG_CANNOT_READ;

    buf = new char[gl::ii2i(fsize)];
    REPORT(buf);

    file.seekg(0);
    file.read(buf, fsize);
    file.close();

    string bufs(buf, gl::ii2i(fsize));
    size_t pos1 = 0, pos2, pos3;

    delete buf;

    pos2 = bufs.find('\n', pos1);
    while ( pos2 != string::npos )
    {
        pos3 = bufs.find(' ', pos1);
        if ( pos3 == string::npos )
            return er::IG_FILE_CORRUPTED;

        ret = processSlice(base, bufs.substr(pos1, pos3 - pos1), index_dir_out, traits);
        if ( ret != er::OK )
            return ret;

        pos1 = pos2 + 1;
        pos2 = bufs.find('\n', pos1);
    }

    return er::OK;
}

er::CodeType db::IndexGenerator::processSlice(const string & slice_base, const string & slice_file, const string & index_dir_out,
        const db::TraitsData & traits)
{
    string path;

    path = slice_file.substr(0, 8);
    path.insert(6, 1, '/');
    path.insert(4, 1, '/');
    path.append(1, '/');
    path = slice_base + path + slice_file;

    std::ifstream  file(path.c_str(), std::ios::in | std::ios::binary | std::ios::ate);
    std::streamoff fsize;
    char     *     buf;
    Record    *    rec_new = 0, * rec_prev = 0;

    if ( !file.is_open() )
        return er::IG_FILE_NOT_FOUND;

    fsize = file.tellg();
    if ( fsize <= 0 )
        return er::IG_CANNOT_READ;

    buf = new char[gl::ii2i(fsize)];
    REPORT(buf);

    file.seekg(0);
    file.read(buf, fsize);
    file.close();

    string bufs(buf, gl::ii2i(fsize));
    size_t pos1 = 0, pos2 = bufs.find('\n', pos1);

    delete buf;

    while ( pos2 != string::npos )
    {
        rec_new = db::Record::create(traits.hashNameShort);
        if ( !rec_new ||
                rec_new->init(bufs.substr(pos1, pos2 - pos1), traits.nG) != er::OK )
            goto error_exit;

        os::Path dnfile = db::findDnFile(rec_new->dnstr(), 0, index_dir_out);

        if ( !dnfile.empty() )
        {
            IndexReader  ir(dnfile);
            gl::intint   n_prev = rec_new->n() - 1;
            const char * data_prev;

            if ( n_prev >= 0 )
            {
                if ( ir.accessRecord(n_prev, data_prev) != er::OK )
                    goto error_exit;

                rec_prev = db::Record::create(traits.hashNameShort);
                if ( !rec_prev ||
                        rec_prev->init(data_prev, traits.nG) != er::OK ||
                        rec_new->validate(*rec_prev, traits.magic) != er::OK )
                    goto error_exit;

                if ( ir.getLastN() > n_prev )
                {
                    RangePos rpos;

                    if ( ir.getRangePos(n_prev, n_prev, rpos) != er::OK )
                        goto error_exit;

                    ir.release();
                    os::FileSys::truncate(dnfile.str(), rpos.epos + 1);
                }
            }
            else if ( n_prev == -1 )
            {
                ir.release();
                os::FileSys::truncate(dnfile.str(), 0);
            }
            else goto error_exit;  // never
        }
        else
            dnfile = makeDnFile(rec_new->dnstr(), 0, index_dir_out);

        std::ofstream of;

        of.open(dnfile.str().c_str(), std::ios::app | std::ios::binary);
        of << rec_new->str().c_str() << '\n';
        if ( !of )
            throw gl::Exception("db::IndexGenerator::processSlice: "
                                " Failed to write to file [$1]", dnfile.str());
        of.close();

        delete rec_new;
        delete rec_prev;
        rec_new = rec_prev = 0;

        pos1 = pos2 + 1;
        pos2 = bufs.find('\n', pos1);
    }

    return er::OK;

error_exit:

    delete rec_new;
    delete rec_prev;
    return er::IG_FILE_CORRUPTED;
}

er::CodeType db::IndexGenerator::generate(const string & slice_dir_in, const string & index_dir_out)
{
    string            idxdir;
    os::Path          uNs_dir(slice_dir_in), dbTraits;
    os::Dir           uNs = os::FileSys::readDir(uNs_dir);
    string            uNfull;
    MetaNameGenerator mng;
    db::TraitsData    traits;
    er::CodeType      ret;

    for ( size_t i = 0; i < uNs.dirs.size(); i++ )
    {
        uNfull = string(slice_dir_in) + "/" + uNs.dirs[i];
        dbTraits = uNfull + "/db.traits";
        if ( !dbTraits.isfile() )
            continue;

        if ( !db::loadTraitsData(dbTraits.str(), traits) )
            return er::IG_CANNOT_READ;

        idxdir = index_dir_out + "/" + uNs.dirs[i];
        os::FileSys::trymkdir(idxdir);

        mng.init(uNfull + "/meta");
        while (1)
        {
            ret = processMeta(mng.next().str(), idxdir, traits);
            if ( ret == er::IG_FILE_NOT_FOUND )
                break;
            if ( ret != er::OK )
                return ret;
        }
    }
    return er::OK;
}

#include "hq_dbindex.inc"
