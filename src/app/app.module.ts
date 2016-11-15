import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Resolve }   from '@angular/router';

import { AppComponent } from './app.component';
import { ContactStore } from './store/contacts';
import { ContactsService } from './contacts.service';
import { ContactsComponent } from './contacts/contacts.component';
import { NoContactSelectedComponent } from './no-contact-selected/no-contact-selected.component';
import { NewContactComponent } from './new-contact/new-contact.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { ContactFormComponent, ContactFormFooter, ContactFormHeader } from './contact-form/contact-form.component';
import { ExportButtonComponent } from './export-button/export-button.component';
import { ExportService } from './export.service';
import { StatefulButtonModule } from 'ng2-stateful-button'
import { Observable } from 'rxjs/Rx';
import { AirportDirective } from './airport.directive'
import { BirdService } from './bird.service';
import { StatefulButtonModule } from 'ng2-stateful-button';

@Injectable()
export class InitialResolve implements Resolve<void> {
  constructor(private contactsService: ContactsService, private contactStore: ContactStore) {}

  resolve(): Promise<void> {
    this.contactStore.setIsInitializing(true);
    let pr = new Promise<void>((resolve, reject) => {
      Observable.zip(this.contactsService.listContacts(), this.contactsService.listGroups())
      .subscribe(
        (result) => {
          this.contactStore.setContactsAndGroups(result[0], result[1]);
          this.contactStore.setIsInitializing(false);
          resolve();
        },
        () => {
          this.contactStore.setIsInitializing(false);
          reject();
        }
      );
    });
    return pr;
  }
}

@NgModule({
  declarations: [
    AppComponent,
    ContactsComponent,
    NoContactSelectedComponent,
    NewContactComponent,
    ContactComponent,
    HomeComponent,
    ContactFormComponent,
    ContactFormHeader,
    ContactFormFooter,
    ExportButtonComponent,
    AirportDirective,
    // StatefulButtonDirective
  ],
  imports: [
    StatefulButtonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    StatefulButtonModule,
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent,
        resolve: {
          isInitialized: InitialResolve
        },
        children: [
          {
            path: '',
            component: NoContactSelectedComponent
          },
          {
            path: 'new',
            component: NewContactComponent
          },
          {
            path: 'contact/:id',
            component: ContactComponent
          }
        ]
      }
    ])
  ],
  providers: [ ContactStore, ContactsService, InitialResolve, ExportService, BirdService ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor() {}

}
