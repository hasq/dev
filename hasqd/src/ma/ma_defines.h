#define ROL(x, n)   (((x) << (n)) | ((x) >> (32-(n))))

// RMD

#define RMD_F(x, y, z)  ((x) ^ (y) ^ (z))
#define RMD_G(x, y, z)  (((x) & (y)) | (~(x) & (z)))
#define RMD_H(x, y, z)  (((x) | ~(y)) ^ (z))
#define RMD_I(x, y, z)  (((x) & (z)) | ((y) & ~(z)))
#define RMD_J(x, y, z)  ((x) ^ ((y) | ~(z)))

// MD5

#define MD5_F(x, y, z)  (((x) & (y)) | (~(x) & (z)))
#define MD5_G(x, y, z)  (((x) & (z)) | ((y) & ~(z)))
#define MD5_H(x, y, z)  ((x) ^ (y) ^ (z))
#define MD5_I(x, y, z)  ((y) ^ ((x) | ~(z)))

#define MD5_FF(a, b, c, d, x, s, ac) {\
    (a) += MD5_F((b), (c), (d)) + (x) + (ac);\
    (a) = ROL((a), (s)) + (b);\
}

#define MD5_GG(a, b, c, d, x, s, ac) {\
    (a) += MD5_G((b), (c), (d)) + (x) + (ac);\
    (a) = ROL((a), (s)) + (b);\
}

#define MD5_HH(a, b, c, d, x, s, ac) {\
    (a) += MD5_H((b), (c), (d)) + (x) + (ac);\
    (a) = ROL((a), (s)) + (b);\
}

#define MD5_II(a, b, c, d, x, s, ac) {\
    (a) += MD5_I((b), (c), (d)) + (x) + (ac);\
    (a) = ROL((a), (s)) + (b);\
}

// SHA-2

#define R(b,x)      ((x) >> (b))
#define SA(b,x)    (((x) >> (b)) | ((x) << (32 - (b))))
#define SB(b,x)    (((x) >> (b)) | ((x) << (64 - (b))))

#define C(x,y,z)    (((x) & (y)) ^ ((~(x)) & (z)))
#define M(x,y,z)    (((x) & (y)) ^ ((x) & (z)) ^ ((y) & (z)))

#define SB0_256(x)  (SA(2,  (x)) ^ SA(13, (x)) ^ SA(22, (x)))
#define SB1_256(x)  (SA(6,  (x)) ^ SA(11, (x)) ^ SA(25, (x)))
#define SS0_256(x)  (SA(7,  (x)) ^ SA(18, (x)) ^ R(3 ,   (x)))
#define SS1_256(x)  (SA(17, (x)) ^ SA(19, (x)) ^ R(10,   (x)))

#define SB0_512(x)  (SB(28, (x)) ^ SB(34, (x)) ^ SB(39, (x)))
#define SB1_512(x)  (SB(14, (x)) ^ SB(18, (x)) ^ SB(41, (x)))
#define SS0_512(x)  (SB( 1, (x)) ^ SB( 8, (x)) ^ R( 7,   (x)))
#define SS1_512(x)  (SB(19, (x)) ^ SB(61, (x)) ^ R( 6,   (x)))
