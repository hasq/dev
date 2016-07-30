// replaces substring in file
// usage in-file out-file file-with-sub-to-replace file-with-replacement
// e.g. replr vx1.vmdk vx2.vmdk file1 file2

#include <iostream>
#include <fstream>
#include <string>
#include <deque>

using std::string;
using std::cout;

string file2str(string f)
{
	string r;

	std::ifstream in(f.c_str(), std::ios::binary);
	while(1)
	{
		char a;
		in.get(a);
		if(!in) break;
		r += a;
	}

	return r;
}

const int SZ=1000;
std::deque<char> buf;

void writebuf(std::ofstream &of, char x)
{
	buf.push_back(x);
	if( buf.size() > SZ )
	{
		of<<buf.front();
		buf.pop_front();
	}
}

void flushbuf(std::ofstream &of)
{
	while( buf.size() )
	{
		of<<buf.front();
		buf.pop_front();
	}
}

void replacebuf(string to)
{
	int sz = to.size();
	for( int i=0; i<sz; i++ ) buf.pop_back();
	for( int i=0; i<sz; i++ ) buf.push_back(to[i]);
}

int main(int ac, char *av[])
{
	if( ac!=5 )
	{
		cout<<"Usage: in out file-sub-to-replace file-replacement\n";
		return 0;
	}

	if( string(av[1]) == av[2] )
	{
		cout<<"in and out are same\n";
		return 1;
	}

	string fr = file2str(av[3]);
	string to = file2str(av[4]);

	if( fr.empty() )
	{
		cout<<"Cannot read file "<<av[3]<<'\n';
		return 2;
	}

	if( fr.size() != to.size() )
	{
		cout<<"Contents of to-replace and replacement have different sizes\n";
		return 3;
	}

	std::ifstream in(av[1],std::ios::binary);
	if( !in )
	{
		cout<<"Cannot open file "<<av[1]<<" for reading\n";
		return 4;
	}

	std::ofstream of(av[2],std::ios::binary);
	if( !of )
	{
		cout<<"Cannot open file "<<av[2]<<" for writing\n";
		return 5;
	}

	int ctr=0;
	int i=0;
	while(1)
	{
		char a;
		in.get(a);
		if( !in ) break;

		writebuf(of,a);

		if( a==fr[i] ) i++;
		else i=0;

//cout<<"AAA "<<i<<a<<'\n';

		if( i==fr.size() )
		{
			i=0;
			replacebuf(to);
		}

		if( !( ++ctr%1000000 ) ) cout<<"."<<std::flush;
	}

	flushbuf(of);
}
