import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiciosService } from '../../shared/Servicios/servicios.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';


@Component({
  selector: 'app-lista',
  imports: [ButtonModule, CommonModule, TableModule, Tag],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css'
})
export class ListaComponent implements OnInit {
  data: any[] = [];
  isAdmin = false; // Controla si es administrador o cliente
  constructor(
    private api: ServiciosService,
    private route: Router,

  ) { }

  ngOnInit() {
    this.verificarRol();
    this.cargarEspacios();
  }

  cargarEspacios() {
    this.api.getItems('espacios').subscribe({
      next: (response: any) => {
        this.data = response.espacios;
        console.log('Espacios cargados correctamente:', this.data);
      },
      error: (error) => {
        console.error('Error al cargar los espacios:', error);
      },
    });
  }

  verificarRol() {
    const rol = localStorage.getItem('rol'); // Lee el rol almacenado en localStorage
  this.isAdmin = rol === '1'; // Define si es administrador (rol = 1)
  }

  irAFormulario(id: number) {
    this.route.navigate(['/inicio/espacio', id]);
  }
  irADetalles(id: number) {
    this.route.navigate(['/inicio/espacio_detalle', id]);
  }

}
