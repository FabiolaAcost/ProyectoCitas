import { Component, OnInit, Input } from '@angular/core';
import { CitasService } from '../../services/citas.service';
import { Cita } from 'src/app/models/citaModel';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonIcon, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  standalone: true,
  imports: [IonIcon, IonCard, IonCardContent, CommonModule, IonicModule]
})
export class InicioComponent implements OnInit {

  @Input() permitirEliminarCitas: boolean | undefined;
  cita: Cita | null = null;

  constructor(private citasService: CitasService) {
    addIcons({ trash });
  }
   
  async ngOnInit() {
    try {
      await this.obtenerCitaAleatoria();
    } catch (error) {
      console.error('Error al inicializar el componente', error);
    }
  }
  async obtenerCitaAleatoria() {
    try {
      this.cita = await this.citasService.obtenerCitaAleatoria();
      console.log('Cita obtenida:', this.cita); 
    } catch (error) {
      console.error('Error al obtener una cita aleatoria', error);
    }
  }

  async eliminarCita() {
    if (this.cita && this.cita.id !== undefined) {
      try {
        await this.citasService.eliminarCita(this.cita.id);
        await this.obtenerCitaAleatoria(); // Obtener una nueva cita después de eliminar la actual
      } catch (error) {
        console.error('Error al eliminar la cita', error);
      }
    }
  }
}