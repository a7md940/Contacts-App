import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { ContactSearchRequest, ExactSearch } from '../models';

@Component({
  selector: 'app-contact-search-form',
  templateUrl: './contact-search-form.component.html',
  styleUrls: ['./contact-search-form.component.scss']
})
export class ContactSearchFormComponent implements OnInit {
  form: FormGroup;
  @Output()
  onFormSubmit = new EventEmitter<ContactSearchRequest>();

  constructor() {
    this._buildForm();
  }

  ngOnInit() {
  }

  private _buildForm() {
    const controls = {
      name: new FormControl(null),
      phone: new FormControl(null),
      address: new FormControl(null),
      notes: new FormControl()
    }
    this.form = new FormGroup(controls)
  }

  search() {
    const { name, phone, address, notes } = this.form.value;
    const searchCriteria = new ContactSearchRequest();
    searchCriteria.name = name && new ExactSearch(name.trim(), false);
    searchCriteria.phone = phone && new ExactSearch(phone.trim(), false);
    searchCriteria.address = address && address.trim();
    searchCriteria.notes = notes && notes.trim();

    this.onFormSubmit.emit(searchCriteria);
  }

  reset() {
    this.form.reset();
  }
}
