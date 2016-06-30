// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _GL_DEFS
#define _GL_DEFS

#include <cstddef>
#include <cstdio>

namespace gl
{

typedef unsigned long ulong;
typedef unsigned short ushort;
typedef signed long long intint;

const intint MAX_JOBID  =   2000000000L;

inline int c2i(char c) { return int((unsigned char)c); }
inline unsigned c2u(char c) { return unsigned( (unsigned char)(c) ); }
inline int st2i(size_t x) { return static_cast<int>( x ); }
inline int ii2i(intint x) { return static_cast<int>( x ); }
inline size_t p2st(void * p) { return reinterpret_cast<size_t>( p ); }
inline size_t ii2st(intint x) { return static_cast<size_t>( x ); }
inline unsigned long ii2ul(intint x) { return static_cast<unsigned long>( x ); }
inline unsigned short i2us(int i) { return static_cast<unsigned short>(i); }
inline char l2c(long l) { return static_cast<char>( l ); }

template <class T, class U>
inline T * p2p(U * p) { return reinterpret_cast<T *>( p ); }

template <class T, class U>
inline const T * cp2cp(const U * p) { return reinterpret_cast<const T *>( p ); }

template <class T>
inline int x2i(T x) { return static_cast<int>( x ); }

template <class T>
inline size_t x2st(T x) { return static_cast<size_t>( x ); }

} // gl


#define REPORT(x)
//#define REPORT(x) std::printf("(%s:%p) ",__FUNCTION__,(x))

#ifdef TEST_MEMORY

#define TRACEX(x) volatile const char * volatile backtrace_[3] = \
    { (const char *)(0x13131000+x), \
      (const char *)__FUNCTION__, \
      (const char *)(0x83630093) }; backtrace_;
#undef REPORT
#define REPORT(x) std::printf("(%s:%p) ",__FUNCTION__,(x))

#else
#define TRACEX(x)
#endif

#define TRACE TRACEX(0x313)
#define TRACE0 TRACEX(0)
#endif
