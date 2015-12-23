#include <string>
#include <sstream>

class Num
{
        typedef long long T;
        T x;

    public:
        Num() {}
        Num(unsigned long long a): x(a) {}

        // Constrains
        bool operator<(const Num & a) const { return x < a.x; }
        void swap(Num & a) { T t = x; x = a.x; a.x = t; }
        bool operator==(const Num & a) const { return x == a.x; }

        static void divABRQ(const Num & a, const Num & b, Num * r, Num * q)
        { if (r) r->x = a.x % b.x; if (q) q->x = a.x / b.x; }

        void mulMod(const Num & b, const Num & mod) { x *= b.x; x %= mod.x; }
        void add(const Num & b) { x += b.x; }
        void sub(const Num & b) { x -= b.x; }
        std::string str() const { std::ostringstream os; os << x; return os.str(); }

        // Derived
        bool operator!=(const Num & a) const { return !(*this == a); }
        void subMod(const Num & b, const Num & mod) { if ( *this < b) add(mod); sub(b); }
        void addMod(const Num & b, const Num & mod)
        {
            add(b);
                while (1) if ( *this < mod ) break; else sub(mod);
        }
        bool operator>(const Num & a) const { return !(*this < a || *this == a); }

};


