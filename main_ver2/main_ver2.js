const SHA256 = require("crypto-js/sha256");

class Block{
    constructor(index, timestamp, data, previousHash ='') {
        this.index = index;
        this.previousHash = previousHash; //string that contains the hash of the previous block
        this.timestamp = timestamp; //tells us when the block was created
        this.data = data; //can include any type of data that you want to associate with this block
        this.nonce = 0; //nonce is the only value inside our block that we can change to influence the hash of the block

        //When creating a new Block, automaticlly calculate it's hash
        this.hash = this.calculateHash();
    }

    //calculate the hash of the current block
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
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


class Blockchain{
    constructor(){
        this.chain = [];
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; //set difficulty value
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
        //newBlock.hash = newBlock.calculateHash();
        //method so that it actually mines the block before adding it to our chain
        newBlock.mineBlock(this.difficulty);

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

console.log('Mining block 1');
emmaConstCoin.addBlock(new Block(1, "20/07/2017", { amount: 4 }));

console.log('Mining block 2');
emmaConstCoin.addBlock(new Block(2, "20/07/2017", { amount: 8 }));
