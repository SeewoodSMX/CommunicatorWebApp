import crypto from 'crypto-js';

const { REACT_APP_SECRET_KEY } = process.env;

export const genInitVector = () => {
    return crypto.lib.WordArray.random(128 / 8).toString();
};

export const encrypt = (initVector, message) => {
    const key = crypto.enc.Hex.parse(REACT_APP_SECRET_KEY);
    const iv = crypto.enc.Hex.parse(initVector);
    const encryptedData = crypto.AES.encrypt(message, key, { iv: iv });
    return encryptedData;
};

export const decrypt = (initVector, encryptedData) => {
    const key = crypto.enc.Hex.parse(REACT_APP_SECRET_KEY);
    const iv = crypto.enc.Hex.parse(initVector);
    const decryptedData = crypto.AES.decrypt(encryptedData, key, { iv: iv });
    return decryptedData.toString(crypto.enc.Utf8);
};
