import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiciosService } from '../../shared/Servicios/servicios.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-detalles',
  imports: [CardModule, ButtonModule, CommonModule, ConfirmDialog, ToastModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './detalles.component.html',
  styleUrl: './detalles.component.css'
})
export class DetallesComponent implements OnInit {
  reservacion: any;
  isAdmin = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ServiciosService,
    private message: MessageService,
    private conf: ConfirmationService
  ) { }

  ngOnInit() {
    this.verificarRol();
    this.obtenerReservacion();
  }

  verificarRol(): void {
    const rol = localStorage.getItem('rol');
    this.isAdmin = rol === '1'; // Verifica si es administrador
  }

  obtenerReservacion() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID recibido:', id);
    this.api.getItems(`reservaciones/${id}`).subscribe({
      next: (response: any) => {
        if (response.status === 1) {
          this.reservacion = response.reservacion;
          console.log("Reservación cargada:", this.reservacion);
        }
      },
      error: (error) => {
        console.error("Error al cargar la reservación:", error);
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la reservación' });
      }
    });
  }

  cancelarReservacion(event: Event) {
    if (this.reservacion.estado === 'cancelada') {
      this.message.add({ severity: 'warn', summary: 'Advertencia', detail: 'Esta reservación ya está cancelada' });
      return;
    }
    this.conf.confirm({
      message: '¿Está seguro de que desea cancelar esta reservación?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'No',
      acceptLabel: 'Sí',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Sí',
        severity: 'danger',
      },
      accept: () => {
        const url = `${this.reservacion.id}`; // Ajusta la URL
        this.api.deleteItem('reservaciones/cancel', url).subscribe({
          next: (data) => {
            console.log('Reservación cancelada', data);
            this.message.add({ severity: 'success', summary: 'Éxito', detail: 'Reservación cancelada' });
            setTimeout(() => {
              this.router.navigateByUrl('/inicio/reservaciones');
            }, 3000);
          }
          , error: (error) => {
            console.error('Error al cancelar la reservación', error);
            this.message.add({ severity: 'error', summary: 'Error', detail: 'Error al cancelar la reservación' });
          }
        });
      },
      reject: () => {
        this.message.add({ severity: 'info', summary: 'Cancelado', detail: 'Reservacion no cancelada' });
      }
    });
  }

  pagarReservacion(event: Event) {
    if (this.reservacion.estado === 'confirmada') {
      this.message.add({ severity: 'warn', summary: 'Advertencia', detail: 'Esta reservación ya está confirmada' });
      return;
    }
    this.conf.confirm({
      message: '¿Desea confirmar el pago de esta reservación?',
      header: 'Confirmar Pago',
      icon: 'pi pi-check-circle',
      rejectLabel: 'No',
      acceptLabel: 'Sí',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Sí',
        severity: 'success',
      },
      accept: () => {
        const requestData = { id_reservacion: this.reservacion.id };
        this.api.postItem('reservaciones/pay',requestData).subscribe({
          next: (data) => {
            console.log('Pago confirmado', data);
            this.reservacion.estado = 'confirmada';
            this.message.add({ severity: 'success', summary: 'Éxito', detail: 'Pago confirmado' });
            setTimeout(() => {
              this.router.navigateByUrl('/inicio/reservaciones');
            }, 3000);
          },
          error: (error) => {
            console.error('Error al confirmar el pago', error);
            this.message.add({ severity: 'error', summary: 'Error', detail: 'Error al confirmar el pago' });
          }
        });
      },
      reject: () => {
        this.message.add({ severity: 'info', summary: 'Cancelado', detail: 'Pago no confirmado' });
      }
    });
  }
}
