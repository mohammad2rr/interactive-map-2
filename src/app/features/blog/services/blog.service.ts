import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Blog, BlogCreateDto, BlogUpdateDto } from '../models/blog.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private apiUrl = `${environment.apiUrl}/blogs`;

  constructor(private http: HttpClient) {}

  // Create a new blog
  createBlog(blogData: BlogCreateDto): Observable<Blog> {
    return this.http.post<Blog>(this.apiUrl, blogData);
  }

  // Get all blogs
  getAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrl);
  }

  // Get blogs by author
  getBlogsByAuthor(authorId: string): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.apiUrl}/author/${authorId}`);
  }

  // Get blog by ID
  getBlogById(id: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/${id}`);
  }

  // Update blog
  updateBlog(id: string, blogData: BlogUpdateDto): Observable<Blog> {
    return this.http.put<Blog>(`${this.apiUrl}/${id}`, blogData);
  }

  // Delete blog
  deleteBlog(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Admin functions
  approveBlog(id: string, message?: string): Observable<Blog> {
    return this.http.put<Blog>(`${this.apiUrl}/${id}/approve`, { message });
  }

  rejectBlog(id: string, reason: string): Observable<Blog> {
    return this.http.put<Blog>(`${this.apiUrl}/${id}/reject`, { reason });
  }

  // Get pending blogs (admin only)
  getPendingBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.apiUrl}/pending`);
  }
}
