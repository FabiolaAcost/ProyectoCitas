import { Component } from '@angular/core';
import { Router } from '@angular/router';
import  {InicioComponent} from '../components/inicio/inicio.component';
import { IonFabButton, IonFab, IonIcon, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {add, settingsOutline} from 'ionicons/icons';
import { ConfiguracionesComponent } from "../components/configuraciones/configuraciones.component";

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    standalone: true,
    imports: [IonFabButton, IonFab, IonIcon, IonButtons, IonButton, InicioComponent, IonHeader, IonToolbar, IonTitle, IonContent, ConfiguracionesComponent]
})
export class HomePage {

  permitirEliminarCitas: boolean = true ; 
  constructor(private router: Router) {
    addIcons({add, settingsOutline});
  }

  onPermitirEliminarCitasChange(value: boolean) {
    console.log('HomePage - permitirEliminarCitas updated to:', this.permitirEliminarCitas);
    this.permitirEliminarCitas = value;
    console.log('HomePage - permitirEliminarCitas updated to:', this.permitirEliminarCitas);
  }

  
  redirect() {
    this.router.navigate(['/configuraciones']);
  }

  irAGestionCitas() {
    this.router.navigate(['/gestion-citas']);
  }
}
