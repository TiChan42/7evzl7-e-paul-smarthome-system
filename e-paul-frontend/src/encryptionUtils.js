import CryptoJS from 'crypto-js';

const SECRET_KEY = 'aB9tRfLs2pQ7gXhZ5cY3vU8wK1mJn6oI4eGdPx0yNzHqOjMlVbWuFkAxEiS';

export const encryptString = (plainText) => {
  const encrypted = CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString();
  return encrypted;
};

export const decryptString = (encryptedText) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY).toString(CryptoJS.enc.Utf8);
  return decrypted;
};