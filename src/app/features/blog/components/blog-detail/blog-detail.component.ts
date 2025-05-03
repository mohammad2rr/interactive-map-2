import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div *ngIf="blog" class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold mb-4">{{ blog.title }}</h1>

        <div class="flex items-center text-gray-600 mb-8">
          <span>By {{ blog.authorName }}</span>
          <span class="mx-2">•</span>
          <span>{{ blog.createdAt | date : 'mediumDate' }}</span>
          <span *ngIf="blog.status === 'rejected'" class="ml-4 text-red-500">
            Rejected: {{ blog.rejectionReason }}
          </span>
          <span *ngIf="blog.status === 'pending'" class="ml-4 text-yellow-500">
            Pending Approval
          </span>
        </div>

        <div class="prose max-w-none mb-8">
          <p class="whitespace-pre-line">{{ blog.content }}</p>
        </div>

        <div *ngIf="blog.tags && blog.tags.length > 0" class="mb-8">
          <h2 class="text-xl font-semibold mb-2">Tags</h2>
          <div class="flex flex-wrap gap-2">
            <span
              *ngFor="let tag of blog.tags"
              class="bg-gray-200 px-3 py-1 rounded-full text-sm"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <div *ngIf="blog.adminMessage" class="bg-blue-50 p-4 rounded-lg mb-8">
          <h3 class="text-lg font-semibold mb-2">Admin Message</h3>
          <p>{{ blog.adminMessage }}</p>
        </div>

        <div class="border-t pt-8">
          <h2 class="text-xl font-semibold mb-4">Map Information</h2>
          <p>Map ID: {{ blog.mapId }}</p>
          <p>Area ID: {{ blog.areaId }}</p>
        </div>
      </div>
    </div>
  `,
})
export class BlogDetailComponent implements OnInit {
  blog: Blog | null = null;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    const blogId = this.route.snapshot.paramMap.get('id');
    if (blogId) {
      this.loadBlog(blogId);
    }
  }

  private loadBlog(id: string): void {
    this.blogService.getBlogById(id).subscribe({
      next: (blog) => {
        this.blog = blog;
      },
      error: (error) => {
        console.error('Error loading blog:', error);
      },
    });
  }
}
