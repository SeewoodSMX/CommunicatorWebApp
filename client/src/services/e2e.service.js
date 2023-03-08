const CryptoJS = require('crypto-js');

const { REACT_APP_SECRET_KEY } = process.env;

export const genInitVector = () => {
    return CryptoJS.lib.WordArray.random(128 / 8).toString();
};

export const encrypt = (initVector, message) => {
    var key = CryptoJS.enc.Hex.parse(REACT_APP_SECRET_KEY);
    var iv = CryptoJS.enc.Hex.parse(initVector);
    var encryptedData = CryptoJS.AES.encrypt(message, key, { iv: iv });
    return encryptedData;
};

export const decrypt = (initVector, encryptedData) => {
    var key = CryptoJS.enc.Hex.parse(REACT_APP_SECRET_KEY);
    var iv = CryptoJS.enc.Hex.parse(initVector);
    var decryptedData = CryptoJS.AES.decrypt(encryptedData, key, { iv: iv });
    return decryptedData.toString(CryptoJS.enc.Utf8);
};
