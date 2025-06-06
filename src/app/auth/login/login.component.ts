import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { ServiciosService } from '../../shared/Servicios/servicios.service';

@Component({
  selector: 'app-login',
  imports: [ButtonModule, DividerModule, InputTextModule, FormsModule, ReactiveFormsModule, ToastModule, RippleModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  Login: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private message: MessageService,
    private api: ServiciosService,) {
    this.Login = this.formBuilder.group({
      email: [undefined, [Validators.required, Validators.email]],
      password: [undefined, [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.Login.valid) {
      // API para loguear al usuario
      this.api.postItem('auth', this.Login.value, 'login').subscribe({
        next: (response) => {
          if (response.status !== 1) {
            console.error("Error en el inicio de sesión", response);
            this.message.add({ severity: 'error', summary: 'Error', detail: 'Error: ' + response.message });
            return;
          }
          console.log("Respuesta del inicio de sesión", response);
          console.log("Inicio de sesión exitoso", response);
          localStorage.setItem('token', response.token);
          localStorage.setItem('rol', response.rol);
          localStorage.setItem('id', response.id.toString());
          localStorage.setItem('nombre', response.name);
          localStorage.setItem('email', response.email);
          console.log("LocalStorage actualizado correctamente." + localStorage.length);
          this.message.add({ severity: 'success', summary: 'Éxito', detail: 'Inicio de sesión exitoso' });
          // Retrasar la redirección para que el Toast sea visible
          setTimeout(() => {
            this.router.navigateByUrl('/inicio');
          }, 3000);
        },
        error: (error) => {
          console.error("Error en el inicio de sesión", error);
          this.message.add({ severity: 'error', summary: 'Error', detail: 'Error en el inicio de sesión, por favor revise los campos' });
        }
      });
    } else {
      console.error("El formulario no es válido");
      this.message.add({ severity: 'error', summary: 'Error', detail: 'El formulario no es válido, por favor revise los campos' });
    }
  }

  onSignUp() {
    this.router.navigateByUrl('/registro');
  }
}
