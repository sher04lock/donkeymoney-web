import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/materialize';
import 'rxjs/add/operator/dematerialize';
import { Operation } from './operation';
import * as moment from 'moment';
import { MOCK_DATA } from './mock-data';


@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    OPERATIONS: Operation[] = MOCK_DATA;

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // array in local storage for registered users
        let users: any[] = JSON.parse(localStorage.getItem('users')) || [];

        // wrap in delayed observable to simulate server api call
        return Observable.of(null).mergeMap(() => {

            // if (request.url.endsWith("securityToken")) {
            //     return Observable.of(new HttpResponse({ status: 200, body: "securityTokeeen" }));
            // }

            // // authenticate
            // if (request.url.indexOf("salesforce") > -1 && request.method === 'POST') {
            //     let body = {
            //         // "access_token": "00D0O000000sgma!AQ0AQOloApq59V4vMPJT0D4na9NhWapETLlHJAn2oYgRGnaY._a1YwsweK7hmD4sVoeoGJK_Hw06Jhxli7Gu1NhH9v9ShZl8",
            //         "access_token": "fake-token",
            //         "instance_url": "https://donkeymoney-dev-ed.my.salesforce.com",
            //         "id": "https://login.salesforce.com/id/00D0O000000sgmaUAA/0050O000007CeH4QAK",
            //         "token_type": "Bearer",
            //         "issued_at": "1515233300345",
            //         "signature": "o/0kTYISuOMDZiHMoq02n76ybBLJnfFECe8yKlCs0Zo="
            //     };
            //     console.log("returning token");
            //     return Observable.of(new HttpResponse({ status: 200, body: body }));
            // }

            // get operations
            // if (request.url.endsWith("/operation") && request.method === 'GET') {
            //     if (request.headers.get('Authorization').startsWith("Bearer ")) {
            //         console.log(request.params.get("last"));
            //         console.log(request.params.get("newerThan"));
            //         console.log(request.params.get("olderThan"));
            //         return Observable.of(new HttpResponse({ status: 200, body: this.OPERATIONS }));
            //     } else {
            //         // return 401 not authorised if token is null or invalid
            //         return Observable.throw('Unauthorised');
            //     }
            // }

            // get operation by id
            if (request.url.match(/operation\/\d+$/) && request.method === 'GET') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization').startsWith("Bearer ")) {
                    // find user by id in users array
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    let matchedOperations = this.OPERATIONS.filter(op => +op.id === id);
                    let operation = matchedOperations.length ? matchedOperations[0] : null;

                    return Observable.of(new HttpResponse({ status: 200, body: operation }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return Observable.throw('Unauthorised');
                }
            }

            // delete operation by id
            if (request.url.match(/operation\/\d+$/) && request.method === 'DELETE') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization').startsWith("Bearer ")) {
                    // find user by id in users array
                    let urlParts = request.url.split('/');
                    let id = urlParts[urlParts.length - 1];
                    const index = this.OPERATIONS.map(x => x.id).indexOf(id);
                    if (index !== -1) {
                        this.OPERATIONS.splice(index, 1);
                    }
                    return Observable.of(new HttpResponse({ status: 200, body: this.OPERATIONS }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return Observable.throw('Unauthorised');
                }
            }

            // TODO: fix deleting
            // delete operation
            if (request.url.endsWith("/operation") && request.method === 'DELETE') {
                if (request.headers.get('Authorization').startsWith("Bearer ")) {
                    let id = request.params.get("id");
                    const index = this.OPERATIONS.map(x => x.id).indexOf(id);
                    if (index !== -1) {
                        this.OPERATIONS.splice(index, 1);
                    }
                    return Observable.of(new HttpResponse({ status: 200, body: this.OPERATIONS }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return Observable.throw('Unauthorised');
                }
            }


            // post operation
            if (request.url.endsWith("/operation") && request.method === 'POST') {
                if (request.headers.get('Authorization').startsWith("Bearer ")) {
                    console.log(request.body);
                    this.OPERATIONS.push(request.body);
                    return Observable.of(new HttpResponse({ status: 200, body: this.OPERATIONS }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return Observable.throw('Unauthorised');
                }
            }

            // put (update) operation
            if (request.url.endsWith("/operation") && request.method === 'PUT') {
                if (request.headers.get('Authorization').startsWith("Bearer ")) {
                    let operation = request.body;
                    const index = this.OPERATIONS.map(x => x.id).indexOf(operation.id);
                    this.OPERATIONS[index] = operation;
                    return Observable.of(new HttpResponse({ status: 200, body: this.OPERATIONS }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return Observable.throw('Unauthorised');
                }
            }





            // pass through any requests not handled above
            return next.handle(request);

        })
            // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .materialize()
            .delay(500)
            .dematerialize();
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
