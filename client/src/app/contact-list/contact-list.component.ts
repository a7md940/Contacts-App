import { Component, OnInit } from '@angular/core';
import { ContactService } from '../@core/services/contact.service';
import { PagedList, Contact, ContactSearchRequest, PAGE_INDEX, PAGE_SIZE } from '../models';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
  contacts: PagedList<Contact>;
  loadingContacts: boolean;
  constructor(
    private _contactService: ContactService
  ) { }

  ngOnInit() {
    this._loadContacts();
  }

  private _loadContacts(): void {
    this.loadingContacts = true;
    this._contactService.getContactList()
    .subscribe(
      (pagedList) => {
        this.contacts = pagedList;
        this.loadingContacts = false;
      },
      (err) => {
        this.loadingContacts = false;
      }
    )
  }

  onSearch(searchCriteria: ContactSearchRequest) {
    searchCriteria.pageIndex = PAGE_INDEX;
    searchCriteria.pageSize = PAGE_SIZE;

    this.loadingContacts = true;
    this._contactService.getContactList(searchCriteria)
    .subscribe(
      (pagedList) => {
        this.contacts = pagedList;
        this.loadingContacts = false;
      },
      (exc) =>{
        this.loadingContacts = false;
      }
    )
  }

}
