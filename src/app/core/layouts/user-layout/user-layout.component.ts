import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class UserLayoutComponent implements OnInit {
  isSidebarOpen = true;
  showProfileMenu = false;
  searchQuery = '';

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.initTheme();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    // Implement logout logic here
    console.log('Logout clicked');
  }
}
