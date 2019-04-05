const SHA256 = require("crypto-js/sha256");

class Block{
    constructor( timestamp, transactions, previousHash ='') {
        this.previousHash = previousHash; //string that contains the hash of the previous block
        this.timestamp = timestamp; //tells us when the block was created
        this.nonce = 0; //nonce is the only value inside our block that we can change to influence the hash of the block
        this.transactions = transactions;
        

        //When creating a new Block, automaticlly calculate it's hash
        this.hash = this.calculateHash();
    }

    //calculate the hash of the current block
    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    //method that will increment the nonce until we get a valid hash
    mineBlock(difficulty){
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("BLOCK MINED: " + this.hash);
    }


}

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}


class Blockchain{
    constructor(){
        this.chain = [];
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; //set difficulty value
        this.pendingTransactions = []; //Place to store transactions in between block creation
        this.miningReward = 100; //Reward amount a miner will get for their efforts

    }
    
    createTransaction(transaction){
        //there should be some validation here

        //push into the pendingTransaction array
        this.pendingTransactions.push(transaction);
    }

    minePendingTransactions(miningRewardAddress){
        // Create new block with all pending transactions and mine it..
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        // Add the newly mined block to the chain
        this.chain.push(block);

        // Reset the pending transactions and send the mining reward
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    // check the balances of the addresses on our blockchain
    getBalanceOfAddress(address){
        let balance = 0; //start at zero

        // Loop over each block and each transaction inside the block
        for(const block of this.chain){
            for(const trans of block.transactions){
                
                // If the given address is the sender -> reduce the balance
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                // If the given address is the receiver -> increase the balance
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    //method to create first block of the blockchain "GenesisBlock"
    createGenesisBlock() {
        return new Block(0,"01/01/2017", "Genesis block", "0");
    }

    //method returns the last element on the chain
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }
    
    //Verify the integrity of the blockchain
    isChainValid(){
        for (let i = 1; i < this.chain.length; i++){
        
          var currentBlock = this.chain[i];
          var previousBlock = this.chain[i - 1]; }

        // Recalculate the hash of the block and see if it matches up.
        // This allows us to detect changes to a single block
        if(currentBlock.hash !== currentBlock.calculateHash()){
            return false;
            
        }

         // Check if this block actually points to the previous block (hash
        if (currentBlock.previousHash !== previousBlock.hash) {
            return false;
        }

     
        // If we managed to get here, the chain is valid!
        return true;
    }

   
}


let emmaConstCoin = new Blockchain();

console.log('Creating some transactions...');
emmaConstCoin.createTransaction(new Transaction('address1', 'address2', 100));
emmaConstCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('Starting the miner...');
emmaConstCoin.minePendingTransactions('Emmanuel-address');


console.log('Balance of Emmanuel address is: ', emmaConstCoin.getBalanceOfAddress('Emmanuel-address'));

console.log('Starting the miner again!');
emmaConstCoin.minePendingTransactions("Emmanuel-address");

console.log('Balance of Emmanuel address is: ', emmaConstCoin.getBalanceOfAddress('Emmanuel-address')); // Output: 100
