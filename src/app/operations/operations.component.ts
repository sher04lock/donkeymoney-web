import { Component, OnInit, ViewChild } from '@angular/core';
import { concat } from 'rxjs/operators/concat';
import * as moment from 'moment';
import { Operation } from '../operation';
import { OperationsService } from '../operations.service';
import { containsTree } from '@angular/router/src/url_tree';

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
  newOperation = new Operation();
  editedOperation = new Operation();
  isIncome = false;

  @ViewChild('fileInput') fileInput;

  constructor(private operationService: OperationsService) { }

  ngOnInit() {
    this.getOperations();
  }


   // ------------ CRUD ------------

  getOperations(last = 50) {
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

  saveOperation(operation: Operation) {
    let newOperation = { ...operation };

    newOperation.amount = Math.abs(newOperation.amount);
    if (!this.isIncome) {
      newOperation.amount *= -1;
    }

    newOperation.createdAt = moment().format("YYYY-MM-DD[T]HH:mm:ss[.000Z]");
    this.operations.unshift(newOperation);
    this.operationService.addOperation(newOperation)
      .subscribe(() => { });

    this.operationForm = false;
  }

  updateOperation() {
    let ids = this.operations.map(x => x.id);
    let index = ids.indexOf(this.editedOperation.id);

    this.operations[index] = { ...this.operations[index], ...this.editedOperation };

    this.operationService.updateOperation(this.editedOperation)
      .subscribe(() => {
        this.editOperationForm = false;
        this.editedOperation = new Operation();
      });
  }

  deleteOperation(operation: Operation) {
    let self = this;
    this.operations = this.operations.filter(o => o !== operation);
    this.operationService.deleteOperation(operation)
      .subscribe(() => console.log(`deleted op. id: ${operation.id}`));
  }

  /**
   * Uploads a csv file with expenses exporter from banks
   */
  upload() {
    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      let file = fileBrowser.files[0];
      let fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = (e: any) => {
        let contents: string = e.target.result;
        this.operationService.upload(contents).subscribe(() => console.log("uploaded"));
      };
    }
  }

  // ------------ component management ------------

  cancelNewOperation() {
    this.newOperation = new Operation();
    this.operationForm = false;
  }

  cancelEdits() {
    this.editedOperation = new Operation();
    this.editOperationForm = false;
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
    if (this.operations.length) {
      this.newOperation = new Operation();
    }
    this.operationForm = true;
    this.isNewForm = true;
  }

  /**
   * toggles operetion type: expense <-> income
   */
  toggleType() {
    this.isIncome = !this.isIncome;
    console.log(this.isIncome);
  }
}
