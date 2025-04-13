import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiciosService } from '../../shared/Servicios/servicios.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-agregar',
  imports: [ButtonModule, CommonModule, ReactiveFormsModule, ToastModule, PasswordModule, InputSwitchModule],
  providers: [MessageService],
  templateUrl: './agregar.component.html',
  styleUrl: './agregar.component.css'
})
export class AgregarComponent implements OnInit {
  usuarioForm: FormGroup;
  usuario: any;
  id: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ServiciosService,
    private message: MessageService,
    private fb: FormBuilder
  ) {
    this.usuarioForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      password: ['', [Validators.minLength(8)]],
      rol: [0, Validators.required] // 0 = Cliente, 1 = Administrador
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.cargarUsuario(this.id);
    }
    console.log("ID obtenido " + this.id);
  }

  cargarUsuario(id: string) {
    // Convertir el id a número
    const idNumber = Number(id);
    this.api.getItem('admin/users', idNumber).subscribe({
      next: (response: any) => {
        if (response.status === 1) {
          this.usuario = response.usuario;
          this.usuarioForm.patchValue({
            name: this.usuario.name,
            email: this.usuario.email,
            rol: Boolean(this.usuario.rol),
            password: '********',
          });
        }
      },
      error: (error) => {
        console.error('Error al cargar el usuario:', error);
      }
    });
  }

  crearUsuario() {
    if (this.usuarioForm.valid) {
      console.log(this.usuarioForm.value);
      this.api.postItem('admin/usuarios', this.usuarioForm.value).subscribe({
        next: (response: any) => {
          this.message.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado con éxito' });
          setTimeout(() => this.router.navigate(['/inicio/usuarios']), 3000);
        },
        error: (error) => {
          console.error('Error al crear el usuario:', error);
          this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el usuario' });
        }
      });
    }
  }

  actualizarUsuario() {
    if (this.usuarioForm.valid && this.usuario) {
      const formData = this.usuarioForm.value;
      this.api.updateItem("admin/usuarios", this.usuario.id, {
        name: formData.name,
        email: formData.email,
        password: formData.password !== '********' ? formData.password : null, // Envía null si no cambia
        rol: formData.rol
      }
      ).subscribe({
        next: (response: any) => {
          this.message.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado con éxito' });
          setTimeout(() => this.router.navigate(['//inicio/usuarios']), 3000);
        },
        error: (error) => {
          console.error('Error al actualizar el usuario:', error);
          this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el usuario' });
        }
      });
    }
  }

  volverALista() {
    this.router.navigate(['/inicio/usuarios']);
  }

}
