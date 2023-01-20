import {Component, OnDestroy, OnInit} from '@angular/core';
import {FbService} from '../../services/fb/fb.service';
import {City} from "../../models/city";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  cities: Array<any> = [];
  userUid: string = '';
  result = '';

  constructor(public fb: FbService) {
  }

  ngOnInit() {
    this.fb.auth.user.subscribe((user:any) => {
      if (user !== null) {
        try {
          this.userUid = user.uid;
        }
        catch(e:any){
          this.result = e.Message;
        }
      }
    });

    this.fb.getCities().subscribe(res => {
      res.map((e: any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        this.cities = [];
        return data;
      }).forEach((city: City) => {
        if (this.userUid != null && city.createdBy == this.userUid && !this.cities.includes(city.id)){
          this.cities.push(city)
        }
      })
    }, err => {
      alert('Error while fetching student data');
    })
  }

  ngOnDestroy() {
    this.userUid = '';
    this.cities.splice(0);
    this.cities = [];
  }

}
