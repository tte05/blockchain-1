const crypto = require("crypto");
const Block = require("./Block");

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block("0", ["Genesis Transaction"]);
  }

  addBlock(transactions) {
    const previousBlock = this.chain[this.chain.length - 1];
    const newBlock = new Block(previousBlock.getHash(), transactions);
    this.chain.push(newBlock);
  }

  mineBlock(minerPublicKey) {
    const transactions = [`Reward for ${minerPublicKey}`];
    this.addBlock(transactions);
  }

  getChain() {
    return this.chain;
  }

  getMerkleRoot() {
    const transactions = this.chain.reduce(
      (acc, block) => acc.concat(block.getTransactions()),
      []
    );
    return calculateMerkleRoot(transactions);
  }
}

function calculateMerkleRoot(transactions) {
  if (transactions.length === 0) {
    return null;
  }

  let hashList = transactions.map((tx) => hashString(tx));
  while (hashList.length > 1) {
    const newHashList = [];

    for (let i = 0; i < hashList.length - 1; i += 2) {
      const concatenatedHashes = hashList[i] + hashList[i + 1];
      const newHash = hashString(concatenatedHashes);
      newHashList.push(newHash);
    }

    if (hashList.length % 2 === 1) {
      newHashList.push(hashList[hashList.length - 1]);
    }

    hashList = newHashList;
  }

  return hashList[0];
}

function hashString(input) {
  const hash = crypto.createHash("sha256").update(input).digest("hex");
  return hash;
}

module.exports = Blockchain;
