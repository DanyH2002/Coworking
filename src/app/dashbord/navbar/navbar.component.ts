import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MegaMenuItem } from 'primeng/api';
import { MegaMenu } from 'primeng/megamenu';
import { AvatarModule } from 'primeng/avatar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../../shared/Servicios/auth-service.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, RouterOutlet, AvatarModule, MegaMenu, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private router: Router, private auth: AuthServiceService) { }

  items: MegaMenuItem[] | undefined;
  isAdmin: boolean = false;

  ngOnInit() {
    // Verifica el rol del usuario
    this.isAdmin = this.auth.getUserRole() === '1';
    this.items = [
      {
        label: 'Dashboard',
        root: true,
        visible: this.isAdmin,
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
                  routerLink: ['/inicio/nuevo_espacio'],
                  visible: this.isAdmin

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
        visible: this.isAdmin,
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

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => console.error('Error al cerrar sesión:', err)
    });
  }
}
