#include <string>

class MD5 {
public:
  typedef unsigned int size_type;

  MD5();
  MD5(const std::string& text);
  void update(const unsigned char *buf, size_type length);
  void update(const char *buf, size_type length);
  MD5& finalize();

  const unsigned char * getDigest(void) const { return digest; }

private:
  void init();
  typedef unsigned char uint1;
  typedef unsigned int uint4;
  enum {blocksize = 64};

  void transform(const uint1 block[blocksize]);
  static void decode(uint4 output[], const uint1 input[], size_type len);
  static void encode(uint1 output[], const uint4 input[], size_type len);

  bool finalized;
  uint1 buffer[blocksize];
  uint4 count[2];
  uint4 state[4];
  uint1 digest[16];
};
