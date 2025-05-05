import { Routes } from '@angular/router';
import { MapComponent } from './features/map/components/map/map.component';
import { CountryMapComponent } from './features/map/components/country-map/country-map.component';
import { ProvinceMapComponent } from './features/map/components/province-map/province-map.component';
import { IranMapComponent } from './features/iran-map/iran-map.component';
import { PublicLayoutComponent } from './core/layouts/public-layout/public-layout.component';
import { UserLayoutComponent } from './core/layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './core/layouts/admin-layout/admin-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { BillingComponent } from './features/user/billing/billing.component';

export const routes: Routes = [
  // Main landing page with public layout (header and footer)
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/public/landing/landing.component').then(
            (m) => m.LandingComponent
          ),
        title: 'Interactive Map - Home',
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/public/about/about.component').then(
            (m) => m.AboutComponent
          ),
        title: 'About Us',
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/public/contact/contact.component').then(
            (m) => m.ContactComponent
          ),
        title: 'Contact Us',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
        title: 'Login',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then(
            (m) => m.RegisterComponent
          ),
        title: 'Register',
      },
      {
        path: 'map',
        children: [
          {
            path: '',
            component: MapComponent,
            title: 'Interactive Map',
          },
          {
            path: ':countryCode',
            component: CountryMapComponent,
            title: 'Country Map',
          },
          {
            path: ':countryCode/:provinceCode',
            component: ProvinceMapComponent,
            title: 'Province Map',
          },
        ],
      },
      {
        path: 'iran-map',
        component: IranMapComponent,
        title: 'Iran Map',
      },
      // Public blog routes
      {
        path: 'blog',
        loadChildren: () =>
          import('./features/blog/blog.module').then((m) => m.BlogModule),
      },
    ],
  },

  // User routes with user layout (protected by auth guard)
  {
    path: 'user',
    component: UserLayoutComponent,
    // canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/user/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        title: 'User Dashboard',
      },
      {
        path: 'maps',
        loadComponent: () =>
          import('./features/user/maps/maps.component').then(
            (m) => m.MapsComponent
          ),
        title: 'My Maps',
      },
      {
        path: 'activity',
        loadComponent: () =>
          import('./features/user/activity/activity.component').then(
            (m) => m.ActivityComponent
          ),
        title: 'Activity',
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./features/user/favorites/favorites.component').then(
            (m) => m.FavoritesComponent
          ),
        title: 'Favorites',
      },
      {
        path: 'shared',
        loadComponent: () =>
          import('./features/user/shared/shared.component').then(
            (m) => m.SharedComponent
          ),
        title: 'Shared Maps',
      },
      {
        path: 'templates',
        loadComponent: () =>
          import('./features/user/templates/templates.component').then(
            (m) => m.TemplatesComponent
          ),
        title: 'Templates',
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/user/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
        title: 'Settings',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/user/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
        title: 'Profile',
      },
      {
        path: 'billing',
        component: BillingComponent,
        title: 'Billing',
      },
      // User blog routes
      {
        path: 'blog',
        loadChildren: () =>
          import('./features/blog/blog.module').then((m) => m.BlogModule),
      },
    ],
  },

  // Admin routes with admin layout (protected by admin guard)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    //canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        title: 'Admin Dashboard',
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin/users/users.component').then(
            (m) => m.UsersComponent
          ),
        title: 'User Management',
      },
      {
        path: 'content',
        loadComponent: () =>
          import('./features/admin/content/content.component').then(
            (m) => m.ContentComponent
          ),
        title: 'Content Management',
      },
      {
        path: 'maps',
        loadComponent: () =>
          import('./features/admin/maps/maps.component').then(
            (m) => m.MapsComponent
          ),
        title: 'Map Management',
      },
      {
        path: 'image-to-geojson',
        loadChildren: () =>
          import('./features/image-to-geoJson/image-to-geoJson.module').then(
            (m) => m.ImageToGeoJsonModule
          ),
        title: 'Image to GeoJSON Converter',
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/admin/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
        title: 'Admin Settings',
      },
      // Admin blog routes
      {
        path: 'blog',
        loadChildren: () =>
          import('./features/blog/blog.module').then((m) => m.BlogModule),
      },
    ],
  },

  // Catch all route - redirect to home
  {
    path: '**',
    redirectTo: '',
  },
];
