import { Component, OnInit } from '@angular/core';
import { concat } from 'rxjs/operators/concat';
import * as moment from 'moment';
import { Operation } from '../operation';
import { OperationsService } from '../operations.service';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})

export class OperationsComponent implements OnInit {

  operations: Operation[];

  operationForm = false;
  editOperationForm = false;
  isNewForm: boolean;
  newOperation: Operation;
  editedOperation: Operation;

  constructor(private operationService: OperationsService) { }

  ngOnInit() {
    this.getOperations();
  }

  getOperations(last = 15) {
    // TODO: change parameters to fetch operations

    this.operationService.getOperations(last)
      .subscribe(operations => this.operations = operations);
  }

  getOperation(id: string) {
    let result: Operation;
    let operation = new Operation();
    operation.id = id;
    this.operationService.getOperation(operation)
      .subscribe(op => { result = op; console.log(op); });
    return result;
  }

  showEditOperationForm(operation: Operation) {
    if (!operation) {
      this.operationForm = false;
      return;
    }
    this.editOperationForm = true;
    this.editedOperation = { ...operation };
  }

  showAddOperationForm() {
    // resets form if edited operation
    if (this.operations.length) {
      this.newOperation = new Operation();
    }
    this.operationForm = true;
    this.isNewForm = true;
  }

  saveOperation(operation: Operation) {
    if (this.isNewForm) {
      // add a new operation
      let lastId = Math.max(...this.operations.map(op => +op.id));
      let newOperation = { id: ++lastId, ...operation };

      this.operationService.addOperation(newOperation)
        .subscribe(() => console.log("Dodano nowy wydatek"));

      this.operations.push(newOperation);

      console.log(this.operations);
    }
    this.operationForm = false;
  }

  deleteOperation(operation: Operation) {
    let self = this;
    this.operationService.deleteOperation(operation)
      .subscribe(() => this.operations = this.operations.filter(o => o !== operation));
  }

  updateOperation() {
    this.operationService.updateOperation(this.editedOperation)
      .subscribe(() => {
        this.editOperationForm = false;
        this.editedOperation = new Operation();
      });
  }

  cancelNewOperation() {
    this.newOperation = new Operation();
    this.operationForm = false;
  }

  cancelEdits() {
    this.editedOperation = new Operation();
    this.editOperationForm = false;
  }

}
