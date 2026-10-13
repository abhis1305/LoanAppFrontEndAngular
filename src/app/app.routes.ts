import { Routes } from '@angular/router';
import { Cibil } from './pages/cibil/cibil';

export const routes: Routes = [
  { path: 'cibil', component: Cibil },
  { path: '', redirectTo: 'cibil', pathMatch: 'full' }
];
