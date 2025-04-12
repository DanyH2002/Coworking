import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiciosService } from './../../shared/Servicios/servicios.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-detalles',
  imports: [CardModule, ButtonModule, Tag, CommonModule],
  providers: [MessageService],
  templateUrl: './detalles.component.html',
  styleUrl: './detalles.component.css'
})
export class DetallesComponent implements OnInit {
  espacio: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ServiciosService,
    private message: MessageService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); // Obtener ID desde la URL
    console.log('ID recibido:', id); // Validar en consola que se está recibiendo el ID
    this.cargarEspacio(id); // Cargar espacio con el ID recibido
  }

  cargarEspacio(id: string | null) {
    console.log('ID del espacio:', id);
    if (id) {
      this.api.getItem('espacios', Number(id)).subscribe({
        next: (response) => {
          this.espacio = response.espacio; // Asignar información del espacio
          console.log('Espacio cargado:', this.espacio);
        },
        error: (error) => {
          console.error('Error al cargar el espacio:', error);
          this.message.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar el espacio' });
        },
      });
    }
  }

  volverALista() {
    this.router.navigateByUrl('/inicio/espacios');
  }

  hacerReservacion() {
    this.router.navigate(['/inicio/nueva_reservacion'], {
      queryParams: { espacioId: this.espacio.id },
    });
  }
}
