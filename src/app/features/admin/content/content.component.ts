import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Content {
  id: number;
  title: string;
  type: 'map' | 'template' | 'comment';
  author: string;
  status: 'published' | 'draft' | 'pending' | 'rejected';
  createdAt: Date;
  lastModified: Date;
  views: number;
}

@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent {
  content: Content[] = [
    {
      id: 1,
      title: 'Interactive World Map',
      type: 'map',
      author: 'John Doe',
      status: 'published',
      createdAt: new Date(),
      lastModified: new Date(),
      views: 1500,
    },
    {
      id: 2,
      title: 'City Template',
      type: 'template',
      author: 'Jane Smith',
      status: 'draft',
      createdAt: new Date(),
      lastModified: new Date(),
      views: 0,
    },
    {
      id: 3,
      title: 'User Comment',
      type: 'comment',
      author: 'Bob Johnson',
      status: 'pending',
      createdAt: new Date(),
      lastModified: new Date(),
      views: 0,
    },
  ];

  searchQuery = '';
  selectedType: string | null = null;
  selectedStatus: string | null = null;

  get filteredContent() {
    return this.content.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesType = !this.selectedType || item.type === this.selectedType;
      const matchesStatus =
        !this.selectedStatus || item.status === this.selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }

  updateContentStatus(content: Content, status: Content['status']) {
    content.status = status;
  }

  deleteContent(content: Content) {
    if (confirm(`Are you sure you want to delete ${content.title}?`)) {
      this.content = this.content.filter((c) => c.id !== content.id);
    }
  }

  getStatusColor(status: Content['status']): string {
    switch (status) {
      case 'published':
        return '#2ecc71';
      case 'draft':
        return '#f1c40f';
      case 'pending':
        return '#3498db';
      case 'rejected':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  }
}
