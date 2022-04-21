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

  constructor() {
  }
  private getAccounts = async () => {
    try {
      return await window.ethereum.request({ method: 'eth_accounts' });
    } catch (e) {
      return [];
    }
  }

  public checkAccountExist = async () => {
    const address = await this.openMetamask();
    if(address === false) {
      return false;
    } else {
      let contract = new window.web3.eth.Contract(
        accountMng.artifact.abi,
        accountMng.Token
      );
      return contract.methods.checkAccountExist().call();
    }
  }

  public getAllTransaction = async () => {
    const web3 =  window.web3;
    let addresses = await this.getAccounts();
    var currentBlock  = await web3.eth.getBlockNumber((error: any, result: any) =>{
      if (!error)
        console.log("block number => " +result)
    });
    let n = await web3.eth.getTransactionCount(addresses[0], currentBlock);
    var bal : number = + await web3.eth.getBalance(addresses[0]);
    let result: any[] = [];
    for (var i=currentBlock; i >= 0 && (n > 0 || bal > 0); --i) {
      try {
        var block = await web3.eth.getBlock(i, true);
        if (block && block.transactions) {
          block.transactions.forEach((e:any) => {

            if (e.from && addresses[0].toString().toLowerCase() == e.from.toString().toLowerCase()) {
              let value: number = +e.value;
              let gasPrice: number = +e.gasPrice
                bal += value + gasPrice;

              result.push({
                type: '-',
                from: 'You',
                to: e.to,
                value: web3.utils.fromWei(e.value, "ether"),
                gasPrice: web3.utils.fromWei(e.gasPrice, "ether"),
                bal : web3.utils.fromWei(bal.toLocaleString('fullwide', {useGrouping:false}), "ether")
              })
              --n;
            }
            if (e.to && addresses[0].toString().toLowerCase() == e.to.toString().toLowerCase()) {
              let value: number = +e.value;
                bal -= value;
              result.push({
                type: '+',
                from: e.from,
                to: 'You',
                value: web3.utils.fromWei(e.value, "ether"),
                gasPrice: web3.utils.fromWei(e.gasPrice, "ether"),
                bal : web3.utils.fromWei(bal.toLocaleString('fullwide', {useGrouping:false}), "ether")
              })

            }
          });
        }
      } catch (e) { console.error("Error in block " + i, e); }
    }
    return result;

  }

  public register = async (account: any) => {
      debugger
      let addresses = await this.getAccounts();
      let contract = new window.web3.eth.Contract(
        accountMng.artifact.abi,
        accountMng.Token
      );
      return await contract.methods.registerAccount(addresses[0], account.name).send({from: addresses[0]});


  }

  public getBalance = async () => {
    const web3 =  window.web3;
    const addresses = await this.getAccounts();
    return web3.utils.fromWei(await web3.eth.getBalance(addresses[0]), "ether");
  }

  public getName = async (account: any) => {
      let addresses = await this.getAccounts();
      let contract = new window.web3.eth.Contract(
        accountMng.artifact.abi,
        accountMng.Token
      );
      account.address=addresses[0];
      const name = await contract.methods.getName(addresses[0]).call();
      console.log("name",name)
      return name
  }

  public getBirthdate = async () => {
      let addresses = await this.getAccounts();
      let contract = new window.web3.eth.Contract(
        accountMng.artifact.abi,
        accountMng.Token
      );
      const date = await contract.methods.getBirthdate().call({from: addresses[0]});

      return new Date(date*1000)

  }

  public getDescription = async () => {
    let addresses = await this.getAccounts();
      let contract = new window.web3.eth.Contract(
        accountMng.artifact.abi,
        accountMng.Token
      );
      return await contract.methods.getDescription().call({from:addresses[0]});

  }

  public setDescription = async (description: string) => {
    let addresses = await this.getAccounts();
    let contract = new window.web3.eth.Contract(
      accountMng.artifact.abi,
      accountMng.Token
    );
    return await contract.methods.setDescription(description).send({from: addresses[0]});

  }

  public saveName = async (name: string) => {
      let addresses = await this.getAccounts();
      let contract = new window.web3.eth.Contract(
        accountMng.artifact.abi,
        accountMng.Token
      );
      console.log("save " + name)
      return await contract.methods.setName(addresses[0], name).send({from: addresses[0]});
  }

  public saveBirthdate = async (birthday: Date) => {
    try {
      let addresses = await this.getAccounts();
      let contract = new window.web3.eth.Contract(
        accountMng.artifact.abi,
        accountMng.Token
      );
      const birthdayTime = birthday.getTime()/1000;
      return await contract.methods.setBirthdate(birthdayTime).send({from: addresses[0]});
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
