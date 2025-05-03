import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <h1>Settings</h1>
      <div class="settings-grid">
        <div class="settings-card">
          <h2>Profile Settings</h2>
          <form>
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" [(ngModel)]="name" name="name" />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" [(ngModel)]="email" name="email" />
            </div>
            <button type="submit">Save Changes</button>
          </form>
        </div>

        <div class="settings-card">
          <h2>Notification Preferences</h2>
          <div class="checkbox-group">
            <label>
              <input
                type="checkbox"
                [(ngModel)]="emailNotifications"
                name="emailNotifications"
              />
              Email Notifications
            </label>
            <label>
              <input
                type="checkbox"
                [(ngModel)]="mapUpdates"
                name="mapUpdates"
              />
              Map Updates
            </label>
            <label>
              <input
                type="checkbox"
                [(ngModel)]="activityAlerts"
                name="activityAlerts"
              />
              Activity Alerts
            </label>
          </div>
        </div>

        <div class="settings-card">
          <h2>Security</h2>
          <form>
            <div class="form-group">
              <label for="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                [(ngModel)]="currentPassword"
                name="currentPassword"
              />
            </div>
            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                [(ngModel)]="newPassword"
                name="newPassword"
              />
            </div>
            <button type="submit">Update Password</button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .settings-container {
        padding: 2rem;
      }
      .settings-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
      }
      .settings-card {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #333;
        margin-bottom: 1rem;
      }
      h2 {
        color: #2c3e50;
        margin-bottom: 1.5rem;
      }
      .form-group {
        margin-bottom: 1rem;
      }
      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #666;
      }
      input[type='text'],
      input[type='email'],
      input[type='password'] {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }
      .checkbox-group {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .checkbox-group label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      button {
        background: #3498db;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
      }
      button:hover {
        background: #2980b9;
      }
    `,
  ],
})
export class SettingsComponent {
  name = 'John Doe';
  email = 'john@example.com';
  emailNotifications = true;
  mapUpdates = true;
  activityAlerts = false;
  currentPassword = '';
  newPassword = '';
}
