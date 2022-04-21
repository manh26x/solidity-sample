import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ContractService} from "./contract.service";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {AvatarModule} from "primeng/avatar";
import {ChipModule} from "primeng/chip";
import {CalendarModule} from "primeng/calendar";
import {TableModule} from "primeng/table";
import {CardModule} from "primeng/card";
import {DialogModule} from "primeng/dialog";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    FormsModule,
    AvatarModule,
    ChipModule,
    CalendarModule,
    TableModule,
    CardModule,
    DialogModule,
  ],
  providers: [ContractService],
  bootstrap: [AppComponent]
})
export class AppModule { }
