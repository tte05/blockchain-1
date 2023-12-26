const readline = require("readline");
const Blockchain = require("./blockchain");
const KeyUtil = require("./keyUtil");
const AsymmetricEncryption = require("./AsymmetricEncryption");
const DigitalSignature = require("./DigitalSignature");
const Block = require("./Block");
const crypto = require("crypto");

const blockchain = new Blockchain();
const scanner = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function generateKeys() {
  const senderKeyPair = KeyUtil.generateKeyPair();
  const senderGeneratedPublicKey = senderKeyPair.publicKey;
  const senderGeneratedPrivateKey = senderKeyPair.privateKey;

  const recipientKeyPair = KeyUtil.generateKeyPair();
  const recipientGeneratedPublicKey = recipientKeyPair.publicKey;
  const recipientGeneratedPrivateKey = recipientKeyPair.privateKey;

  console.log("Sender's generated Public Key: " + senderGeneratedPublicKey);
  console.log("Sender's generated Private Key: " + senderGeneratedPrivateKey);
  console.log(
    "Recipient's generated Public Key: " + recipientGeneratedPublicKey
  );
  console.log(
    "Recipient's generated Private Key: " + recipientGeneratedPrivateKey
  );
}

async function mineBlock() {
  console.log("Mining process. . .");

  const minerPublicKey = await prompt("Enter miner's public key: ");

  blockchain.mineBlock(minerPublicKey);

  console.log("Mining successful! Block added with reward for the miner!");
}

function viewMerkleRoot() {
  console.log("\nMerkle Root: " + blockchain.getMerkleRoot());
}

function viewBlockchain() {
  console.log("\nBlockchain: ");
  for (const block of blockchain.getChain()) {
    console.log("Hash: " + block.getHash());
    console.log("Previous Hash: " + block.getPreviousHash());
    console.log("Timestamp: " + block.getTimestamp());
    console.log("Transaction: " + block.getTransactions());
    console.log();
  }
}

async function addTransaction() {
  const senderPublicKeyHex = await prompt(
    "Enter sender's public key (in Hex format): "
  );

  const senderPrivateKeyHex = await prompt(
    "Enter sender's private key (in Hex format): "
  );

  const recipientPublicKeyHex = await prompt(
    "Enter recipient's public key (in Hex format): "
  );

  const recipientPrivateKeyHex = await prompt(
    "Enter recipient's private key (in Hex format): "
  );

  const senderKeyPair = KeyUtil.getPairKeyFromHex(
    senderPublicKeyHex,
    senderPrivateKeyHex
  );

  const recipientKeyPair = KeyUtil.getPairKeyFromHex(
    recipientPublicKeyHex,
    recipientPrivateKeyHex
  );

  const amount = await prompt("Enter amount: ");
  console.log("Transaction processing. . .");

  // Asymmetric Encryption Implementation
  const encryptedTransaction = AsymmetricEncryption.encrypt(
    amount,
    recipientKeyPair.publicKey
  );

  // Digital Signature Implementation
  const signature = DigitalSignature.sign(
    encryptedTransaction,
    senderKeyPair.privateKey
  );

  // Hash the original transaction string
  const transactionString =
    senderKeyPair.publicKey + recipientKeyPair.publicKey + amount;
  const hashedTransaction = hashString(transactionString);

  // for transmission purposes
  const encodedEncryptedTransaction =
    Buffer.from(encryptedTransaction).toString("hex");
  const encodedSignature = Buffer.from(signature).toString("hex");

  const transactions = [
    encodedEncryptedTransaction,
    encodedSignature,
    hashedTransaction,
  ];
  blockchain.addBlock(transactions);

  console.log("Transaction successful!");
}

function hashString(input) {
  const hash = crypto.createHash("sha256").update(input).digest("hex");
  return hash;
}

function prompt(question) {
  return new Promise((resolve) => {
    scanner.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  while (true) {
    console.log("\nBLOCKCHAIN APP MENU:");
    console.log("1. Add Transaction");
    console.log("2. View Blockchain");
    console.log("3. View Merkle Root");
    console.log("4. Mine Block");
    console.log("5. Generate Key Pairs");
    console.log("6. Exit");

    const choice = await prompt("Choose an option: ");

    switch (parseInt(choice)) {
      case 1:
        await addTransaction();
        break;
      case 2:
        viewBlockchain();
        break;
      case 3:
        viewMerkleRoot();
        break;
      case 4:
        await mineBlock();
        break;
      case 5:
        await generateKeys();
        break;
      case 6:
        console.log("Exiting. . . ");
        scanner.close();
        process.exit(0);
      default:
        console.log("Invalid option. Try again.");
    }
  }
}

main();
