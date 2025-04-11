import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { ServiciosService } from '../../shared/Servicios/servicios.service';

@Component({
  selector: 'app-registro',
  imports: [ButtonModule, InputTextModule, FormsModule, ReactiveFormsModule, ToastModule, RippleModule],
  providers: [MessageService],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  Registro: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private message: MessageService,
    private api: ServiciosService,) {
    this.Registro = this.formBuilder.group({
      name: [undefined, [Validators.required, Validators.minLength(3)]],
      email: [undefined, [Validators.required, Validators.email]],
      password: [undefined, [Validators.required, Validators.minLength(8)]],
    });


  }

  onSubmit() {
    console.log(this.Registro.value);
    if (this.Registro.valid) {
      // API para registrar al usuario
      this.api.postItem('auth',this.Registro.value,'register').subscribe({
        next: (response) => {
          console.log("Registro exitoso", response);
          this.message.add({ severity: 'success', summary: 'Éxito', detail: 'Registro exitoso' });
          // Retrasar la redirección para que el Toast sea visible
          setTimeout(() => {
            this.router.navigateByUrl('/login');
          }, 3000);
        },
        error: (error) => {
          console.error("Error en el registro", error);
          this.message.add({ severity: 'error', summary: 'Error', detail: 'Error en el registro, por favor revise los campos' });
        }
      });
    } else {
      console.error("El formulario no es válido");
      this.message.add({ severity: 'error', summary: 'Error', detail: 'El formulario no es válido, por favor revise los campos' });
    }
  }

  onLogin() {
    this.router.navigateByUrl('/login');
  }
}
