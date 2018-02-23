// Hasq Technology Pty Ltd (C) 2013-2015

#include <iostream>

#include "gl_except.h"

#include "sg_testing.h"

int main()
try
{
    sgl::testing();
}
catch (gl::Exception e)
{
    std::cout << "Error: " << e.str() << '\n';
    return 1;
}
