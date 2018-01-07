import { Component, OnInit } from '@angular/core';
import { Operation } from '../operation';
import * as moment from 'moment';
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
  newOperation: Operation = {};
  editedOperation: Operation = {};

  constructor(private operationService: OperationsService) { }

  ngOnInit() {
    this.getOperations();
  }

  getOperations() {
    this.operationService.getOperations(1, "s", "a")
      .subscribe(operations => this.operations = operations);
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
      this.newOperation = {};
    }
    this.operationForm = true;
    this.isNewForm = true;
  }

  saveOperation(operation: Operation) {
    if (this.isNewForm) {
      // add a new operation
      let lastId = Math.max(...this.operations.map(op => op.id));
      this.operationService.addOperation({id: ++lastId, ...operation});
      // this.operations.push(operation);
    }
    this.operationForm = false;
  }

  removeOperation(operation: Operation) {
    this.operationService.deleteOperation(operation);
  }

  updateOperation() {
    this.operationService.updateOperation(this.editedOperation);
    this.editOperationForm = false;
    this.editedOperation = {};
  }

  cancelNewOperation() {
    this.newOperation = {};
    this.operationForm = false;
  }

  cancelEdits() {
    this.editedOperation = {};
    this.editOperationForm = false;
  }

}
