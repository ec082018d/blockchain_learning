const {Blockchain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('f5b6e0342827cc1ed45b0f2e96a4b11f537528ea1ebef1ef000a78d38ca48041');
const myWalletAddress = myKey.getPublic('hex')

let emmaConstCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
emmaConstCoin.addTransaction(tx1);

console.log('\nStarting the miner...');
emmaConstCoin.minePendingTransactions('myWalletAddress');

console.log('\nBalance of Emmanuel address is: ', emmaConstCoin.getBalanceOfAddress('myWalletAddress'));


