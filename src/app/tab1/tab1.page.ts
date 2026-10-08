import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonCardContent } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonCardContent],
})
export class Tab1Page {
  count = 0;
  counterName = "";

  increment() {
    this.count++;
  }

  decrement() {
    if (this.count > 0) {
      this.count--;
    }
  }

  incrementFive() {
    this.count += 5;
  }

  decrementFive() {
    if (this.count > 4) {
      this.count -=5;
    }
    else{
      this.count = 0;
    }
  }

  reset() {
    this.count = 0;
  }
}
