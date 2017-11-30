import { Injectable } from '@angular/core';
import { Operation } from './operation';
import * as moment from 'moment';

const OPERATIONS: Operation[] = [
  { id: 1, amount: 12.00, description: "zapieksy", date: moment().format("HH:mm DD/MM/YYYY") },
  { id: 2, amount: 100.12, description: "kosmetyki" },
  { id: 3, amount: 15.99, description: "cukierki", date: "czwartek 9:32" },
  { id: 4, amount: 25.00, description: "pizza", date: "piatek 1:30" },
];

@Injectable()
export class OperationsService {
  private operations = OPERATIONS;

  constructor() { }

  getOperationsFromData(): Operation[] {
    console.log(this.operations);
    return this.operations;
  }

  addOperation(operation: Operation) {
    operation.id = +operation.id;
    this.operations.push(operation);
    console.log(this.operations);
  }

  updateOperation(operation: Operation) {
    const index = this.operations.map(x => x.id).indexOf(operation.id);
    this.operations[index] = operation;
  }

  deleteOperation(operation: Operation) {
    this.operations.splice(this.operations.indexOf(operation), 1);
    console.log(this.operations);
  }
}
