import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Map {
  id: number;
  title: string;
  description: string;
  author: string;
  status: 'published' | 'draft' | 'pending' | 'rejected';
  type: 'public' | 'private' | 'shared';
  views: number;
  createdAt: Date;
  lastModified: Date;
  tags: string[];
}

@Component({
  selector: 'app-admin-maps',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
})
export class MapsComponent {
  maps: Map[] = [
    {
      id: 1,
      title: 'World Population Density',
      description:
        'Interactive map showing population density across the world',
      author: 'John Doe',
      status: 'published',
      type: 'public',
      views: 1500,
      createdAt: new Date(),
      lastModified: new Date(),
      tags: ['population', 'world', 'density'],
    },
    {
      id: 2,
      title: 'Climate Change Impact',
      description: 'Map showing the effects of climate change over time',
      author: 'Jane Smith',
      status: 'pending',
      type: 'public',
      views: 0,
      createdAt: new Date(),
      lastModified: new Date(),
      tags: ['climate', 'environment', 'change'],
    },
    {
      id: 3,
      title: 'Economic Growth Analysis',
      description: 'Private map for economic research',
      author: 'Bob Johnson',
      status: 'draft',
      type: 'private',
      views: 0,
      createdAt: new Date(),
      lastModified: new Date(),
      tags: ['economy', 'growth', 'analysis'],
    },
  ];

  searchQuery = '';
  selectedStatus: string | null = null;
  selectedType: string | null = null;

  get filteredMaps() {
    return this.maps.filter((map) => {
      const matchesSearch =
        map.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        map.description
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        map.author.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus =
        !this.selectedStatus || map.status === this.selectedStatus;
      const matchesType = !this.selectedType || map.type === this.selectedType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }

  updateMapStatus(map: Map, status: Map['status']) {
    map.status = status;
  }

  updateMapType(map: Map, type: Map['type']) {
    map.type = type;
  }

  deleteMap(map: Map) {
    if (confirm(`Are you sure you want to delete the map "${map.title}"?`)) {
      this.maps = this.maps.filter((m) => m.id !== map.id);
    }
  }

  getStatusColor(status: Map['status']): string {
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

  getTypeColor(type: Map['type']): string {
    switch (type) {
      case 'public':
        return '#2ecc71';
      case 'private':
        return '#e74c3c';
      case 'shared':
        return '#3498db';
      default:
        return '#95a5a6';
    }
  }
}
