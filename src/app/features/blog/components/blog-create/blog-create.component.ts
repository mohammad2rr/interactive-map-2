import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { BlogService } from '../../services/blog.service';
import { BlogCreateDto } from '../../models/blog.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Create New Blog Post</h1>
      <form
        [formGroup]="blogForm"
        (ngSubmit)="onSubmit()"
        class="max-w-2xl mx-auto"
      >
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="title"
            >Title</label
          >
          <input
            id="title"
            type="text"
            formControlName="title"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="content"
            >Content</label
          >
          <textarea
            id="content"
            formControlName="content"
            rows="10"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="mapId"
            >Map ID</label
          >
          <input
            id="mapId"
            type="text"
            formControlName="mapId"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="areaId"
            >Area ID</label
          >
          <input
            id="areaId"
            type="text"
            formControlName="areaId"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="tags"
            >Tags (comma separated)</label
          >
          <input
            id="tags"
            type="text"
            formControlName="tags"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div class="flex items-center justify-between">
          <button
            type="submit"
            [disabled]="!blogForm.valid"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Blog
          </button>
        </div>
      </form>
    </div>
  `,
})
export class BlogCreateComponent {
  blogForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private router: Router
  ) {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(100)]],
      mapId: ['', Validators.required],
      areaId: ['', Validators.required],
      tags: [''],
    });
  }

  onSubmit(): void {
    if (this.blogForm.valid) {
      const blogData: BlogCreateDto = {
        ...this.blogForm.value,
        tags: this.blogForm.value.tags
          ? this.blogForm.value.tags.split(',').map((tag: string) => tag.trim())
          : [],
      };

      this.blogService.createBlog(blogData).subscribe({
        next: () => {
          this.router.navigate(['/blog']);
        },
        error: (error) => {
          console.error('Error creating blog:', error);
        },
      });
    }
  }
}
