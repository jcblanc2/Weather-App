import {Component, OnDestroy, OnInit} from '@angular/core';
import {UiService} from './services/ui/ui.service';
import {FbService} from './services/fb/fb.service';
import {take} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Weather-App';
  showMenu = false;
  darkModeActive: any;

  userEmail = '';
  result = '';

  constructor(public ui: UiService, public fb: FbService, public router: Router) {
  }

  loggedIn = this.fb.isAuth();
  sub1:any;

  ngOnInit() {
    this.sub1 = this.ui.darkModeState.subscribe((value) => {
      this.darkModeActive = value;
    });

    this.fb.auth.user.subscribe((user:any) => {
      if (user !== null) {
        try {
          this.userEmail = user.email;
        }
        catch(e:any){
          this.result = e.Message;
        }
      }
    });

  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  modeToggleSwitch() {
    this.ui.darkModeState.next(!this.darkModeActive);
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
  }

  logout() {
    this.userEmail = '';
    this.toggleMenu();
    this.router.navigateByUrl('/login');
    this.fb.auth.signOut();
  }

}
