// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _GL_QUEUE
#define _GL_QUEUE

#include <string>

#include "gl_except.h"

using std::string;

// No mutex unsafe queue

namespace gl
{

template <class T>
class UnsafeFastQueue
{
        const int SZ;
        volatile T * x;
        volatile unsigned b, e;
        // writer writes x and b
        // reader writes e, and reads x and b

        UnsafeFastQueue(const UnsafeFastQueue &);
        void operator=(const UnsafeFastQueue &);

    public:

        UnsafeFastQueue(int sz): SZ(sz), b(0), e(0)
        {
            if (SZ < 2) throw gl::ex("UnsafeFastQueue");
            x = new T[SZ];
            REPORT(x);
        }

        ~UnsafeFastQueue() { delete [] x; }

        bool empty() const { return b == e; }

        void push(const T & a) { x[ (++b) % SZ ] = a; }

        T pop_frontX()
        {
            unsigned a = b;
            e = a;
            return x[ a % SZ ];
        }

        T pop_some()
        {
            unsigned a = b;
            if ( a > e + SZ / 2 ) e = a - SZ / 2; // longer history lost
            return x[ ++e % SZ ];
        }
};


} //gl

#endif


