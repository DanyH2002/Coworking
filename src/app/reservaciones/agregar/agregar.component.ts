import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiciosService } from '../../shared/Servicios/servicios.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-agregar',
  imports: [CommonModule, FormsModule, ButtonModule, ToastModule, ReactiveFormsModule, DropdownModule, ConfirmDialog, DatePickerModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './agregar.component.html',
  styleUrl: './agregar.component.css'
})
export class AgregarComponent implements OnInit {
  reservacionForm: FormGroup;
  reservacion: any;
  espacios: any[] = [];
  usuarios: any[] = [];
  isAdmin = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ServiciosService,
    private message: MessageService,
    private conf: ConfirmationService,
    private fb: FormBuilder
  ) {
    this.reservacionForm = this.fb.group({
      id_espacio: ['', Validators.required],
      id_user: ['', Validators.required],
      fecha_reseva: ['', Validators.required],
      hora_inicio: ['', Validators.required],
      hora_fin: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const espacioId = params['espacioId']; // Obtener el espacio preseleccionado
      this.verificarRol();
      console.log("ID del espacio:", espacioId);
      console.log("ID del usuario:", localStorage.getItem('id'));
      console.log("Rol del usuario:", localStorage.getItem('rol'));
      // Configura el formulario dependiendo del contexto (cliente o administrador)
      this.reservacionForm = this.fb.group({
        id_espacio: [espacioId || '', Validators.required], // Si `espacioId` está presente, se asigna; si no, se deja vacío
        id_user: [this.isAdmin ? '' : localStorage.getItem('id'), Validators.required], // Si es cliente, asigna automáticamente su ID
        fecha_reseva: ['', Validators.required],
        hora_inicio: ['', Validators.required],
        hora_fin: ['', Validators.required],
      });
      console.log("Formulario de reservación inicializado:", this.reservacionForm.value);

      // Si no hay espacio preseleccionado, carga la lista de espacios
      if (!espacioId) {
        this.cargarEspacios();
      }
      // Cargar usuarios si es administrador
      if (this.isAdmin) {
        this.cargarUsuarios();
      }
    });
  }

  verificarRol() {
    const rol = localStorage.getItem('rol');
    this.isAdmin = rol === '1';
  }

  cargarEspacios() {
    this.api.getItems('espacios').subscribe({
      next: (response: any) => {
        this.espacios = response.espacios.map((e: any) => ({ label: e.nombre, value: e.id }));
      },
      error: (error) => {
        console.error("Error al cargar espacios:", error);
      }
    });
  }


  cargarUsuarios() {
    this.api.getItems('admin/usuarios').subscribe({
      next: (response: any) => {
        this.usuarios = response.usuarios.map((u: any) => ({ label: u.name, value: u.id }));
      },
      error: (error) => {
        console.error("Error al cargar usuarios:", error);
      }
    });
  }

  confirmReservacion(event: Event) {
    console.log("Fomulario de reservación:", this.reservacionForm.value);
    if (this.reservacionForm.valid) {
      this.conf.confirm({
        message: '¿Está seguro de que desea hacer esta reservación?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Aceptar',
        acceptButtonProps: {
          label: 'Aceptar',
          severity: 'success',
          outlined: true,
        },
        rejectButtonProps: {
          label: 'Cancelar',
          severity: 'secondary',
          outlined: true,
        },
        accept: () => {
          const formData = this.reservacionForm.value;
          // Convertir la fecha y las horas al formato esperado por el backend
          const fecha_reseva = this.formatDate(formData.fecha_reseva);
          const hora_inicio = this.formatTime(formData.hora_inicio);
          const hora_fin = this.formatTime(formData.hora_fin);

          const requestData = {
            ...formData,
            fecha_reseva,
            hora_inicio,
            hora_fin,
          };
          this.api.postItem('reservaciones', requestData).subscribe({
            next: (response: any) => {
              this.message.add({ severity: 'success', summary: 'Éxito', detail: 'Reservación creada con éxito' });
              console.log("Reservación creada:", response);
              setTimeout(() => {
                this.router.navigateByUrl('/inicio/reservaciones');
              }, 3000);
            }
            , error: (error) => {
              console.error("Error al crear la reservación:", error);
              this.message.add({ severity: 'error', summary: 'Error', detail: 'Error al crear la reservación' });
            }
          });
        }
      })
    } else {
      this.message.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor complete todos los campos requeridos.' });
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatTime(time: Date): string {
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  volverALista() {
    this.router.navigateByUrl('/inicio/espacios');
  }

}
