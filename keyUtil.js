const crypto = require("crypto");

class KeyUtil {
  static generateKeyPair() {
    try {
      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "der" },
        privateKeyEncoding: { type: "pkcs8", format: "der" },
      });

      return {
        publicKey: publicKey.toString("hex"),
        privateKey: privateKey.toString("hex"),
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  static getPairKeyFromHex(hexPublicKey, hexPrivateKey) {
    const publicKey = crypto.createPublicKey({
      key: Buffer.from(hexPublicKey, "hex"),
      format: "der",
      type: "spki",
    });

    const privateKey = crypto.createPrivateKey({
      key: Buffer.from(hexPrivateKey, "hex"),
      format: "der",
      type: "pkcs8",
    });

    return { publicKey, privateKey };
  }

  // Add other methods as needed
}

module.exports = KeyUtil;
