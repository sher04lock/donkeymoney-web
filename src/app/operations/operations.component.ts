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

  @ViewChild('fileInput') fileInput;

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

  saveOperation(operation: Operation) {

    // add a new operation
    let newOperation = { ...operation };
    this.operations.unshift(newOperation);
    this.operationService.addOperation(newOperation)
      .subscribe(() => {
        console.log("Dodano nowy wydatek");
        // this.operations.unshift(newOperation);
      });


    console.log(this.operations);

    this.operationForm = false;
  }

  updateOperation() {
    this.operationService.updateOperation(this.editedOperation)
      .subscribe(() => {
        this.editOperationForm = false;
        this.editedOperation = new Operation();
      });
  }

  deleteOperation(operation: Operation) {
    let self = this;
    this.operationService.deleteOperation(operation)
      .subscribe(() => this.operations = this.operations.filter(o => o !== operation));
  }

  // ------------ file uploading ------------
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
      // let formData = new FormData();
      // formData.append("file", fileBrowser.files[0], "filename");


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
    // resets form if edited operation
    if (this.operations.length) {
      this.newOperation = new Operation();
    }
    this.operationForm = true;
    this.isNewForm = true;
  }

}
