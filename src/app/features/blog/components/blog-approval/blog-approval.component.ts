import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog-approval',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Blog Approval Dashboard</h1>
      <div class="grid grid-cols-1 gap-6">
        <div
          *ngFor="let blog of pendingBlogs"
          class="bg-white rounded-lg shadow-md p-6"
        >
          <h2 class="text-xl font-semibold mb-2">{{ blog.title }}</h2>
          <p class="text-gray-600 mb-4">
            {{ blog.content | slice : 0 : 300 }}...
          </p>
          <div class="mb-4">
            <p class="text-sm text-gray-500">Author: {{ blog.authorName }}</p>
            <p class="text-sm text-gray-500">Map ID: {{ blog.mapId }}</p>
            <p class="text-sm text-gray-500">Area ID: {{ blog.areaId }}</p>
          </div>

          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="message-{{ blog.id }}"
              >Message to Author</label
            >
            <textarea
              id="message-{{ blog.id }}"
              [(ngModel)]="blogMessages[blog.id]"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="3"
            ></textarea>
          </div>

          <div class="flex justify-between items-center">
            <button
              (click)="approveBlog(blog.id)"
              class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Approve
            </button>
            <button
              (click)="rejectBlog(blog.id)"
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class BlogApprovalComponent implements OnInit {
  pendingBlogs: Blog[] = [];
  blogMessages: { [key: string]: string } = {};

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadPendingBlogs();
  }

  private loadPendingBlogs(): void {
    this.blogService.getPendingBlogs().subscribe({
      next: (blogs) => {
        this.pendingBlogs = blogs;
      },
      error: (error) => {
        console.error('Error loading pending blogs:', error);
      },
    });
  }

  approveBlog(blogId: string): void {
    const message = this.blogMessages[blogId];
    this.blogService.approveBlog(blogId, message).subscribe({
      next: () => {
        this.loadPendingBlogs();
        delete this.blogMessages[blogId];
      },
      error: (error) => {
        console.error('Error approving blog:', error);
      },
    });
  }

  rejectBlog(blogId: string): void {
    const reason = this.blogMessages[blogId];
    if (!reason) {
      alert('Please provide a reason for rejection');
      return;
    }

    this.blogService.rejectBlog(blogId, reason).subscribe({
      next: () => {
        this.loadPendingBlogs();
        delete this.blogMessages[blogId];
      },
      error: (error) => {
        console.error('Error rejecting blog:', error);
      },
    });
  }
}
