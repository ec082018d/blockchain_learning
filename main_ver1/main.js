const SHA256 = require("crypto-js/sha256");

class Block{
    constructor(index, timestamp, data, previousHash ='') {
        this.index = index;
        this.previousHash = previousHash; //string that contains the hash of the previous block
        this.timestamp = timestamp; //tells us when the block was created
        this.data = data; //can include any type of data that you want to associate with this block
        

        //When creating a new Block, automaticlly calculate it's hash
        this.hash = this.calculateHash();
    }

    //calculate the hash of the current block
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }


}


class Blockchain{
    constructor(){
        this.chain = [];
        this.chain = [this.createGenesisBlock()];
    }
    
    //method to create firast block of the blockchain "GenesisBlock"
    createGenesisBlock() {
        return new Block(0,"01/01/2017", "Genesis block", "0");
    }

    //method returns the last element on the chain
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }
    
    //add blocks to chain
    addBlock(newBlock){
        // The new block needs to point to the hash of the latest block on the chain.
        newBlock.previousHash = this.getLatestBlock().hash;

        // Calculate the hash of the new block
        newBlock.hash = newBlock.calculateHash();

         // Now the block is ready and can be added to chain!
        this.chain.push(newBlock);
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

        //Check the genesis block
        //if(this.chain[0] !== this.createGenesisBlock()){
         //  return false;
       // }

        // If we managed to get here, the chain is valid!
        return true;
    }

   
}


let emmaConstCoin = new Blockchain();
emmaConstCoin.addBlock(new Block(1,"01/04/2018", { amount: 14}));
emmaConstCoin.addBlock(new Block(2,"03/05/2018", { amount: 210}));
emmaConstCoin.addBlock(new Block(3,"07/15/2018", { amount: 205}));
emmaConstCoin.addBlock(new Block(4,"03/04/2019", { amount: 4}));
emmaConstCoin.addBlock(new Block(5,"03/05/2019", { amount: 10}));
emmaConstCoin.addBlock(new Block(6,"03/15/2019", { amount: 25}));
emmaConstCoin.addBlock(new Block(7,"05/04/2019", { amount: 41}));
emmaConstCoin.addBlock(new Block(8,"06/05/2019", { amount: 101}));
emmaConstCoin.addBlock(new Block(9,"08/15/2019", { amount: 2500}));

console.log('Current Block: ' + emmaConstCoin.getLatestBlock);

console.log(JSON.stringify(emmaConstCoin, null, 4));

console.log('Current Block: ' + emmaConstCoin.getLatestBlock().hash);
console.log('Blockchain valid? ' + emmaConstCoin.isChainValid());
