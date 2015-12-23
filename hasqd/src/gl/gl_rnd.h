// Hasq Technology Pty Ltd (C) 2013-2015

#ifndef RAND_H_
#define RAND_H_

#if defined(__GNUC__) && defined(__GNUC_MINOR__) && ( __GNUC__ < 4 )

#include <cstdlib>

namespace gl
{
class Rnd
{
    public:
        static unsigned long seed;
        Rnd() { std::srand(int(seed)); }
        double operator()() { return double(std::rand()) / RAND_MAX; }
};
}

#else

#include <random>
#include <algorithm>
#include <iterator>
#include <functional>

namespace gl
{
class Rnd
{
        std::default_random_engine reng;
        std::uniform_real_distribution<double> dist;
        std::function<double()> rnd;

    public:

        static unsigned long seed;

        Rnd(): reng(seed), dist(0, 1), rnd( std::bind(dist, reng) ) {}
        double operator()() { return rnd(); }
};
} // gl

#endif // GCC


#endif

