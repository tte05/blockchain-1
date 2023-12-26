const crypto = require("crypto");

class AsymmetricEncryption {
  static encrypt(data, publicKey) {
    const encryptedData = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING, // Use PKCS#1 padding
      },
      Buffer.from(data)
    );

    return encryptedData.toString("hex");
  }
}

module.exports = AsymmetricEncryption;
