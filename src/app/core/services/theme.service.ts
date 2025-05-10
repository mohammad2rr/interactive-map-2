import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';
  private readonly DARK_THEME = 'dark';
  private readonly LIGHT_THEME = 'light';

  constructor() {
    this.initTheme();
  }

  initTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Add transition class to body for smooth color transitions
    document.body.classList.add('theme-transition');

    if (savedTheme) {
      this.setTheme(savedTheme);
    } else if (prefersDark) {
      this.setTheme(this.DARK_THEME);
    } else {
      this.setTheme(this.LIGHT_THEME);
    }
  }

  toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === this.DARK_THEME ? this.LIGHT_THEME : this.DARK_THEME;

    // Add transition class
    document.body.classList.add('theme-transition');

    // Set new theme
    this.setTheme(newTheme);

    // Remove transition class after animation completes
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 300);
  }

  isDarkMode(): boolean {
    return this.getCurrentTheme() === this.DARK_THEME;
  }

  private getCurrentTheme(): string {
    return document.documentElement.getAttribute('data-theme') || this.LIGHT_THEME;
  }

  private setTheme(theme: string): void {
    // Remove existing theme class
    document.documentElement.classList.remove(this.DARK_THEME);
    document.documentElement.classList.remove(this.LIGHT_THEME);

    // Add new theme class
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute('data-theme', theme);

    // Update localStorage
    localStorage.setItem(this.THEME_KEY, theme);
  }
}
