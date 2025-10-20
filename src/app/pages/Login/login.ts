import { Component, inject, OnInit } from '@angular/core';
import { Acceso } from '../../services/acceso';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '../../modelos/login';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent implements OnInit{

  private accesoSerivce = inject(Acceso);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);

  public formLogin: FormGroup = this.formBuild.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor() { }
  ngOnInit(): void {
    if(localStorage.getItem('token') != null || localStorage.getItem('token') != ""){
      this.router.navigate(['ventas']);
    }
  }

  login() {
    if(this.formLogin.invalid) return;

    const login:Login = {
      username: this.formLogin.value.username,
      password: this.formLogin.value.password
    }

    this.accesoSerivce.login(login).subscribe({      
      next: (res) => {
        localStorage.setItem('token', res.accessToken);
        localStorage.setItem('idTrabajador', res.trabajador.idTrabajador.toString());
        this.router.navigate(['ventas']);
      },
      error: (err) => {
        if (err.status === 401) {
          alert('Usuario o contraseña incorrectos');
        } else {
          alert('Error inesperado');
        }
      }
    });
  }
}

