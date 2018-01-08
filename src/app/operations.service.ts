import { Injectable } from '@angular/core';
import { Operation } from './operation';
import * as moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { HttpHeaderResponse } from '@angular/common/http/src/response';
import { AuthenticationService } from './authentication.service';
import { retry } from 'rxjs/operators/retry';
import { httpFactory } from '@angular/http/src/http_module';
import { config } from './config';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  params: new HttpParams()
};

@Injectable()
export class OperationsService {
  private operations: Operation[];
  private url = config.API_URL + "/services/apexrest/operation";

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
    return this.httpClient.post(this.url, operation, httpOptions);

  }

  updateOperation(operation: Operation) {
    this.appendTokenToHeaders();
    return this.httpClient.put(this.url, operation, httpOptions);
  }

  deleteOperation(operation: Operation) {
    this.appendTokenToHeaders();
    return this.httpClient.delete<Operation>(`${this.url}/${operation.id}`, httpOptions);
  }

  getOperations(last: number) {
    httpOptions.params = new HttpParams()
      .set('last', last.toString());

    this.appendTokenToHeaders();

    return this.httpClient.get<Operation[]>(this.url, httpOptions);
  }

  getOperation(operation: Operation) {
    this.appendTokenToHeaders();
    return this.httpClient.get<Operation>(`${this.url}/${operation.id}`, httpOptions);
  }

  appendTokenToHeaders() {
    let token = this.authenticationService.getToken();
    httpOptions.headers = httpOptions.headers.append("Authorization", `Bearer ${token}`);
  }
}
