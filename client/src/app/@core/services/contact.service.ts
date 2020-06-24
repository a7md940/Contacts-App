import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { PagedList, Contact, ContactSearchRequest } from 'src/app/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private _url = environment.apiUrl;

  constructor(
    private _http: HttpClient
  ) { }

  getContactList(searchCriteria: ContactSearchRequest = new ContactSearchRequest()): Observable<PagedList<Contact>> {
    return this._http.post<PagedList<Contact>>(
      `${this._url}/contact/search`,
      searchCriteria
    )
  }

  createContact(contact: Contact): Observable<Contact> {
    return this._http.post<Contact>(
      `${this._url}/contact/create`,
      contact
    );
  }

  updateContact(contact: Contact): Observable<Contact> {
    return this._http.put<Contact>(
      `${this._url}/contact/update`,
      contact
    );
  }
}
