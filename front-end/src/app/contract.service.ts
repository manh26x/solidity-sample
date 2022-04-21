import { Injectable } from '@angular/core';
import Web3 from "web3";
import  greeter from "../contracts/Greeter.json" ;
import accountMng from "../contracts/AccountMng.json";
declare const window: any;


@Injectable({
  providedIn: 'root'
})
export class ContractService {
  window:any;
  public web3: any;

  constructor() { }
  private getAccounts = async () => {
    try {
      return await window.ethereum.request({ method: 'eth_accounts' });
    } catch (e) {
      return [];
    }
  }


  public register = async (account: any) => {
    try {
      let addresses = await this.getAccounts();
      let contract = new window.web3.eth.Contract(
        accountMng.artifact.abi,
        accountMng.Token
      );
      await contract.methods.registerAccount(addresses[0], account.name).send({from: addresses[0]});

    }
    catch (error) {
      const errorMessage = error.message;
      console.log(errorMessage)

    }
  }

  public getName = async (account: any) => {
    try {
      let addresses = await this.getAccounts();
      let contract = new window.web3.eth.Contract(
        accountMng.artifact.abi,
        accountMng.Token
      );
      const name = await contract.methods.getName(addresses[0]).call();
      console.log("name",name)
      return name
    }
    catch (error) {
      const errorMessage = error.message;
      console.log(errorMessage)

    }
  }

  public saveName = async (name: string) => {
    try {
      let addresses = await this.getAccounts();
      let contract = new window.web3.eth.Contract(
        accountMng.artifact.abi,
        accountMng.Token
      );
      console.log("save " + name)
      return await contract.methods.setName(addresses[0], name).call();
    }
    catch (error) {
      const errorMessage = error.message;
      console.log(errorMessage)
    }
  }

  public sayGreeting = async (address: string) => {
    try {
      const contract = new window.web3.eth.Contract(
        greeter.artifact.abi,
        greeter.Token
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

  public setGreeting = async (name: string) => {
    try {
      const contract = new window.web3.eth.Contract(
        greeter.artifact.abi,
        greeter.Token
      );
      let addresses = await this.getAccounts();
      const token = await contract.methods.setGreeting('hello' + name).send({from:addresses[0]});
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
