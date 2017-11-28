import { Component, OnInit } from '@angular/core';
import { Operation } from '../operation';
import * as moment from 'moment';

const OPERATIONS: Operation[] = [
  { amount: 12.00, description: "zapieksy", timestamp: moment().format("HH:mm DD/MM/YYYY") },
  { amount: 100.12, description: "kosmetyki" },
  { amount: 15.99, description: "cukierki", timestamp: "czwartek 9:32" },
  { amount: 25.00, description: "pizza", timestamp: "piatek 1:30" },
];
@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})

export class OperationsComponent implements OnInit {

  // rows = [
  //   { name: 'Austin', gender: 'Male', company: 'Swimlane' },
  //   { name: 'Dany', gender: 'Male', company: 'KFC' },
  //   { name: 'Molly', gender: 'Female', company: 'Burger King' },
  // ];



  rows = OPERATIONS;


  columns = [
    { prop: 'id' },
    { prop: 'amount' },
    { name: 'Description' },
    { prop: 'timestamp', name: 'Date' }
  ];


  constructor() { }

  ngOnInit() {
    let i = 0;
    this.rows = OPERATIONS.map(el => {
      return { ...el, id: i++ };
    });
  }

}
