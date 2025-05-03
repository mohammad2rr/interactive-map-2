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
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

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
    const newTheme =
      currentTheme === this.DARK_THEME ? this.LIGHT_THEME : this.DARK_THEME;
    this.setTheme(newTheme);
  }

  isDarkMode(): boolean {
    return this.getCurrentTheme() === this.DARK_THEME;
  }

  private getCurrentTheme(): string {
    return (
      document.documentElement.getAttribute('data-theme') || this.LIGHT_THEME
    );
  }

  private setTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.THEME_KEY, theme);
  }
}
