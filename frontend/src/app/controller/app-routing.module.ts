import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './pages/home';
import { ProfilePage } from './pages/profile';
import { EventPage } from './pages/event';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'profile',
    component: ProfilePage
  },
  {
    path: 'event/:action/:tag/:datetime', // Action añadir
    component: EventPage
  },
  {
    path: 'event/:action/:event_id', // Action actualizar
    component: EventPage
  },
  { 
    path: '**', 
    pathMatch: 'full', 
    component: HomePage
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
