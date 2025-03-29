import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { MegaMenuModule } from 'primeng/megamenu';
import { TableModule } from 'primeng/table';
import { Avatar} from 'primeng/avatar';

@Component({
  selector: 'app-dashbord',
  imports: [DrawerModule, DividerModule, ButtonModule, MegaMenuModule, TableModule, Avatar],
  templateUrl: './dashbord.component.html',
  styleUrl: './dashbord.component.css'
})
export class DashbordComponent {
  constructor(private route: ActivatedRoute, private router: Router)
  { console.log('DashboardComponent inicializado');}

  drawerVisible: boolean = false;

  reservas = [
    { cliente: 'Hulda Luna', espacio: 'Sala de Conferencias', fecha: '2025-03-27', estado: 'Confirmada' },
    { cliente: 'María López', espacio: 'Oficina 3', fecha: '2025-03-26', estado: 'Pendiente' },
  ];

  menuItems = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
    },
    {
      label: 'Gestión',
      items: [
        [{ label: 'Espacios', icon: 'pi pi-building' }, { label: 'Reservas', icon: 'pi pi-calendar' }],
      ],
    },
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      items: [
        [{ label: 'Cerrar Sesión', icon: 'pi pi-power-off' }],
      ],
    },
  ];

  toggleDrawer() {
    this.drawerVisible = !this.drawerVisible;
  }

}
