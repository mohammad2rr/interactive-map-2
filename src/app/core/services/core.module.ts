import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [provideHttpClient()],
  exports: [],
})
export class CoreModule {}
