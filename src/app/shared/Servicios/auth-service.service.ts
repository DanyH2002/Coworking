import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private apiUrl = 'http://127.0.0.1:8000/api/auth';

  constructor(private http: HttpClient) { }

  getUserRole(): string {
    // Retorna el rol desde el localStorage
    return localStorage.getItem('rol') || '';
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        // Si la petición es exitosa, elimina los datos almacenados en localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        localStorage.removeItem('email');
        localStorage.removeItem('id');
        localStorage.removeItem('nombre');
        console.log('Sesión cerrada y datos eliminados del localStorage.');
      }),
      catchError((error) => {
        console.error('Error al cerrar sesión:', error);
        throw error; // Propaga el error para manejarlo en el componente si es necesario
      })
    );
  }

}
