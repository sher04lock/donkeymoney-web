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
import { Tag } from './tag';

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

    return this.addTag(operation.tag.name).flatMap(tag => {
      let body = {
        amount: +operation.amount,
        name: operation.name,
        tag: {
          name: tag.name,
          id: tag.id
        }
      };
      return this.httpClient.post(this.url, { ...body }, { ...httpOptions, responseType: 'text' });
    });
  }

  upload(content: string, bankName = "Millenium") {
    const url = this.url + "/export";

    this.appendTokenToHeaders();
    let headers = httpOptions.headers
      .set("Content-Type", "text/csv")
      .set("Accept", "application/json")
      .set("Bank-Name", bankName);

    console.log(content);
    return this.httpClient.post(url, content, { headers });
  }

  updateOperation(operation: Operation) {
    this.appendTokenToHeaders();
    let body = {
      id: operation.id,
      amount: +operation.amount,
      name: operation.name,
      createdAt: operation.createdAt
    };
    return this.httpClient.put(this.url, body, { ...httpOptions, responseType: 'text' });
  }

  deleteOperation(operation: Operation) {
    this.appendTokenToHeaders();
    return this.httpClient.delete(`${this.url}/${operation.id}`, { ...httpOptions, responseType: 'text' });
  }

  getOperations(last: number) {
    let params = new HttpParams()
      .set('last', last.toString());

    this.appendTokenToHeaders();

    return this.httpClient.get<Operation[]>(this.url, { headers: httpOptions.headers, params: params });
  }

  getOperation(operation: Operation) {
    this.appendTokenToHeaders();
    return this.httpClient.get<Operation>(`${this.url}/${operation.id}`, httpOptions);
  }

  getTags() {
    let url = config.API_URL + "/services/apexrest/tag";
    this.appendTokenToHeaders();
    return this.httpClient.get<Tag[]>(url, httpOptions);
  }

  addTag(name: string) {
    let url = config.API_URL + "/services/apexrest/tag";
    let body = {
      name: name
    };
    this.appendTokenToHeaders();
    return this.httpClient.post<Tag>(url, body, httpOptions);

  }
  appendTokenToHeaders() {
    let token = this.authenticationService.getToken();
    httpOptions.headers = httpOptions.headers.set("Authorization", `Bearer ${token}`);
  }
}
