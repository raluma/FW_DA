import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home';
import { Profile } from './pages/profile';
import { Event } from './pages/event';

const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'profile',
    component: Profile
  },
  {
    path: 'event/:action/:datetime',
    component: Event
  },
  {
    path: 'event/:action/:short_desc/:datetime',
    component: Event
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
