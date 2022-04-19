import { Injectable } from '@angular/core';
import Web3 from "web3";

declare const window: any;


@Injectable({
  providedIn: 'root'
})
export class ContractService {
  window:any;
  public web3: any;

  api = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_greeting",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "greet",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_greeting",
          "type": "string"
        }
      ],
      "name": "setGreeting",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  constructor() { }
  private getAccounts = async () => {
    try {
      return await window.ethereum.request({ method: 'eth_accounts' });
    } catch (e) {
      return [];
    }
  }

  public sayGreeting = async (address: string) => {
    try {
      const contract = new window.web3.eth.Contract(
        this.api,
         "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
      );
      const token = await contract.methods.greet().call();
      console.log("greet",token)
      return token

    }
    catch (error) {
      const errorMessage = error.message;
      console.log(errorMessage)

    }
  }

  public  openMetamask = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      let addresses = await this.getAccounts();
      console.log("service", addresses)
      if (!addresses.length) {
        try {
          addresses = await window.ethereum.enable();
        } catch (e) {
          return false;
        }
      }
      return addresses.length ? addresses[0] : null;
    } else if (typeof window.web3 !== "undefined") {
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log("No web3? You should consider trying MetaMask!");

      // Hack to provide backwards compatibility for Truffle, which uses web3js 0.20.x
      Web3.providers.HttpProvider.prototype.sendAsync =
        Web3.providers.HttpProvider.prototype.send;
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(
        new Web3.providers.HttpProvider("http://localhost:8545")
      );
    }
  }

}
