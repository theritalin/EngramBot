require("dotenv").config();
const { ethers } = require("ethers");
const contractABI = [
  {
    inputs: [],
    name: "set",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "get",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
];

const contractAddress = "0xaD91C679aaAf72b8805c172819C246d9C35CEF54";

const bekle = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function get() {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://tokioswift.engram.tech"
  );
  const mnemonic = process.env.MNEMONIC;

  //for sending from account 0
  let path = `m/44'/60'/0'/0/0`;
  let senderAccount = ethers.Wallet.fromMnemonic(mnemonic, path);
  let walletsigner = await senderAccount.connect(provider);
  const contract = new ethers.Contract(
    contractAddress,
    contractABI,
    walletsigner
  );

  console.log(`${senderAccount.address} is ready. Please wait`);
  await bekle(1000);

  while (true) {
    try {
      const transaction = await contract.set({
        from: walletsigner.account,
      });

      await transaction.wait();

      console.log(`Transaction completed: ${transaction}`);

      let storedData = await contract.get();
      console.log(`Stored Data: ${storedData}`);
    } catch (error) {
      console.log(`HATA: ${error}`);
    }

    await bekle(5000);
  }
}

get();
