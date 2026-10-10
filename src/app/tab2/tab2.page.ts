import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  AlertController,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { CounterService } from '../services/counter.service';

export type SortOption = 'date' | 'name' | 'value';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    DatePipe,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonTitle,
    IonToolbar,
  ],
})
export class Tab2Page implements OnInit {
  readonly counterService = inject(CounterService);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);

  readonly searchQuery = signal<string>('');
  readonly sortBy = signal<SortOption>('date');

  // Součet hodnot všech uložených počítadel
  readonly totalSum = computed(() => {
    return this.counterService.counters().reduce((acc, c) => acc + c.value, 0);
  });

  //min hodnota
  readonly minValue = computed(() => {
    const counters = this.counterService.counters();
    if (counters.length === 0) return 0;
    return counters.reduce((min, c) => Math.min(min, c.value), counters[0].value);
  });

  // max hodnota
  readonly maxValue = computed(() => {
    const counters = this.counterService.counters();
    if (counters.length === 0) return 0;
    return counters.reduce((max, c) => Math.max(max, c.value), counters[0].value);
  });

  // Filtrovaný a seřazený seznam
  readonly filteredCounters = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    let items = this.counterService.counters();

    if (query) {
      items = items.filter((c) => c.name.toLowerCase().includes(query));
    }

    const sort = this.sortBy();
    return [...items].sort((a, b) => {
      if (sort === 'name') {
        return a.name.localeCompare(b.name, 'cs');
      }
      if (sort === 'value') {
        return b.value - a.value;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  });

  async ngOnInit(): Promise<void> {
    await this.counterService.initialize();
  }

  async remove(id: string): Promise<void> {
    await this.counterService.remove(id);
    await this.showToast('Záznam byl odstraněn.');
  }

  //ion-alert
  async confirmClear(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Vymazat celou historii?',
      message: 'Opravdu chcete smazat všechny záznamy? Tuto akci nelze vzít zpět.',
      buttons: [
        {
          text: 'Zrušit',
          role: 'cancel',
        },
        {
          text: 'Vymazat',
          role: 'destructive',
          handler: async () => {
            await this.counterService.clear();
            await this.showToast('Celá historie byla vymazána.');
          },
        },
      ],
    });

    await alert.present();
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }
}