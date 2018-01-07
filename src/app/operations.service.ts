import { Injectable } from '@angular/core';
import { Operation } from './operation';
import * as moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { HttpHeaderResponse } from '@angular/common/http/src/response';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  params: new HttpParams()
};

@Injectable()
export class OperationsService {
  private operations: Operation[];
  private BASE_URL = "https://donkeymoney-dev-ed.my.salesforce.com/services/apexrest/";
  private OPERATION_URL = this.BASE_URL + "operation";

  constructor(private httpClient: HttpClient) { }

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

  getOperations(last: number, olderThan: string, newerThan: string) {
    httpOptions.params = new HttpParams()
      .set('last', last.toString())
      .set('olderThan', olderThan)
      .set('newerThan', newerThan);

    httpOptions.headers = httpOptions.headers.append("Authorization", "Bearer fake-token");

    return this.httpClient.get<Operation[]>(this.OPERATION_URL, httpOptions);
  }
}
