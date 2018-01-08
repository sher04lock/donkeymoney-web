import { Injectable } from '@angular/core';
import { Operation } from './operation';
import * as moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { HttpHeaderResponse } from '@angular/common/http/src/response';
import { AuthenticationService } from './authentication.service';
import { retry } from 'rxjs/operators/retry';
import { httpFactory } from '@angular/http/src/http_module';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  params: new HttpParams()
};

@Injectable()
export class OperationsService {
  private operations: Operation[];
  private BASE_URL = "https://donkeymoney-dev-ed.my.salesforce.com/services/apexrest/";
  private OPERATION_URL = this.BASE_URL + "operation";

  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  getOperationsFromData(): Operation[] {
    console.log(this.operations);
    return this.operations;
  }

  addOperation(operation: Operation) {

    this.appendTokenToHeaders();
    return this.httpClient.post(this.OPERATION_URL, operation, httpOptions);

  }

  updateOperation(operation: Operation) {
    this.appendTokenToHeaders();
    return this.httpClient.put(this.OPERATION_URL, operation, httpOptions);
  }

  deleteOperation(operation: Operation) {
    this.appendTokenToHeaders();
    return this.httpClient.delete<Operation>(`${this.OPERATION_URL}/${operation.id}`, httpOptions);
  }

  getOperations(last: number, olderThan: string, newerThan: string) {
    httpOptions.params = new HttpParams()
      .set('last', last.toString())
      .set('olderThan', olderThan)
      .set('newerThan', newerThan);

    this.appendTokenToHeaders();

    return this.httpClient.get<Operation[]>(this.OPERATION_URL, httpOptions);
  }

  getOperation(operation: Operation) {
    this.appendTokenToHeaders();
    return this.httpClient.get<Operation>(`${this.OPERATION_URL}/${operation.id}`, httpOptions);
  }

  appendTokenToHeaders() {
    let token = this.authenticationService.getToken();
    httpOptions.headers = httpOptions.headers.append("Authorization", `Bearer ${token}`);
  }
}
