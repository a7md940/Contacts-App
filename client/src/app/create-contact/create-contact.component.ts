import { Component, OnInit } from '@angular/core';
import { Contact } from '../models';
import { FormGroup, AbstractControl, Validators, FormControl } from '@angular/forms';
import { ContactService } from '../@core/services/contact.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.scss']
})
export class CreateContactComponent implements OnInit {
  contact = new Contact();
  form: FormGroup;

  constructor(
    private _contactService: ContactService,
    private _router: Router
  ) {
    this._buildForm();
  }

  ngOnInit() {
  }
  private _buildForm() {
    const controls: { [key in keyof Contact]?: AbstractControl } = {
      name: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required]),
      address: new FormControl(null),
      notes: new FormControl(null),
    };
    this.form = new FormGroup(controls);
  }

  reset() {
    this.form.reset();
  }

  submit() {
    if (this.form.invalid) {
      for (const key in this.form.controls) {
        const control = this.form.controls[key];
        control.markAsDirty();
        control.markAsTouched();
      }
      return;
    }
    this.contact = this.form.value as Contact;
    this._contactService.createContact(this.contact)
    .subscribe(
      (result) => {
        this._router.navigate(['']);
      },
      (exc) => {

      }
    )
  }
}
