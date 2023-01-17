import {Component, Input, OnInit} from '@angular/core';
import {FbService} from '../../services/fb/fb.service';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  errorMessage:any;
  @Input() email: string = '';
  @Input() password: string = '';

  constructor(public fb: FbService, public router: Router) {
  }

  ngOnInit() {
  }

  signup() {
    this.fb.signup(this.email, this.password)
      .then(r => this.router.navigateByUrl('login'))
      .catch(err => this.errorMessage = err);
    setTimeout(() => this.errorMessage = '', 2000)
  }

}
