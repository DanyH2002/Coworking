import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiciosService } from './../../shared/Servicios/servicios.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-list',
  imports: [CommonModule, ButtonModule, TableModule, Tag],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  data: any[] = [];
  isAdmin = false;

  constructor(
    private router: Router,
    private api: ServiciosService
  ) { }

  ngOnInit() {
    this.verificarRol();
    this.cargarReservaciones();
  }

  verificarRol() {
    const rol = localStorage.getItem('rol');
    this.isAdmin = rol === '1';
    console.log("Rol del usuario:", rol);
  }

  cargarReservaciones() {
    const id_user = localStorage.getItem('id'); // Accede al ID del usuario desde localStorage
    if (!id_user) {
      console.error('ID de usuario no encontrado.');
      return;
    }
    console.log("ID de usuario:", id_user);
    const queryParams = `?id_user=${id_user}`; // Construir los parámetros de consulta
    console.log("Parámetros de consulta:", queryParams);
    this.api.getItems('reservaciones', queryParams).subscribe({
      next: (res: any) => {
        console.log("Respuesta completa del backend:", res);
        if (res.status === 1 && res.reservaciones) {
          this.data = res.reservaciones; // Asigna las reservaciones al arreglo `data`
          console.log("Reservaciones cargadas en el componente:", this.data);
        } else {
          console.error("Error en la estructura de la respuesta:", res);
        }
      },
      error: (err) => {
        console.error("Error al cargar las reservaciones desde el servidor:", err);
      }
    });
  }

  verDetalles(id: number) {
    this.router.navigate(['/inicio/reservacion_detalle', id]);
  }

  getEstadoSeverity(estado: string): "success" | "warn" | "danger" | "info" | undefined {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'warn';
      case 'confirmada':
        return 'success';
      case 'cancelada':
        return 'danger';
      default:
        return 'info';
    }
  }


}
