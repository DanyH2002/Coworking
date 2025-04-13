import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiciosService } from '../../shared/Servicios/servicios.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-lista',
  imports: [TableModule, CommonModule, ButtonModule, Tag],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css'
})
export class ListaComponent implements OnInit {
  usuarios: any[] = [];

  constructor(private router: Router, private api: ServiciosService) { }
  ngOnInit() {
    this.cargarUsuarios();
  }
  cargarUsuarios() {
    this.api.getItems('admin/usuarios').subscribe({
      next: (response: any) => {
        if (response.status === 1) {
          this.usuarios = response.usuarios;
        }
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    });
  }

  verDetallesUsuario(id: number): void {
    this.router.navigate([`/inicio/usuario/${id}`]);
  }
}
