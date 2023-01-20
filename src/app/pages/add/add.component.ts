import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {WeatherService} from '../../services/weather/weather.service';
import {FbService} from '../../services/fb/fb.service';
import {first} from 'rxjs/operators';
import {Country} from "../../models/country";
import {City} from "../../models/city";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit, OnDestroy {

  date = new Date();
  temp: any;
  city : string = 'rome';
  state: any;
  capitals: Array<any> = [];
  selectedCity:any;
  cardCity:any;
  showNote = false;
  followedCM = false;
  sub1:any;
  citySelected : any;
  cityObj: City = {
    id: '',
    name: '',
    createdBy: '',
  };
  userUid: string = '';
  days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


  constructor(public http: HttpClient, public weather: WeatherService, public fb: FbService) {
  }

  ngOnInit() {
    // getting the city placeID
    this.weather.getWeather(this.city).subscribe((payload: any) => {
      this.state = payload.weather[0].main;
      this.temp = Math.ceil(Number(payload.main.temp));
    });

    this.http.get('https://restcountries.com/v3.1/all').pipe((first())).subscribe((countries: any) => {
      countries.forEach((country: Country) => {
        if(country.capital){
          this.capitals.push(country.capital[0]);
        }
      });
      this.capitals.sort();
    });


    this.fb.auth.user.subscribe((user:any)=>{
      this.userUid = user.uid;

    });


    this.fb.getCities().subscribe(res => {
      res.map((e: any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      }).forEach((city: City) => {
        if (city.name === 'rome' && city.createdBy == this.userUid) {
          this.followedCM = true;
        }
      })
    }, err => {
      alert('Error while fetching student data');
    })
  }

  selectCity(city:string) {
    if (this.capitals.includes(city)) {
      this.cardCity = city;
      this.showNote = false;
    }
  }

  addCityOfTheMonth() {
    this.cityObj.id = '';
    this.cityObj.createdBy = this.userUid;
    this.cityObj.name = this.city

    this.fb.addCity(this.cityObj).then(() => {
      this.followedCM = true;
    });
  }

  ngOnDestroy() {
    // this.sub1.unsubscribe();
  }

}

