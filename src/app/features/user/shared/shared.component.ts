import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SharedMap {
  id: string;
  title: string;
  sharedWith: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    permission: 'view' | 'edit';
  }[];
  lastModified: string;
  accessLevel: 'public' | 'private' | 'restricted';
}

@Component({
  selector: 'app-shared',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="shared-container">
      <div class="shared-header">
        <h1>Shared Maps</h1>
        <div class="shared-controls">
          <div class="search-box">
            <input
              type="text"
              placeholder="Search shared maps..."
              [(ngModel)]="searchQuery"
              (input)="filterSharedMaps()"
            />
            <i>🔍</i>
          </div>
          <div class="filter-options">
            <select [(ngModel)]="accessFilter" (change)="filterSharedMaps()">
              <option value="all">All Access Levels</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="restricted">Restricted</option>
            </select>
          </div>
        </div>
      </div>

      <div class="shared-list">
        <div class="shared-item" *ngFor="let map of filteredSharedMaps">
          <div class="shared-info">
            <h3>{{ map.title }}</h3>
            <div class="shared-meta">
              <span class="access-level" [class]="map.accessLevel">
                {{ map.accessLevel }}
              </span>
              <span class="last-modified">
                Last modified: {{ map.lastModified }}
              </span>
            </div>
            <div class="shared-users">
              <div class="user-avatar" *ngFor="let user of map.sharedWith">
                <img [src]="user.avatar" [alt]="user.name" />
                <span class="tooltip">
                  {{ user.name }}
                  <br />
                  {{ user.permission }} access
                </span>
              </div>
            </div>
          </div>
          <div class="shared-actions">
            <button class="action-btn" (click)="manageAccess(map.id)">
              <i>👥</i>
              <span>Manage Access</span>
            </button>
            <button class="action-btn" (click)="viewMap(map.id)">
              <i>👁️</i>
              <span>View Map</span>
            </button>
          </div>
        </div>
      </div>

      <div class="no-shared" *ngIf="filteredSharedMaps.length === 0">
        <p>No shared maps found</p>
        <button class="share-btn" (click)="shareNewMap()">Share a Map</button>
      </div>
    </div>
  `,
  styles: [
    `
      .shared-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .shared-header {
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

      .shared-controls {
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

      .filter-options select {
        padding: 0.75rem 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        background: white;
        color: #2c3e50;
        cursor: pointer;
      }

      .shared-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .shared-item {
        background: white;
        border-radius: 8px;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s;
      }

      .shared-item:hover {
        transform: translateX(5px);
      }

      .shared-info h3 {
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
      }

      .shared-meta {
        display: flex;
        gap: 1rem;
        margin-bottom: 0.5rem;
        font-size: 0.8rem;
        color: #95a5a6;
      }

      .access-level {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        text-transform: capitalize;
      }

      .access-level.public {
        background: #2ecc71;
        color: white;
      }

      .access-level.private {
        background: #e74c3c;
        color: white;
      }

      .access-level.restricted {
        background: #f1c40f;
        color: white;
      }

      .shared-users {
        display: flex;
        gap: 0.5rem;
      }

      .user-avatar {
        position: relative;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        overflow: hidden;
      }

      .user-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .tooltip {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: #2c3e50;
        color: white;
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: all 0.2s;
        z-index: 1000;
      }

      .user-avatar:hover .tooltip {
        opacity: 1;
        visibility: visible;
        bottom: calc(100% + 5px);
      }

      .shared-actions {
        display: flex;
        gap: 0.5rem;
      }

      .action-btn {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.5rem 1rem;
        background: #f5f5f5;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
        transition: background 0.2s;
      }

      .action-btn:hover {
        background: #e0e0e0;
      }

      .no-shared {
        text-align: center;
        padding: 4rem 2rem;
        color: #666;
      }

      .share-btn {
        margin-top: 1rem;
        padding: 0.75rem 1.5rem;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .share-btn:hover {
        background: #2980b9;
      }

      @media (max-width: 768px) {
        .shared-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .shared-controls {
          width: 100%;
          flex-direction: column;
        }

        .search-box input {
          width: 100%;
        }

        .shared-item {
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }

        .shared-actions {
          width: 100%;
          justify-content: flex-end;
        }
      }
    `,
  ],
})
export class SharedComponent {
  searchQuery = '';
  accessFilter = 'all';
  sharedMaps: SharedMap[] = [
    {
      id: 'map1',
      title: 'World Population',
      sharedWith: [
        {
          id: 'user1',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'assets/images/avatar1.png',
          permission: 'edit',
        },
        {
          id: 'user2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          avatar: 'assets/images/avatar2.png',
          permission: 'view',
        },
      ],
      lastModified: '2 hours ago',
      accessLevel: 'public',
    },
    {
      id: 'map2',
      title: 'Climate Change',
      sharedWith: [
        {
          id: 'user3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          avatar: 'assets/images/avatar3.png',
          permission: 'edit',
        },
      ],
      lastModified: '1 day ago',
      accessLevel: 'restricted',
    },
    {
      id: 'map3',
      title: 'Economic Growth',
      sharedWith: [],
      lastModified: '3 days ago',
      accessLevel: 'private',
    },
  ];

  filteredSharedMaps: SharedMap[] = [];

  constructor() {
    this.filterSharedMaps();
  }

  filterSharedMaps() {
    let filtered = [...this.sharedMaps];

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter((map) =>
        map.title.toLowerCase().includes(query)
      );
    }

    // Apply access level filter
    if (this.accessFilter !== 'all') {
      filtered = filtered.filter(
        (map) => map.accessLevel === this.accessFilter
      );
    }

    this.filteredSharedMaps = filtered;
  }

  manageAccess(mapId: string) {
    // Implement access management logic
    console.log('Managing access for map:', mapId);
  }

  viewMap(mapId: string) {
    // Implement map viewing logic
    console.log('Viewing map:', mapId);
  }

  shareNewMap() {
    // Implement new map sharing logic
    console.log('Sharing new map');
  }
}
