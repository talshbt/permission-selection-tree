import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { MultiSelectSearchComponent } from './multi-select-search/multi-select-search.component';
import { TreeDynamicComponent } from './tree-dynamic/tree-dynamic.component';
import { TreeChecklistComponent } from './tree-checklist/tree-checklist.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    MaterialModule
  ],
  declarations: [
    AppComponent,
    MultiSelectSearchComponent,
    TreeDynamicComponent,
    TreeChecklistComponent,
  ],

  entryComponents: [TreeChecklistComponent],
  bootstrap: [AppComponent],
  providers: []
})
export class AppModule {}
