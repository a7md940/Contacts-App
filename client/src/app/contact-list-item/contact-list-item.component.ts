import { Component, OnInit, Input, Inject } from '@angular/core';
import { Contact } from '../models';
import { FormGroup, AbstractControl, FormControl, Validators } from '@angular/forms';
import { ContactService } from '../@core/services/contact.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-contact-list-item',
  templateUrl: './contact-list-item.component.html',
  styleUrls: ['./contact-list-item.component.scss']
})
export class ContactListItemComponent implements OnInit {

  contact: Contact;
  @Input('contact')
  set setContact(contact: Contact) {
    if (contact) {
      this.contact = contact;
      this._buildForm(this.contact);
    }
  };

  form: FormGroup;
  editNotes = false;
  edit = false;
  updating = false;
  updatingError: string;

  constructor(
    private _contactService: ContactService,
    @Inject(DOCUMENT)
    private _document: Document
  ) { }

  ngOnInit() {
  }

  private _buildForm(contact: Contact): void {
    const controls: { [key in keyof Contact]?: AbstractControl } = {
      name: new FormControl(contact.name || null, [Validators.required] ),
      phone: new FormControl(contact.phone || null, [Validators.required] ),
      address: new FormControl(contact.address || null),
      notes: new FormControl(contact.notes || null ),
    };
    this.form = new FormGroup(controls);
  }

  toggleEditNote() {
    this.editNotes = false
  } 

  updateContact() {
    if (this.form.invalid) {
      for (const key in this.form.controls) {
        const control = this.form.controls[key];
        control.markAsTouched();
        control.markAsDirty();
      }
      return;
    }
    const updateContactRequest: Contact = Object.assign(new Contact(), this.form.value, { id: this.contact.id });
    this.updating = true;
    this._contactService.updateContact(updateContactRequest)
    .subscribe(
      (res) => {
        this.updating = false;
        this.edit = false;
        this.setContact = res;
        
        (this._document.activeElement as (HTMLInputElement | HTMLTextAreaElement))
        .blur();

      },
      (exc) => {
        this.updating = false;
        this.updatingError = exc.type;
      }
    )
  }

}
