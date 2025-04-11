import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiciosService } from '../../shared/Servicios/servicios.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService} from 'primeng/api';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CommonModule } from '@angular/common';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-agregar',
  imports: [FormsModule, ReactiveFormsModule, ButtonModule, ConfirmDialog, ToastModule, InputNumberModule, ToggleSwitchModule, CommonModule, InputGroupModule, InputSwitchModule, InputTextModule],
  providers: [MessageService, ConfirmationService, PrimeIcons],
  templateUrl: './agregar.component.html',
  styleUrl: './agregar.component.css'
})
export class AgregarComponent implements OnInit {
  espacio: any;
  EspacioForm: FormGroup;

  constructor(
    private router: Router,
    private api: ServiciosService,
    private message: MessageService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private conf: ConfirmationService) {
    this.EspacioForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      capacidad: ['', [Validators.required, Validators.min(1)]],
      precio_hora: ['', [Validators.required, Validators.min(1)]],
      disponibilidad: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Cargar el espacio si se pasa un id en la URL
    const id = this.route.snapshot.paramMap.get('id'); // Obtenemos el id de la URL
    this.cargarEspacio(id); // Cargamos el espacio
  }

  cargarEspacio(id: String | null) {
    console.log('Cargando espacio con id:', id);
    if (id) {
      this.api.getItem('espacios', Number(id)).subscribe({
        next: (data) => {
          this.espacio = data.espacio;
          console.log('Espacio cargado', this.espacio);
          this.EspacioForm.patchValue({
            nombre: this.espacio.nombre,
            capacidad: this.espacio.capacidad,
            precio_hora: this.espacio.precio_hora,
            disponibilidad: this.espacio.disponibilidad,
          });
          console.log('Espacio cargado en el formulario', this.EspacioForm.value);
        },
        error: (error) => {
          console.error('Error al cargar el espacio', error);
          this.message.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar el espacio' });
        }
      });
    }
  }

  crearEspacio() {
    console.log(this.EspacioForm.value);
    if (this.EspacioForm.valid) {
      this.api.postItem('espacios', this.EspacioForm.value).subscribe({
        next: (data) => {
          console.log('Espacio creado', data);
          this.message.add({ severity: 'success', summary: 'Éxito', detail: 'Espacio creado' });
          setTimeout(() => {
            this.router.navigateByUrl('/inicio/espacios');
          }, 3000);
        }
        , error: (error) => {
          console.error('Error al crear el espacio', error);
          this.message.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el espacio' });
        }
      });
    }
  }

  actualizarEspacio() {
    console.log(this.EspacioForm.value);
    if (this.EspacioForm.valid) {
      this.api.updateItem('espacios', this.espacio.id, this.EspacioForm.value).subscribe({
        next: (data) => {
          console.log('Espacio actualizado', data);
          this.message.add({ severity: 'success', summary: 'Éxito', detail: 'Espacio actualizado' });
          setTimeout(() => {
            this.router.navigateByUrl('/inicio/espacios');
          }, 3000);
        }
        , error: (error) => {
          console.error('Error al actualizar el espacio', error);
          this.message.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el espacio' });
        }
      });
    }
  }

  eliminarEspacio(event: Event) {
    if (!this.espacio || !this.espacio.id) {
      this.message.add({ severity: 'warn', summary: 'Advertencia', detail: 'No hay espacio seleccionado para eliminar.' });
      return;
    }
    this.conf.confirm({
      message: '¿Estás seguro de eliminar este espacio?',
      header: 'Eliminar Espacio',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        this.api.deleteItem('espacios', this.espacio.id).subscribe({
          next: (data) => {
            console.log('Espacio eliminado', data);
            this.message.add({ severity: 'success', summary: 'Éxito', detail: 'Espacio eliminado' });
            setTimeout(() => {
              this.router.navigateByUrl('/inicio/espacios');
            }, 3000);
          },
          error: (error) => {
            console.error('Error al eliminar el espacio', error);
            this.message.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el espacio' });
          }
        });
      },
      reject: () => {
        this.message.add({ severity: 'info', summary: 'Cancelado', detail: 'Eliminación cancelada' });
      }
    });
  }

  reservarEspacio() {
    if (this.espacio && this.espacio.id && this.espacio.disponibilidad) {
      this.router.navigate(['/inicio/nueva_reservacion'], {
        queryParams: { espacioId: this.espacio.id }
      });
      console.log('Redirigiendo a reservar espacio con ID:', this.espacio.id);
    } else if (this.espacio && !this.espacio.disponibilidad) {
      this.message.add({ severity: 'warn', summary: 'No Disponible', detail: 'Este espacio no está disponible para reservaciones.' });
      console.error('Espacio no disponible para reservar.');
    } else {
      this.message.add({ severity: 'error', summary: 'Error', detail: 'No se puede reservar este espacio.' });
      console.error('No se encontró un espacio válido para reservar.');
    }
  }

  volverALista() {
    this.router.navigateByUrl('/inicio/espacios'); // Redirige a la lista de espacios
  }
}
