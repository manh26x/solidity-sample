import {Component, OnInit} from '@angular/core';
import {PrimeNGConfig} from "primeng/api";
import {ContractService} from "./contract.service";
import {address} from "hardhat/internal/core/config/config-validation";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  account: any ;

  constructor(
    private primengConfig: PrimeNGConfig,
    private contractService: ContractService
  ) {
    this.account = new Account();
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.openMetaMask();
  }
  openMetaMask(){
    console.log(this.account.name)
    this.contractService.openMetamask()
      .then(resp =>{
        debugger
        this.account.address = resp;

      if(!!this.account.name) {
        this.contractService.register(this.account).then(result => {
          this.account.name = result;
          this.getName();
        })
      }
        this.contractService.getName(this.account).then(r => console.log(r));

      })
  }

  getName() {
    this.contractService.getName(this.account).then(r => console.log(r));
  }

  saveName() {
    this.contractService.register(this.account).then(result => {
      console.log("registerd", result)
    })
  }
}

export class Account {
  address: string | undefined;
  name: string | undefined;
  balance: number | undefined;

  constructor() {
  }
}
