import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface MapTemplate {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  uses: number;
  rating: number;
  author: string;
  tags: string[];
}

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="templates-container">
      <div class="templates-header">
        <h1>Map Templates</h1>
        <div class="templates-controls">
          <div class="search-box">
            <input
              type="text"
              placeholder="Search templates..."
              [(ngModel)]="searchQuery"
              (input)="filterTemplates()"
            />
            <i>🔍</i>
          </div>
          <div class="filter-options">
            <select [(ngModel)]="categoryFilter" (change)="filterTemplates()">
              <option value="all">All Categories</option>
              <option value="population">Population</option>
              <option value="climate">Climate</option>
              <option value="economy">Economy</option>
              <option value="health">Health</option>
              <option value="education">Education</option>
            </select>
            <select [(ngModel)]="sortBy" (change)="filterTemplates()">
              <option value="popular">Most Popular</option>
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div class="templates-grid">
        <div class="template-card" *ngFor="let template of filteredTemplates">
          <div class="template-thumbnail">
            <img [src]="template.thumbnail" [alt]="template.title" />
            <div class="template-overlay">
              <button class="use-btn" (click)="useTemplate(template.id)">
                Use Template
              </button>
              <button
                class="preview-btn"
                (click)="previewTemplate(template.id)"
              >
                Preview
              </button>
            </div>
          </div>
          <div class="template-info">
            <h3>{{ template.title }}</h3>
            <p>{{ template.description }}</p>
            <div class="template-meta">
              <span class="category">{{ template.category }}</span>
              <span class="uses">👥 {{ template.uses }} uses</span>
              <span class="rating">⭐ {{ template.rating }}/5</span>
            </div>
            <div class="template-author">
              <span>By {{ template.author }}</span>
            </div>
            <div class="template-tags">
              <span class="tag" *ngFor="let tag of template.tags">{{
                tag
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="no-templates" *ngIf="filteredTemplates.length === 0">
        <p>No templates found matching your criteria</p>
        <button class="create-btn" (click)="createTemplate()">
          Create New Template
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .templates-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .templates-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
      }

      h1 {
        color: #2c3e50;
        margin: 0;
        font-size: 2rem;
      }

      .templates-controls {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .search-box {
        position: relative;
      }

      .search-box input {
        padding: 0.75rem 2rem 0.75rem 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        width: 250px;
      }

      .search-box i {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
      }

      .filter-options {
        display: flex;
        gap: 1rem;
      }

      .filter-options select {
        padding: 0.75rem 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        background: white;
        color: #2c3e50;
        cursor: pointer;
      }

      .templates-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
      }

      .template-card {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s;
      }

      .template-card:hover {
        transform: translateY(-5px);
      }

      .template-thumbnail {
        position: relative;
        height: 200px;
        overflow: hidden;
      }

      .template-thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .template-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        opacity: 0;
        transition: opacity 0.2s;
      }

      .template-card:hover .template-overlay {
        opacity: 1;
      }

      .use-btn,
      .preview-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.2s;
      }

      .use-btn {
        background: #3498db;
        color: white;
      }

      .use-btn:hover {
        background: #2980b9;
      }

      .preview-btn {
        background: white;
        color: #2c3e50;
      }

      .preview-btn:hover {
        background: #f5f5f5;
      }

      .template-info {
        padding: 1rem;
      }

      .template-info h3 {
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
      }

      .template-info p {
        margin: 0 0 0.5rem 0;
        color: #666;
        font-size: 0.9rem;
      }

      .template-meta {
        display: flex;
        gap: 1rem;
        margin-bottom: 0.5rem;
        font-size: 0.8rem;
        color: #95a5a6;
      }

      .category {
        padding: 0.25rem 0.5rem;
        background: #f5f5f5;
        border-radius: 4px;
        color: #2c3e50;
      }

      .template-author {
        margin-bottom: 0.5rem;
        font-size: 0.8rem;
        color: #95a5a6;
      }

      .template-tags {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .tag {
        padding: 0.25rem 0.5rem;
        background: #f5f5f5;
        border-radius: 4px;
        font-size: 0.8rem;
        color: #666;
      }

      .no-templates {
        text-align: center;
        padding: 4rem 2rem;
        color: #666;
      }

      .create-btn {
        margin-top: 1rem;
        padding: 0.75rem 1.5rem;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .create-btn:hover {
        background: #2980b9;
      }

      @media (max-width: 768px) {
        .templates-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .templates-controls {
          width: 100%;
          flex-direction: column;
        }

        .search-box input {
          width: 100%;
        }

        .filter-options {
          width: 100%;
          flex-direction: column;
        }

        .templates-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class TemplatesComponent {
  searchQuery = '';
  categoryFilter = 'all';
  sortBy = 'popular';
  templates: MapTemplate[] = [
    {
      id: 'template1',
      title: 'Population Density',
      description: 'Visualize population distribution across regions',
      thumbnail: 'assets/images/template1.png',
      category: 'population',
      uses: 156,
      rating: 4.8,
      author: 'John Doe',
      tags: ['Population', 'Density', 'Global'],
    },
    {
      id: 'template2',
      title: 'Climate Change',
      description: 'Track temperature changes over time',
      thumbnail: 'assets/images/template2.png',
      category: 'climate',
      uses: 89,
      rating: 4.5,
      author: 'Jane Smith',
      tags: ['Climate', 'Temperature', 'Environment'],
    },
    {
      id: 'template3',
      title: 'GDP Growth',
      description: 'Compare economic growth across countries',
      thumbnail: 'assets/images/template3.png',
      category: 'economy',
      uses: 234,
      rating: 4.9,
      author: 'Mike Johnson',
      tags: ['Economy', 'GDP', 'Growth'],
    },
    {
      id: 'template4',
      title: 'Healthcare Access',
      description: 'Analyze healthcare coverage by region',
      thumbnail: 'assets/images/template4.png',
      category: 'health',
      uses: 67,
      rating: 4.3,
      author: 'Sarah Wilson',
      tags: ['Health', 'Access', 'Coverage'],
    },
    {
      id: 'template5',
      title: 'Education Rates',
      description: 'Compare education levels worldwide',
      thumbnail: 'assets/images/template5.png',
      category: 'education',
      uses: 98,
      rating: 4.6,
      author: 'David Brown',
      tags: ['Education', 'Literacy', 'Schools'],
    },
  ];

  filteredTemplates: MapTemplate[] = [];

  constructor() {
    this.filterTemplates();
  }

  filterTemplates() {
    let filtered = [...this.templates];

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (template) =>
          template.title.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query) ||
          template.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (this.categoryFilter !== 'all') {
      filtered = filtered.filter(
        (template) => template.category === this.categoryFilter
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'popular':
          return b.uses - a.uses;
        case 'rating':
          return b.rating - a.rating;
        case 'recent':
        default:
          return 0; // Assuming the array is already sorted by recent
      }
    });

    this.filteredTemplates = filtered;
  }

  useTemplate(templateId: string) {
    // Implement template usage logic
    console.log('Using template:', templateId);
  }

  previewTemplate(templateId: string) {
    // Implement template preview logic
    console.log('Previewing template:', templateId);
  }

  createTemplate() {
    // Implement template creation logic
    console.log('Creating new template');
  }
}
