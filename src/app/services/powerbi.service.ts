import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface EmbedTokenResponse {
  embedUrl: string;
  embedToken: string;
  reportId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PowerBiService {
  private apiUrl = 'http://localhost:8080/getEmbedToken';

  constructor(private http: HttpClient) { }

  getEmbedToken(): Observable<EmbedTokenResponse> {
    return this.http.get<EmbedTokenResponse>(this.apiUrl);
  }
} 