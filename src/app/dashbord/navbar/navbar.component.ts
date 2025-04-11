import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MegaMenuItem } from 'primeng/api';
import { MegaMenu } from 'primeng/megamenu';
import { AvatarModule } from 'primeng/avatar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, RouterOutlet, AvatarModule, MegaMenu, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private router: Router) { }
  items: MegaMenuItem[] | undefined;
  ngOnInit() {
    this.items = [
      {
        label: 'Dashboard',
        root: true,
        command: () => {
          this.router.navigateByUrl('/inicio');
        }
      },
      {
        label: 'Espacios',
        items: [
          [
            {
              label: 'Opciones:', items: [
                {
                  label: 'Crear Espacio',
                  routerLink: ['/inicio/nuevo_espacio']

                },
                {
                  label: 'Lista de Espacios',
                  routerLink: ['/inicio/espacios']
                }
              ]
            }
          ]
        ]
      },
      {
        label: 'Reservas',
        items: [
          [
            {
              label: 'Opciones:', items: [
                {
                  label: 'Crear Reserva',
                  routerLink: ['/inicio/nueva_reservacion']

                },
                {
                  label: 'Lista de Reservas',
                  routerLink: ['/inicio/reservaciones']
                }
              ]
            }
          ]
        ]
      },
      {
        label: 'Usuario',
        items: [
          [
            {
              label: 'Opciones:', items: [
                {
                  label: 'Crear Usuario',
                  routerLink: ['/inicio/nuevo_usuario']
                },
                {
                  label: 'Lista de Usuarios',
                  routerLink: ['/inicio/usuarios']
                }
              ]
            }
          ]
        ]
      }
    ];
  }
}
