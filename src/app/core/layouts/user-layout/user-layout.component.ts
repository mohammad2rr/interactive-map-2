import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss'],
})
export class UserLayoutComponent {
  isCollapsed = false;
  showProfileMenu = false;
  searchQuery = '';
  isSidebarOpen = false;

  user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'assets/images/default-avatar.png',
    isOnline: true,
  };

  notifications = {
    dashboard: 3,
    maps: 5,
    activity: 2,
    shared: 1,
  };

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout() {
    // Implement logout logic here
    console.log('Logout clicked');
  }
}
