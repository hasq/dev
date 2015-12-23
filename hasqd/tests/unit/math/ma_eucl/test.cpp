#include <iostream>

#include "euclid/meuclid.h"
#include "euclid/num.h"

int main()
{
    Meuclid<Num> e(9, 24, 24);
    std::cout << e.str();

    Num m(132);
    for ( int i = 1; i < 10; i++ )
    {
        Invertor<Num> v(i, m);
        std::cout << (v.isOk() ? "ok  " : "bad ") << v.get().str()
                  << '\t' << i << '\t' << m.str() << '\n';
    }

	if( Invertor<Num>(7, m).get() != 19 ) return 1;
	if( Invertor<Num>(9, m).isOk() ) return 1;
}

#include "euclid/meuclid.inc"
