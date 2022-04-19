import {Component, OnInit} from '@angular/core';
import {PrimeNGConfig} from "primeng/api";
import {ContractService} from "./contract.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


  constructor(
    private primengConfig: PrimeNGConfig,
    private contractService: ContractService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
  }
  openMetaMask(){
    this.contractService.openMetamask()
      .then(resp =>{
      if(resp) {
        this.contractService.sayGreeting(resp).then(result => console.log(result))
      }
    })
  }
}
