import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Activity {
  id: number;
  type:
    | 'create'
    | 'edit'
    | 'delete'
    | 'share'
    | 'favorite'
    | 'comment'
    | 'view'
    | 'download';
  title: string;
  description: string;
  time: string;
  mapId?: string;
  userId?: string;
}

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="activity-container">
      <div class="activity-header">
        <h1>Activity</h1>
        <div class="activity-controls">
          <div class="activity-filters">
            <select [(ngModel)]="selectedFilter" (change)="filterActivities()">
              <option value="all">All Activity</option>
              <option value="maps">Map Actions</option>
              <option value="sharing">Sharing</option>
              <option value="favorites">Favorites</option>
              <option value="views">Views</option>
              <option value="downloads">Downloads</option>
            </select>
          </div>
          <div class="activity-search">
            <input
              type="text"
              placeholder="Search activities..."
              [(ngModel)]="searchQuery"
              (input)="filterActivities()"
            />
            <i>🔍</i>
          </div>
        </div>
      </div>

      <div class="activity-timeline">
        <div class="timeline-item" *ngFor="let activity of filteredActivities">
          <div class="timeline-icon" [class]="activity.type">
            <span [innerHTML]="getActivityIcon(activity.type)"></span>
          </div>
          <div class="timeline-content">
            <h3>{{ activity.title }}</h3>
            <p>{{ activity.description }}</p>
            <div class="timeline-footer">
              <span class="timeline-time">{{ activity.time }}</span>
              <div class="timeline-actions" *ngIf="activity.mapId">
                <button class="action-btn" (click)="viewMap(activity.mapId)">
                  <i>👁️</i>
                  <span>View Map</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="pagination" *ngIf="totalPages > 1">
          <button
            class="pagination-btn"
            [disabled]="currentPage === 1"
            (click)="previousPage()"
          >
            Previous
          </button>
          <span class="page-info">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            class="pagination-btn"
            [disabled]="currentPage === totalPages"
            (click)="nextPage()"
          >
            Next
          </button>
        </div>

        <div class="no-results" *ngIf="filteredActivities.length === 0">
          <p>No activities found matching your criteria</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .activity-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .activity-header {
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

      .activity-controls {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .activity-filters select {
        padding: 0.75rem 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        background: white;
        color: #2c3e50;
        cursor: pointer;
        min-width: 150px;
      }

      .activity-search {
        position: relative;
      }

      .activity-search input {
        padding: 0.75rem 2rem 0.75rem 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        width: 250px;
      }

      .activity-search i {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
      }

      .activity-timeline {
        position: relative;
        padding-left: 2rem;
      }

      .activity-timeline::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 2px;
        background: #eee;
      }

      .timeline-item {
        position: relative;
        padding-bottom: 2rem;
        display: flex;
        gap: 1rem;
        animation: fadeIn 0.3s ease;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .timeline-item:last-child {
        padding-bottom: 0;
      }

      .timeline-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        position: relative;
        z-index: 1;
        transition: transform 0.2s;
      }

      .timeline-icon:hover {
        transform: scale(1.1);
      }

      .timeline-icon::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: white;
        z-index: -1;
      }

      .timeline-icon.create {
        background: #3498db;
        color: white;
      }
      .timeline-icon.edit {
        background: #9b59b6;
        color: white;
      }
      .timeline-icon.delete {
        background: #e74c3c;
        color: white;
      }
      .timeline-icon.share {
        background: #2ecc71;
        color: white;
      }
      .timeline-icon.favorite {
        background: #f1c40f;
        color: white;
      }
      .timeline-icon.comment {
        background: #1abc9c;
        color: white;
      }
      .timeline-icon.view {
        background: #34495e;
        color: white;
      }
      .timeline-icon.download {
        background: #e67e22;
        color: white;
      }

      .timeline-content {
        flex: 1;
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s;
      }

      .timeline-content:hover {
        transform: translateX(5px);
      }

      .timeline-content h3 {
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
        font-size: 1rem;
      }

      .timeline-content p {
        margin: 0 0 0.5rem 0;
        color: #666;
      }

      .timeline-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.5rem;
      }

      .timeline-time {
        font-size: 0.8rem;
        color: #95a5a6;
      }

      .timeline-actions {
        display: flex;
        gap: 0.5rem;
      }

      .action-btn {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.25rem 0.5rem;
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

      .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin-top: 2rem;
      }

      .pagination-btn {
        padding: 0.5rem 1rem;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .pagination-btn:disabled {
        background: #bdc3c7;
        cursor: not-allowed;
      }

      .page-info {
        color: #666;
      }

      .no-results {
        text-align: center;
        padding: 2rem;
        color: #666;
      }

      @media (max-width: 768px) {
        .activity-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .activity-controls {
          width: 100%;
          flex-direction: column;
        }

        .activity-search input {
          width: 100%;
        }

        .activity-timeline {
          padding-left: 1rem;
        }

        .timeline-footer {
          flex-direction: column;
          gap: 0.5rem;
          align-items: flex-start;
        }
      }
    `,
  ],
})
export class ActivityComponent {
  selectedFilter = 'all';
  searchQuery = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  activities: Activity[] = [
    {
      id: 1,
      type: 'create',
      title: 'Created new map',
      description: 'World Population',
      time: '2 hours ago',
      mapId: 'map1',
    },
    {
      id: 2,
      type: 'share',
      title: 'Shared map',
      description: 'Climate Change with John',
      time: '5 hours ago',
      mapId: 'map2',
    },
    {
      id: 3,
      type: 'favorite',
      title: 'Added to favorites',
      description: 'Economic Growth',
      time: 'Yesterday',
      mapId: 'map3',
    },
    {
      id: 4,
      type: 'edit',
      title: 'Edited map',
      description: 'Population Density',
      time: '2 days ago',
      mapId: 'map4',
    },
    {
      id: 5,
      type: 'delete',
      title: 'Deleted map',
      description: 'Old Project',
      time: '3 days ago',
    },
    {
      id: 6,
      type: 'view',
      title: 'Viewed map',
      description: 'Global Temperature',
      time: '1 hour ago',
      mapId: 'map5',
    },
    {
      id: 7,
      type: 'download',
      title: 'Downloaded map data',
      description: 'Population Growth',
      time: '4 hours ago',
      mapId: 'map6',
    },
    {
      id: 8,
      type: 'comment',
      title: 'Added comment',
      description: 'Great visualization!',
      time: 'Yesterday',
      mapId: 'map7',
    },
  ];

  filteredActivities: Activity[] = [];

  constructor() {
    this.filterActivities();
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      create: '📝',
      edit: '✏️',
      delete: '🗑️',
      share: '🔗',
      favorite: '⭐',
      comment: '💬',
      view: '👁️',
      download: '⬇️',
    };
    return icons[type] || '📋';
  }

  filterActivities() {
    let filtered = [...this.activities];

    // Apply type filter
    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter((activity) => {
        switch (this.selectedFilter) {
          case 'maps':
            return ['create', 'edit', 'delete'].includes(activity.type);
          case 'sharing':
            return activity.type === 'share';
          case 'favorites':
            return activity.type === 'favorite';
          case 'views':
            return activity.type === 'view';
          case 'downloads':
            return activity.type === 'download';
          default:
            return true;
        }
      });
    }

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (activity) =>
          activity.title.toLowerCase().includes(query) ||
          activity.description.toLowerCase().includes(query)
      );
    }

    // Calculate pagination
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredActivities = filtered.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filterActivities();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filterActivities();
    }
  }

  viewMap(mapId: string) {
    // Implement map viewing logic
    console.log('Viewing map:', mapId);
  }
}
