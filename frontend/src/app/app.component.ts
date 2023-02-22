import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  username: string | undefined;
  password: string | undefined;
  title: string = "App";

  constructor(private http: HttpClient) {}

  login() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { username: this.username, password: this.password };
    this.http.post('http://localhost:3001/login', body, { headers }).subscribe(
      (data) => alert((data as any).message),
      (error) => console.error(error)
    );
  }
}
