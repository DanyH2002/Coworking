import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-login',
  imports: [ButtonModule, DividerModule, InputTextModule, FormsModule, ReactiveFormsModule, ToastModule, RippleModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  Login: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private routes: ActivatedRoute, private message: MessageService) {
    this.Login = this.formBuilder.group({
      email: [undefined, [Validators.required, Validators.email]],
      password: [undefined, Validators.required]
    });
  }

  onSubmit() {
    console.log(this.Login.value);
    if (this.Login.valid) {
      console.log(this.Login.value);
      console.log("Formulario válido, redirigiendo al dashboard...");
      this.message.add({ severity: 'success', summary: 'Éxito', detail: 'Inicio de sesión exitoso' });
      // Retrasar la redirección para que el Toast sea visible
      setTimeout(() => {
        this.router.navigateByUrl('/dashbord');
      }, 3000); // 2000ms = 2 segundos
    } else {
      console.error("El formulario no es válido");
      this.message.add({ severity: 'error', summary: 'Error', detail: 'El formulario no es válido, por favor revise los campos' });
    }
  }

  onSignUp() {
    console.log("Redirigiendo al registro...");
    this.router.navigateByUrl('/registro');
  }
}
