import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import type { ChartConfiguration } from 'chart.js';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: Date;
}

interface ContentItem {
  id: number;
  title: string;
  type: 'map' | 'template' | 'comment';
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  submittedAt: Date;
}

interface SystemMetric {
  cpu: number;
  memory: number;
  storage: number;
  uptime: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  // Sample data - replace with real data from your backend
  users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'User',
      status: 'active',
      lastLogin: new Date(),
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Admin',
      status: 'active',
      lastLogin: new Date(),
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'User',
      status: 'suspended',
      lastLogin: new Date(),
    },
  ];

  contentQueue: ContentItem[] = [
    {
      id: 1,
      title: 'New Map Template',
      type: 'template',
      status: 'pending',
      submittedBy: 'John Doe',
      submittedAt: new Date(),
    },
    {
      id: 2,
      title: 'Interactive Map',
      type: 'map',
      status: 'pending',
      submittedBy: 'Jane Smith',
      submittedAt: new Date(),
    },
    {
      id: 3,
      title: 'User Comment',
      type: 'comment',
      status: 'pending',
      submittedBy: 'Bob Johnson',
      submittedAt: new Date(),
    },
  ];

  systemMetrics: SystemMetric = {
    cpu: 45,
    memory: 60,
    storage: 75,
    uptime: '7 days, 12 hours',
  };

  // Chart configurations
  userGrowthChart: ChartConfiguration<'line'> = {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'New Users',
          data: [65, 59, 80, 81, 56, 55],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  contentStatsChart: ChartConfiguration<'doughnut'> = {
    type: 'doughnut',
    data: {
      labels: ['Maps', 'Templates', 'Comments'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  // Quick actions
  quickActions = [
    { icon: 'add', label: 'Create User', action: () => this.createUser() },
    {
      icon: 'settings',
      label: 'System Settings',
      action: () => this.openSettings(),
    },
    {
      icon: 'notifications',
      label: 'Send Announcement',
      action: () => this.sendAnnouncement(),
    },
    {
      icon: 'backup',
      label: 'Backup Database',
      action: () => this.backupDatabase(),
    },
  ];

  // Methods
  createUser() {
    // Implement create user logic
  }

  openSettings() {
    // Implement settings logic
  }

  sendAnnouncement() {
    // Implement announcement logic
  }

  backupDatabase() {
    // Implement backup logic
  }

  approveContent(item: ContentItem) {
    // Implement content approval logic
  }

  rejectContent(item: ContentItem) {
    // Implement content rejection logic
  }

  updateUserStatus(user: User, status: User['status']) {
    // Implement user status update logic
  }
}
