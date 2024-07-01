import { Component, OnInit, ViewChild } from '@angular/core';
import { CitasService } from '../../services/citas.service';
import { Cita } from 'src/app/models/citaModel';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonIcon, IonInput, IonItem, IonList,  IonContent, IonButton, IonCardContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { arrowBackOutline, trash } from 'ionicons/icons';

@Component({
  selector: 'app-gestion-citas',
  templateUrl: './gestion-citas.component.html',
  styleUrls: ['./gestion-citas.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, IonList, IonItem, IonInput, IonHeader, IonButton, IonToolbar, IonTitle, IonIcon, IonContent, IonToolbar, IonCardContent]
})
export class GestionCitasComponent implements OnInit {
  
  @ViewChild('citaForm') citaForm!: NgForm;
  citas: Cita[] = [];
  nuevaCita: Cita = { text: '', author: '' };

  constructor(private citasService: CitasService, private router: Router) {
    addIcons({ trash, arrowBackOutline });
  }

  ngOnInit(): void {
    this.citasService.citas$.subscribe(citas => {
      this.citas = citas;
    });
  }

  goHome() {
    this.router.navigate(['/home']); // Navega a la página principal
  }

  async agregarCita(): Promise<void> {
    if (this.nuevaCita.text && this.nuevaCita.author) {
      try {
        await this.citasService.agregarCita(this.nuevaCita);
        this.nuevaCita = { text: '', author: '' };
        this.citaForm.resetForm(); 
      } catch (error) {
        console.error('Error al agregar la cita', error);
      }
    }
  }

  async eliminarCita(index: number): Promise<void> {
    const cita = this.citas[index];
    if (cita && cita.id !== undefined) {
      try {
        await this.citasService.eliminarCita(cita.id);
      } catch (error) {
        console.error('Error al eliminar la cita', error);
      }
    }
  }

}
