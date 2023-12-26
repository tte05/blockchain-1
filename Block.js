const crypto = require("crypto");

class Block {
  constructor(previousHash, transactions) {
    this.timestamp = Date.now();
    this.previousHash = previousHash;
    this.transactions = [...transactions];
    this.hash = this.calculateHash();
    this.transactions.push("Mining Reward");
  }

  calculateHash() {
    const data =
      this.timestamp + this.previousHash + JSON.stringify(this.transactions);
    const hash = crypto
      .createHash("sha256")
      .update(data, "utf-8")
      .digest("hex");
    return hash;
  }

  getTimestamp() {
    return this.timestamp;
  }

  getPreviousHash() {
    return this.previousHash;
  }

  getTransactions() {
    return this.transactions;
  }

  getHash() {
    return this.hash;
  }
}

module.exports = Block;
