// Hasq Technology Pty Ltd (C) 2013-2015

#ifndef XY_H
#define XY_H

#include "sg_cout.h"

class XY
{
        int mX, mY;
    public:
        XY(): mX(-1), mY(-1) {}
        XY(int x, int y): mX(x), mY(y) {}

        int x() const { return mX; }
        int y() const { return mY; }
        int & y() { return mY; }
        int & x() { return mX; }
        int xy() const { return mX * mY; }

        bool operator==(const XY & a) const { return mX == a.mX && mY == a.mY; }
        bool operator!=(const XY & a) const { return !(a == *this); }
        bool operator<(const XY & s) const { return mX < s.mX ? true : s.mX < mX ? false : mY < s.mY; }

        friend std::istream & operator>>(std::istream & is, XY & xy)
        { return is >> xy.mX >> xy.mY; }

        friend std::ostream & operator<<(std::ostream & os, const XY & xy)
        { return os << xy.mX << ' ' << xy.mY; }

        friend const os::Cout & operator<<(const os::Cout & s, const XY & xy)
        { return s << xy.mX << ' ' << xy.mY; }
};


#endif

