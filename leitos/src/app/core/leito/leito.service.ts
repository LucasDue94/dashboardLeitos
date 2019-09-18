import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../../environments/environment.prod";
import {Observable, Subject} from "rxjs";
import {Leito} from "./leito";

@Injectable()
export class LeitoService {

  private baseUrl = environment.serverUrl;

  constructor(private http: HttpClient) {
  }

  list(): Observable<Leito[]> {
    let subject = new Subject<Leito[]>();
    const headers = new HttpHeaders({"Content-Type": "application/json"});
    this.http.get(this.baseUrl + '/leitos.php', {headers: headers})
      .subscribe((json: Leito[]) => {
        subject.next(json.map((propertyName: any) => new Leito(propertyName)))
      }, error => {
        console.log(error)
      });
    return subject.asObservable();
  }
}
