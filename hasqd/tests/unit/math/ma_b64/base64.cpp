#include <iostream>
#include <sstream>

#include "gl_except.h"
#include "gl_utils.h"

#include "ma_utils.h"

int main()
{
    string x;

    char c;
    while (std::cin.get(c))
    {
        if ( !std::cin ) break;
        x += c;
    }

    x = ma::b64enc(x);

    for ( size_t i = 0; i < x.size(); i++ )
    {
        std::cout << x[i];
        if ( !((i + 1) % 76) ) std::cout << '\n';
    }

    std::cout << '\n';
}
