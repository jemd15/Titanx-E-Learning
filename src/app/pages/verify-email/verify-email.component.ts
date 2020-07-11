import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

  public verificationState: string = 'loading';
  public token: any = ':token';

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.params['token'];
    this.api.verifyEmail(this.token).toPromise()
      .then(() => {
        this.verificationState = 'ok';
      })
      .catch(err => {
        this.verificationState = 'refused';
      });
  }

}
