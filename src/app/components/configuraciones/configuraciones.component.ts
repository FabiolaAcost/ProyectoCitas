import { Component, EventEmitter, Output } from '@angular/core';
import { IonHeader, IonFabButton, IonFab, IonIcon, IonButtons, IonButton, IonToolbar, IonTitle, IonContent, IonItem, IonToggle } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import {addIcons} from 'ionicons';
import {arrowBackOutline} from 'ionicons/icons';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.scss'],
  standalone: true,
  imports: [IonToggle,IonItem, IonFabButton, IonFab, IonIcon, IonButtons, IonButton,ConfiguracionesComponent,IonHeader, IonToolbar, IonTitle, IonContent],
})
export class ConfiguracionesComponent {

  @Output() permitirEliminarCitasChange = new EventEmitter<boolean>();
  
  permitirEliminarCitas: boolean | undefined ;

  constructor(private router: Router) { 
    addIcons({ arrowBackOutline});
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  onToggleChange(event: any) {
    this.permitirEliminarCitas = event.detail.checked;
    console.log(this.permitirEliminarCitas);
    this.permitirEliminarCitasChange.emit(this.permitirEliminarCitas);
  }

}
