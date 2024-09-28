// Hasq Technology Pty Ltd (C) 2013-2016

#include "gl_defs.h"
#include "sg_mem.h"

#ifdef TEST_MEMORY

#include <cstdlib>
#include <cstdio>
#include <new>

#include "sg_mutex.h"

const size_t MEM_MGR_SIZE = 10000;

static os::Semaphore mem_lock(1);

void * operator new(size_t x) ; // throw (std::bad_alloc);
void operator delete(void * p) throw ();
void * operator new[](size_t x) ; // throw (std::bad_alloc);
void operator delete[](void * p) throw ();

struct Memrec
{
    static unsigned long gid() { static unsigned long i = 0; return ++i; }
    void * p;
    unsigned long int id;
    size_t sz;
    bool v; // vector or scalar
    Memrec(): p(0) {}
    Memrec(size_t sz, void * q, bool bv): p(q), id(gid()), sz(sz), v(bv) {}
};

struct Repo
{
        Memrec v[MEM_MGR_SIZE];
        int sz;
    public:
        Memrec get(size_t i) const { return v[i]; }
        int size() const { return sz; }
        Repo(): sz(0) {}
        void add(Memrec mr);
        int find(void * p);
        void erase(int idx);
} repo;

static size_t peak = 0;
static size_t total = 0;
static unsigned long int number_new = 0;
static unsigned long int number_del = 0;

struct mem_object_t
{
    ~mem_object_t();
} * mem_object = 0;

bool init = false;

void init_mem()
{
    if ( init ) return;
    static mem_object_t x;
    mem_object = &x;
    init = true;
}

void * mgr_new(size_t x, bool v)
{
    sgl::Mutex mutex(mem_lock);
    init_mem();

    void * p = std::malloc(x);

    Memrec mr(x, p, v);
    repo.add(mr);

    total += x;
    if ( total > peak ) peak = total;
    number_new++;

    if (0) // this code can work if you need to find memory leak
    {
        if ( mr.id > 38500 && mr.id < 39000 && mr.sz == 15 )
        {
            printf("new(%ld,%d,%p,%d)\n", mr.id, static_cast<int>(mr.sz), mr.p, mr.v);
            void printStack();
            printStack();
        }
    }

    return p;
}

void * operator new(size_t x) //throw (std::bad_alloc)
{
    void * p = mgr_new(x, false);
    return p;
}

void mgr_delete(void * p, bool v)
{
    sgl::Mutex mutex(mem_lock);
    if ( p == 0 ) return;

    std::free(p);

    int mi = repo.find(p);
    if ( mi < 0 )
    {
        if ( repo.size() )
            printf("TEST_MEMORY: bad DELETE (%p)\n", p);
        else if ( TEST_MEMORY_REPORT ) printf("TEST_MEMORY: unknown (%p)\n", p);
    }
    else
    {
        Memrec mr = repo.get(mi);

        if ( mr.v != v ) printf("TEST_MEMORY: inconsistent DELETE (%p)\n", p);

        repo.erase(mi);

        total -= mr.sz;
        number_del++;
    }
}

void operator delete(void * p) throw ()
{
    mgr_delete(p, false);
}

void * operator new[](size_t x) // throw (std::bad_alloc)
{
    void * p = mgr_new(x, true);
    return p;
}

void operator delete[](void * p) throw ()
{
    mgr_delete(p, true);
}


mem_object_t::~mem_object_t()
{
    if ( repo.size() == 0 )
    {
        if ( TEST_MEMORY_REPORT )
            printf("\nTEST_MEMORY: No memory leaks");
    }
    else
    {
        printf("\nTEST_MEMORY: Memory leaks : ");
        unsigned long min_id = 0;
        size_t min_sz = 0;
        for ( size_t i = 0; i < MEM_MGR_SIZE; ++i )
        {
            Memrec m = repo.get(i);
            if ( m.p )
            {
                printf( "[%p, id=%ld, size=%d] ", m.p, m.id, static_cast<int>(m.sz) );
                if ( min_id == 0 || min_id > m.id )
                {
                    min_id = m.id;
                    min_sz = m.sz;
                }
            }
        }
        printf( "\nMin [id=%ld, size=%d] ", min_id, static_cast<int>(min_sz) );
    }

    if ( TEST_MEMORY_REPORT )
        printf("\nTEST_MEMORY: peak = %d, total=%d, new=%ld, del=%ld\n",
               static_cast<int>(peak), static_cast<int>(total), number_new, number_del);
}


void Repo::add(Memrec mr)
{
    size_t idx0 = ( gl::p2st(mr.p) % MEM_MGR_SIZE );
    size_t i = idx0;
    while (1)
    {
        if ( v[i].p == 0 ) break;
        if ( ++i == MEM_MGR_SIZE ) i = 0;
        if ( i == idx0 ) printf("TEST_MEMORY: storage full - increase MEM_MGR_SIZE\r");
    }

    sz++;

    v[i] = mr;
}

int Repo::find(void * p)
{
    size_t idx0 = ( gl::p2st(p) % MEM_MGR_SIZE );
    size_t i = idx0;
    while (1)
    {
        if ( v[i].p == p ) return static_cast<int>(i);
        if ( ++i == MEM_MGR_SIZE ) i = 0;
        if ( i == idx0 ) break;
    }

    return -1;
}

void Repo::erase(int idx)
{
    v[idx].p = 0;
    sz--;
}

#endif

