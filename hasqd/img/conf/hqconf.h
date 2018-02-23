#include <string>
#include <istream>
#include <vector>

using std::string;

class HqConf
{
    public:

        static const size_t Size = 2048;

    public:

        string interface;
        string subnetmask;
        string broadcast;
        string gateway;
        string nameserver;
        string hostname;
        std::vector<string> hosts;

        string clo;

        struct Db
        {
            string dir;
            string hash;
            string text;
            string nG;
            string magic;
            string sliceKb;
            string thin;
            string limit;

            void isValid() const;
        };

        typedef std::vector<Db> Dbs;
        Dbs dbs;


    public:

        bool loadFromFile();
        bool loadFromPath(string & s);
        void loadFromStream(std::istream & is);
        void patchStr(string & s) const;
        void loadFromStr(const string & s);
        void saveToFile() const;
        void saveAtPath(string path) const;
        static string filename();
        static string mazconst();

    private:

        void loadDb(std::istream & in);
        void loadHosts(std::istream & in);
        static void eatSpaces(string & s);

        static size_t findOffset(const string & s);

        string saveToStr() const;

};


