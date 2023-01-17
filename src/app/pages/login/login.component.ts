import {Component, Input, OnInit} from '@angular/core';
import {FbService} from '../../services/fb/fb.service';
import {first, tap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage = '';
  @Input() email: string = '';
  @Input() password: string = '';
  constructor(public fb: FbService, public router: Router) {
  }

  ngOnInit() {
  }

  login() {
    this.fb.signin(this.email, this.password)
      .then(r => this.router.navigateByUrl(''))
      .catch(err => this.errorMessage = err);
    setTimeout(() => this.errorMessage = '', 2000)
  }

}
