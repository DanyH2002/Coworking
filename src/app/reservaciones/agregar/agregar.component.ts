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

@Component({
  selector: 'app-agregar',
  imports: [CommonModule, FormsModule, ButtonModule, ToastModule, ReactiveFormsModule, DropdownModule, ConfirmDialog],
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

  ngOnInit(): void {
    this.verificarRol();
    this.cargarEspacios();
    if (this.isAdmin) {
      this.cargarUsuarios();
    }

    this.reservacionForm = this.fb.group({
      id_espacio: ['', Validators.required],
      id_user: [this.isAdmin ? '' : localStorage.getItem('id'), Validators.required],
      fecha_reseva: ['', Validators.required],
      hora_inicio: ['', Validators.required],
      hora_fin: ['', Validators.required],
    });
  }

  verificarRol(): void {
    const rol = localStorage.getItem('rol');
    this.isAdmin = rol === '1';
  }

  cargarEspacios(): void {
    this.api.getItems('espacios').subscribe({
      next: (response: any) => {
        console.log("Espacios cargados:", response.espacios);
        this.espacios = response.espacios.map((e: any) => ({ label: e.nombre, value: e.id }));
        console.log("Espacios mapeados:", this.espacios);
      },
      error: (error) => {
        console.error("Error al cargar espacios:", error);
      }
    });
  }
  cargarUsuarios(): void {
    this.api.getItems('admin/usuarios').subscribe({
      next: (response: any) => {
        console.log("Usuarios cargados:", response.usuarios);
        this.usuarios = response.usuarios.map((u: any) => ({ label: u.name, value: u.id }));
        console.log("Usuarios mapeados:", this.usuarios);
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
          this.api.postItem('reservaciones', this.reservacionForm.value).subscribe({
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
}
