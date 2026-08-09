import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secretKey = process.env.CUSTOMER_DATA_ENCRYPTION_KEY
  ? Buffer.from(process.env.CUSTOMER_DATA_ENCRYPTION_KEY, 'hex')
  : undefined;
const iv = process.env.CUSTOMER_DATA_ENCRYPTION_IV
  ? Buffer.from(process.env.CUSTOMER_DATA_ENCRYPTION_IV, 'hex')
  : undefined;

// encrypt function
export const encrypt = (value: string) => {
  if (secretKey && iv) {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
      iv: iv.toString('hex'),
      content: encrypted,
    };
  }
};

// decrypt function
export const decrypt = (value: any) => {
  if (secretKey) {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(value.iv, 'hex'));
    let decrypted = decipher.update(value.content, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
};
