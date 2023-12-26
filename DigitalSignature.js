const crypto = require("crypto");

class DigitalSignature {
  static sign(data, privateKey) {
    const sign = crypto.createSign("RSA-SHA256");
    sign.update(data);
    const signature = sign.sign(privateKey, "hex");
    return signature;
  }

  static verify(data, signature, publicKey) {
    const verify = crypto.createVerify("RSA-SHA256");
    verify.update(data);
    const isVerified = verify.verify(publicKey, signature, "hex");
    return isVerified;
  }
}

module.exports = DigitalSignature;
