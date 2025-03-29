import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-registro',
  imports: [ButtonModule, InputTextModule, FormsModule, ReactiveFormsModule, ToastModule, RippleModule],
    providers: [MessageService],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  Registro: FormGroup;
  constructor(private formBuilder: FormBuilder, private router: Router, private routes: ActivatedRoute, private message: MessageService) {
    this.Registro = this.formBuilder.group({
      nombre: [undefined,[Validators.required, Validators.minLength(3)]],
      email: [undefined, [Validators.required, Validators.email]],
      password: [undefined, [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    console.log(this.Registro.value);
    if (this.Registro.valid) {
      console.log(this.Registro.value);
      console.log("Formulario válido, redirigiendo al dashboard...");
      this.message.add({ severity: 'success', summary: 'Éxito', detail: 'Registro exitoso' });
      // Retrasar la redirección para que el Toast sea visible
      setTimeout(() => {
        this.router.navigateByUrl('/dashbord');
      }, 3000); // 2000ms = 2 segundos
    } else {
      console.error("El formulario no es válido");
      this.message.add({ severity: 'error', summary: 'Error', detail: 'El formulario no es válido, por favor revise los campos' });
    }
  }

  onLogin() {
    console.log("Redirigiendo al login...");
    this.router.navigateByUrl('/login');
  }
}
