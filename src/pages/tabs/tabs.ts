import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { MapPage } from '../map/map';
// import { SchedulePage } from '../schedule/schedule';
import { HomePage } from '../home/home';
import { StartPage } from '../start/start';
// import { SpeakerListPage } from '../speaker-list/speaker-list';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = HomePage;
  // tab2Root: any = SchedulePage;
  tab2Root: any = MapPage;
  tab3Root: any = AboutPage;
  tab4Root: any = StartPage
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

}
