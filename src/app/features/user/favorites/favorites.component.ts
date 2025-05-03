import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FavoriteMap {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: string;
  lastUpdated: string;
  views: number;
  tags: string[];
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="favorites-container">
      <div class="favorites-header">
        <h1>Favorites</h1>
        <div class="favorites-controls">
          <div class="search-box">
            <input
              type="text"
              placeholder="Search favorites..."
              [(ngModel)]="searchQuery"
              (input)="filterFavorites()"
            />
            <i>🔍</i>
          </div>
          <div class="sort-options">
            <select [(ngModel)]="sortBy" (change)="filterFavorites()">
              <option value="recent">Most Recent</option>
              <option value="views">Most Viewed</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>

      <div class="favorites-grid">
        <div class="favorite-card" *ngFor="let map of filteredFavorites">
          <div class="favorite-thumbnail">
            <img [src]="map.thumbnail" [alt]="map.title" />
            <div class="favorite-actions">
              <button class="action-btn" (click)="viewMap(map.id)">
                <i>👁️</i>
                <span>View</span>
              </button>
              <button class="action-btn" (click)="removeFavorite(map.id)">
                <i>⭐</i>
                <span>Remove</span>
              </button>
            </div>
          </div>
          <div class="favorite-info">
            <h3>{{ map.title }}</h3>
            <p>{{ map.description }}</p>
            <div class="favorite-meta">
              <span class="author">By {{ map.author }}</span>
              <span class="views">👁️ {{ map.views }}</span>
              <span class="updated">Updated {{ map.lastUpdated }}</span>
            </div>
            <div class="favorite-tags">
              <span class="tag" *ngFor="let tag of map.tags">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="no-favorites" *ngIf="filteredFavorites.length === 0">
        <p>No favorites found</p>
        <button class="explore-btn" (click)="exploreMaps()">
          Explore Maps
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .favorites-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .favorites-header {
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

      .favorites-controls {
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

      .sort-options select {
        padding: 0.75rem 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        background: white;
        color: #2c3e50;
        cursor: pointer;
      }

      .favorites-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
      }

      .favorite-card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition: transform 0.2s;
      }

      .favorite-card:hover {
        transform: translateY(-5px);
      }

      .favorite-thumbnail {
        position: relative;
        height: 200px;
        overflow: hidden;
      }

      .favorite-thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .favorite-actions {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        display: flex;
        gap: 0.5rem;
        opacity: 0;
        transition: opacity 0.2s;
      }

      .favorite-card:hover .favorite-actions {
        opacity: 1;
      }

      .action-btn {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.5rem;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
        transition: background 0.2s;
      }

      .action-btn:hover {
        background: white;
      }

      .favorite-info {
        padding: 1rem;
      }

      .favorite-info h3 {
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
      }

      .favorite-info p {
        margin: 0 0 0.5rem 0;
        color: #666;
        font-size: 0.9rem;
      }

      .favorite-meta {
        display: flex;
        gap: 1rem;
        margin-bottom: 0.5rem;
        font-size: 0.8rem;
        color: #95a5a6;
      }

      .favorite-tags {
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

      .no-favorites {
        text-align: center;
        padding: 4rem 2rem;
        color: #666;
      }

      .explore-btn {
        margin-top: 1rem;
        padding: 0.75rem 1.5rem;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .explore-btn:hover {
        background: #2980b9;
      }

      @media (max-width: 768px) {
        .favorites-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .favorites-controls {
          width: 100%;
          flex-direction: column;
        }

        .search-box input {
          width: 100%;
        }

        .favorites-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class FavoritesComponent {
  searchQuery = '';
  sortBy = 'recent';
  favorites: FavoriteMap[] = [
    {
      id: 'map1',
      title: 'World Population',
      description: 'Interactive visualization of global population trends',
      thumbnail: 'assets/images/map-preview-1.png',
      author: 'John Doe',
      lastUpdated: '2 days ago',
      views: 156,
      tags: ['Population', 'Global'],
    },
    {
      id: 'map2',
      title: 'Climate Change',
      description: 'Temperature changes across different regions',
      thumbnail: 'assets/images/map-preview-2.png',
      author: 'Jane Smith',
      lastUpdated: '1 week ago',
      views: 89,
      tags: ['Environment', 'Climate'],
    },
    {
      id: 'map3',
      title: 'Economic Growth',
      description: 'GDP growth rates by country',
      thumbnail: 'assets/images/map-preview-3.png',
      author: 'Mike Johnson',
      lastUpdated: '3 days ago',
      views: 234,
      tags: ['Economy', 'GDP'],
    },
  ];

  filteredFavorites: FavoriteMap[] = [];

  constructor() {
    this.filterFavorites();
  }

  filterFavorites() {
    let filtered = [...this.favorites];

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (map) =>
          map.title.toLowerCase().includes(query) ||
          map.description.toLowerCase().includes(query) ||
          map.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'views':
          return b.views - a.views;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'recent':
        default:
          return 0; // Assuming the array is already sorted by recent
      }
    });

    this.filteredFavorites = filtered;
  }

  viewMap(mapId: string) {
    // Implement map viewing logic
    console.log('Viewing map:', mapId);
  }

  removeFavorite(mapId: string) {
    // Implement remove from favorites logic
    console.log('Removing favorite:', mapId);
  }

  exploreMaps() {
    // Implement explore maps navigation
    console.log('Exploring maps');
  }
}
