import { Component, OnInit, PLATFORM_ID, ChangeDetectorRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ServiciosService } from '../../shared/Servicios/servicios.service';

@Component({
  selector: 'app-dashbord',
  imports: [ChartModule, CardModule, ButtonModule, CommonModule],
  templateUrl: './dashbord.component.html',
  styleUrl: './dashbord.component.css'
})

export class DashbordComponent implements OnInit {
  constructor(private router: Router, private api: ServiciosService, private cd: ChangeDetectorRef) {
  }
  data: any;
  options: any;
  platformId = inject(PLATFORM_ID);
  configService = inject(ServiciosService);

  dashboardData: any = {}; // Para los datos generales del dashboard
  ingresosChartData: any = {}; // Para la gráfica de ingresos
  reservacionesChartData: any = {}; // Para la gráfica de reservaciones
  usuariosChartData: any = {}; // Para la gráfica de usuarios registrados

  ngOnInit() {
    this.cargarDatosDashboard();
  }

  cargarDatosDashboard() {
    this.api.getItems('admin').subscribe({
      next: (response: any) => {
        console.log('Datos del dashboard:', response);
        if (response.status === 1) {
          this.dashboardData = response.data;

          // Configurar la gráfica combinada
          this.data = {
            labels: response.data.ingresos_ultimos_12_meses.original.data.labels,
            datasets: [
              {
                type: 'line',
                label: 'Reservaciones Mensuales',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                data: response.data.reservaciones_ultimos_12_meses.original.data.data
              },
              {
                type: 'line',
                label: 'Usuarios Registrados Mensualmente',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                data: response.data.registro_usuarios_ultimos_12_meses.original.data.data
              }
            ]
          };

          // Configurar la gráfica de ingresos
          this.ingresosChartData = {
            labels: response.data.ingresos_ultimos_12_meses.original.data.labels,
            datasets: [
              {
                label: 'Ingresos Mensuales',
                data: response.data.ingresos_ultimos_12_meses.original.data.data,
                type: 'bar',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
              }
            ]
          };

          this.configurarOpcionesGraficas();

        }
      },
      error: (error) => {
        console.error('Error al cargar datos del dashboard:', error);
      }
    });
  }

  configurarOpcionesGraficas(): void {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder
            }
          },
          y: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder
            }
          }
        }
      };

      this.cd.markForCheck();
    }
  }
}
