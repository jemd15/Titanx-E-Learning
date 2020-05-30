import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from "@angular/router";
import { toast } from 'angular2-materialize';

@Component({
  selector: 'app-restore-pass',
  templateUrl: './restore-pass.component.html',
  styleUrls: ['./restore-pass.component.css']
})
export class RestorePassComponent implements OnInit {
  restorePassForm: FormGroup;

  constructor(
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public router: Router, // para enviar al usuario a otra vista
    public formBuilder: FormBuilder,
  ) {

  }

  ngOnInit() {
    this.restorePassForm = this.createRestorePassForm();
  }

  private createRestorePassForm() {
    return this.formBuilder.group({
      password: ['', Validators.required],
      passwordCheck: ['', Validators.required]
    })
  }

}
