import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Blog Posts</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          *ngFor="let blog of blogs"
          class="bg-white rounded-lg shadow-md p-6"
        >
          <h2 class="text-xl font-semibold mb-2">{{ blog.title }}</h2>
          <p class="text-gray-600 mb-4">
            {{ blog.content | slice : 0 : 150 }}...
          </p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">By {{ blog.authorName }}</span>
            <a
              [routerLink]="['/blog', blog.id]"
              class="text-blue-500 hover:text-blue-700"
              >Read More</a
            >
          </div>
        </div>
      </div>
    </div>
  `,
})
export class BlogListComponent implements OnInit {
  blogs: Blog[] = [];

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  private loadBlogs(): void {
    this.blogService.getAllBlogs().subscribe({
      next: (blogs) => {
        this.blogs = blogs;
      },
      error: (error) => {
        console.error('Error loading blogs:', error);
      },
    });
  }
}
