import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WeatherService} from '../../services/weather/weather.service';
import {forkJoin, Observable, Subscription} from 'rxjs';
import {UiService} from '../../services/ui/ui.service';
import {concatMap} from 'rxjs/operators';
import {TwitterService} from '../../services/twitter/twitter.service';
import {Tweet} from "../../models/tweet";
import {Day} from "../../models/day";
import {City} from "../../models/city";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy {

  darkMode: any;
  city: string='';
  state: string='';
  temp: any;
  hum: any;
  wind: any;
  today: string='';
  daysForecast: any;
  cityIllustrationPath: string='';
  sub1: any;
  sub2: any;
  errorMessage: string='';
  tweets$: Array<any> = [];
  dayObj: Day = {
    name: '',
    counter: 0,
    state: '',
    temp:0,
  };
  daysInfo:Array<any> = [];
  myTimeline: any;

  constructor(public twitter: TwitterService, public activeRouter: ActivatedRoute, public weather: WeatherService, public ui: UiService) {

  }

  ngOnInit() {

    this.sub1 = this.ui.darkModeState.subscribe((isDark) => {
      this.darkMode = isDark;
    });

    const todayNumberInWeek = new Date().getDay();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.today = days[todayNumberInWeek];
    this.sub2 = this.activeRouter.paramMap.pipe(concatMap((route: any) => {
        this.city = route.params.city;
        switch (this.city.toLowerCase()) {
          case 'paris':
            this.cityIllustrationPath = '../../assets/cities/france.svg';
            break;
          case 'doha':
            this.cityIllustrationPath = '../../assets/cities/qatar.svg';
            break;
          case 'rabat':
            this.cityIllustrationPath = '../../assets/cities/rabat.svg';
            break;
          case 'tunis':
            this.cityIllustrationPath = '../../assets/cities/tunis.svg';
            break;
          case 'tokyo':
            this.cityIllustrationPath = '../../assets/cities/japan.svg';
            break;
          default:
            this.cityIllustrationPath = '../../assets/cities/default.svg';
        }
        return forkJoin(this.weather.getWeather(this.city), this.weather.getForecast(this.city));
      })
    ).subscribe((payload: any) => {
      this.state = payload[0].weather[0].main;
      this.temp = Math.ceil(Number(payload[0].main.temp));
      this.hum = payload[0].main.humidity;
      this.wind = Math.round(Math.round(payload[0].wind.speed));
      const dates = new Map();
      for (const res of payload[1]) {
        const date = new Date(res.dt_txt).toDateString().split(' ')[0];
        if (dates.get(date)) {
          dates.get(date).counter += 1;
          dates.get(date).temp += res.main.temp;
        } else {
          dates.set(date, {
            state: res.weather[0].main,
            temp: res.main.temp,
            counter: 1
          });
        }
      }
      dates.forEach((value) => {
        value.temp = Math.round(value.temp / value.counter);
      });
      dates.delete(Object.keys(dates)[0])
      this.daysForecast = dates;
  
      dates.forEach((value,key) =>{
        this.dayObj.name = key;
        this.dayObj.counter = value.counter;
        this.dayObj.state = value.state;
        this.dayObj.temp = Math.round(value.temp);

        this.daysInfo.push(this.dayObj);

        this.dayObj = {
          name: '',
          counter: 0,
          state: '',
          temp:0,
        };

    });


    }, (err) => {
      this.errorMessage = err.error.message;
      setTimeout(() => {
        this.errorMessage = '';
      }, 2500);
    })


    this.twitter.fetchTweets(this.city).subscribe((tweet: any) => {
        tweet.forEach((tweet: Tweet) => {
          if(tweet.user){
            this.tweets$.push(tweet);
          }
        });
      });


    // this.twitter.getTimeline()
    //   .subscribe(
    //     myTimeline => {
    //       this.myTimeline = myTimeline;
    //       console.log(this.myTimeline);
    //     }
    //   )

    }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

}
