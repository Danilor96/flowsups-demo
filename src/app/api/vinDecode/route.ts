import { NextResponse } from 'next/server';
import crypto from 'crypto';
const apiKey = process.env.VIN_DECODER_API_KEY;
const secretKey = process.env.VIN_DECODER_SECRET_KEY;

export async function POST(request: Request) {
  const formData = await request.formData();

  const vin = formData.get('vin');

  //https://api.vindecoder.eu/3.2/f3d0ea935c7c/77e34ae899/decode/1N4AL3AP6DN429599.json

  const apiPrefix = 'https://api.vindecoder.eu/3.2';
  const action = 'decode';

  const hash = sha1(`${vin}|${action}|${apiKey}|${secretKey}`).substring(0, 10);
  const path = `${apiPrefix}/${apiKey}/${hash}/${action}/${vin}.json`;

  try {
    const data = await (await fetch(path)).json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

const sha1 = (str: string): string => {
  const rotLeft = (n: number, s: number): number => (n << s) | (n >>> (32 - s));

  const cvtHex = (val: number): string => {
    let str = '';
    for (let i = 7; i >= 0; i--) {
      const v = (val >>> (i * 4)) & 0x0f;
      str += v.toString(16);
    }
    return str;
  };

  str = unescape(encodeURIComponent(str));
  const strLen = str.length;

  const wordArray: number[] = [];
  for (let i = 0; i < strLen - 3; i += 4) {
    const j =
      (str.charCodeAt(i) << 24) |
      (str.charCodeAt(i + 1) << 16) |
      (str.charCodeAt(i + 2) << 8) |
      str.charCodeAt(i + 3);
    wordArray.push(j);
  }

  let i: number;
  switch (strLen % 4) {
    case 0:
      i = 0x080000000;
      break;
    case 1:
      i = (str.charCodeAt(strLen - 1) << 24) | 0x0800000;
      break;
    case 2:
      i = (str.charCodeAt(strLen - 2) << 24) | (str.charCodeAt(strLen - 1) << 16) | 0x08000;
      break;
    case 3:
      i =
        (str.charCodeAt(strLen - 3) << 24) |
        (str.charCodeAt(strLen - 2) << 16) |
        (str.charCodeAt(strLen - 1) << 8) |
        0x80;
      break;
    default:
      throw new Error('Unexpected string length');
  }

  wordArray.push(i);

  while (wordArray.length % 16 !== 14) {
    wordArray.push(0);
  }

  wordArray.push(strLen >>> 29);
  wordArray.push((strLen << 3) & 0x0ffffffff);

  let H0 = 0x67452301;
  let H1 = 0xefcdab89;
  let H2 = 0x98badcfe;
  let H3 = 0x10325476;
  let H4 = 0xc3d2e1f0;

  const W: number[] = [];

  for (let blockstart = 0; blockstart < wordArray.length; blockstart += 16) {
    for (let i = 0; i < 16; i++) {
      W[i] = wordArray[blockstart + i];
    }
    for (let i = 16; i <= 79; i++) {
      W[i] = rotLeft(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
    }

    let A = H0;
    let B = H1;
    let C = H2;
    let D = H3;
    let E = H4;

    for (let i = 0; i <= 19; i++) {
      const temp = (rotLeft(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5a827999) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotLeft(B, 30);
      B = A;
      A = temp;
    }

    for (let i = 20; i <= 39; i++) {
      const temp = (rotLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ed9eba1) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotLeft(B, 30);
      B = A;
      A = temp;
    }

    for (let i = 40; i <= 59; i++) {
      const temp =
        (rotLeft(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8f1bbcdc) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotLeft(B, 30);
      B = A;
      A = temp;
    }

    for (let i = 60; i <= 79; i++) {
      const temp = (rotLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0xca62c1d6) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotLeft(B, 30);
      B = A;
      A = temp;
    }

    H0 = (H0 + A) & 0x0ffffffff;
    H1 = (H1 + B) & 0x0ffffffff;
    H2 = (H2 + C) & 0x0ffffffff;
    H3 = (H3 + D) & 0x0ffffffff;
    H4 = (H4 + E) & 0x0ffffffff;
  }

  return [H0, H1, H2, H3, H4].map(cvtHex).join('').toLowerCase();
};
