import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout';

// Componentes standalone
import { DashboardComponent } from './pages/dashboard/dashboard/dashboard';
import { VentasComponent } from './pages/ventas/ventas';
import { ProductosComponent } from './pages/productos/productos/productos';
import { StockComponent } from './pages/stock/stock/stock';
import { MovimientosComponent } from './pages/movimientos/movimientos/movimientos';
import { ReportesComponent } from './pages/reportes/reportes/reportes';
import { ConfiguracionComponent } from './pages/configuracion/configuracion/configuracion';
import { RegistrosVentasComponent } from './pages/registros-ventas/registros-ventas';
import { LoginComponent } from './pages/Login/login';
import { authGuard } from './custom/auth-guard';

export const routes: Routes = [
  // Ruta principal: redirige al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login fuera del layout
  { path: 'login', component: LoginComponent },

  // Rutas dentro del Layout
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
      { path: 'ventas', component: VentasComponent, canActivate: [authGuard] },
      { path: 'productos', component: ProductosComponent, canActivate: [authGuard] },
      { path: 'stock', component: StockComponent, canActivate: [authGuard] },
      { path: 'movimientos', component: MovimientosComponent, canActivate: [authGuard] },
      { path: 'reportes', component: ReportesComponent, canActivate: [authGuard] },
      { path: 'configuracion', component: ConfiguracionComponent, canActivate: [authGuard] },
      { path: 'registros-ventas', component: RegistrosVentasComponent, canActivate: [authGuard] },
    ],
  },

  // Catch-all: redirige a login si no se encuentra la ruta
  { path: '**', redirectTo: 'login' }
];