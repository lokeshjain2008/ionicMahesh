import {Page, Alert, Loading, NavController} from 'ionic-angular';

import {HomePage} from '../home/home';



@Page({
  templateUrl: 'build/pages/getting-started/getting-started.html'
})
export class GettingStartedPage {
  constructor(private nav: NavController) {

  }
  
  
  //loaders
  showLoading(){
      let loader =  Loading.create({
          content: "Hello",
          dismissOnPageChange: true,
          duration: 3200
      });
      this.nav.present(loader);
      
  }
  
  
  goto(){
      this.nav.push(HomePage);
  }
  
  
}
