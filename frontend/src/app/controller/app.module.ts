import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Home } from './pages/home';
import { Header } from './components/header';
import { ModalAccess } from './components/modalAccess';
import { LoginForm } from './components/loginForm';
import { Calendar } from './components/calendar';

@NgModule({
  declarations: [
    AppComponent,
    Home,
    Header,
    ModalAccess,
    LoginForm,
    Calendar
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    FullCalendarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
