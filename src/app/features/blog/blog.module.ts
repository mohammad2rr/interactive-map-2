import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogCreateComponent } from './components/blog-create/blog-create.component';
import { BlogDetailComponent } from './components/blog-detail/blog-detail.component';
import { BlogApprovalComponent } from './components/blog-approval/blog-approval.component';

const routes: Routes = [
  { path: '', component: BlogListComponent },
  { path: 'create', component: BlogCreateComponent },
  { path: ':id', component: BlogDetailComponent },
  { path: 'admin/approval', component: BlogApprovalComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogModule {}
