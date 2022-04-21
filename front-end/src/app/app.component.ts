import {Component, OnInit} from '@angular/core';
import {PrimeNGConfig} from "primeng/api";
import {ContractService} from "./contract.service";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  account: any ;
  isEditName = false;
  isEditBirthday = false;
  isEditDescription = false;
  transaction: any = [];
  isShowTransaction = false;

  constructor(
    private primengConfig: PrimeNGConfig,
    private contractService: ContractService
  ) {
    this.account = new Account();
    this.contractService.checkAccountExist().then(result => {
      if(result === true) {
        this.getName();
      } else {
        this.account.address = undefined;
      }
    }, err=> {
      console.log(err);
      this.account.address = undefined;
    })
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.getName();
  }
  openMetaMask(){
    console.log(this.account.name)
    this.contractService.openMetamask()
      .then(resp =>{
        this.account.address = resp;
        this.contractService.register(this.account).then(result => {
          this.account.name = result;
          this.getName();
        })

      })
  }

  getName() {
    this.contractService.getName(this.account).then(r => {
      this.account.name = r;
      this.contractService.getBalance().then(b => this.account.balance = b);
      this.getDescription();

      this.getBirthdate();
      this.getTransaction();
    }, err => {
      console.log(err);
      this.account.address = null;
      this.account.name = '';
    });
  }

  getTransaction() {
    console.log("transaction")
    this.contractService.getAllTransaction();
  }

  saveName() {
    this.contractService.register(this.account).then(result => {
      console.log("registerd", result)
    })
  }

  getAllTransaction() {
     this.contractService.getAllTransaction().then(result => {
       this.transaction = result;
       console.log( this.transaction);

     });
  }

  setName() {
    this.contractService.saveName(this.account.name).then(() => {
      this.isEditName = !this.isEditName;
      this.getName();
    }).catch(err => console.log(err))
  }

  setBirthdate() {
    this.contractService.saveBirthdate(this.account.birthdate).then(() => {
      this.isEditBirthday = !this.isEditBirthday;
      this.getBirthdate();
    }).catch(err => console.log(err))
  }
  getBirthdate() {
    this.contractService.getBirthdate().then(r => {
      this.account.birthdate = r;
    });
  }

  setDescription() {
    this.contractService.setDescription(this.account.description).then(() => {
      this.isEditDescription = !this.isEditDescription;
      this.getDescription();
    })
  }

  getDescription() {
    this.contractService.getDescription().then(description => {
      this.account.description = description;
    })
  }
}

export class Account {
  address: string | undefined;
  name: string | undefined;
  balance: number | undefined;
  description: string | undefined;
  birthdate: Date | undefined;
  constructor() {
  }
}
