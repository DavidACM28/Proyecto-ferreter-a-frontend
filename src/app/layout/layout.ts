import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from "./components/sidebar/sidebar";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
})
export class LayoutComponent {
  pageTitle: string = 'Dashboard';
  rout = inject(Router);

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.pageTitle = this.getPageTitle(event.urlAfterRedirects);
      });
  }

  private getPageTitle(url: string): string {
    if (url.includes('dashboard')) return 'Dashboard';
    if (url.includes('ventas')) return 'Ventas';
    if (url.includes('productos')) return 'Productos';
    if (url.includes('stock')) return 'Stock';
    if (url.includes('movimientos')) return 'Movimientos';
    if (url.includes('reportes')) return 'Reportes';
    if (url.includes('configuracion')) return 'Configuración';
    if (url.includes('ayuda')) return 'Ayuda';
    return 'Sistema de Ventas e Inventario';
  }
  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }
}
