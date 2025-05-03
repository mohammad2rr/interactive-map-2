import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <h1>Admin Settings</h1>
      <div class="settings-grid">
        <div class="settings-card">
          <h2>General Settings</h2>
          <form>
            <div class="form-group">
              <label for="siteName">Site Name</label>
              <input
                type="text"
                id="siteName"
                [(ngModel)]="siteName"
                name="siteName"
              />
            </div>
            <div class="form-group">
              <label for="adminEmail">Admin Email</label>
              <input
                type="email"
                id="adminEmail"
                [(ngModel)]="adminEmail"
                name="adminEmail"
              />
            </div>
            <div class="form-group">
              <label for="timezone">Timezone</label>
              <select id="timezone" [(ngModel)]="timezone" name="timezone">
                <option value="UTC">UTC</option>
                <option value="EST">EST</option>
                <option value="PST">PST</option>
              </select>
            </div>
            <button type="submit">Save Changes</button>
          </form>
        </div>

        <div class="settings-card">
          <h2>Security Settings</h2>
          <div class="checkbox-group">
            <label>
              <input
                type="checkbox"
                [(ngModel)]="require2FA"
                name="require2FA"
              />
              Require Two-Factor Authentication
            </label>
            <label>
              <input
                type="checkbox"
                [(ngModel)]="passwordExpiry"
                name="passwordExpiry"
              />
              Enable Password Expiry
            </label>
            <label>
              <input
                type="checkbox"
                [(ngModel)]="ipRestriction"
                name="ipRestriction"
              />
              Enable IP Restriction
            </label>
          </div>
        </div>

        <div class="settings-card">
          <h2>Backup Settings</h2>
          <div class="backup-actions">
            <button class="action-button">Create Backup</button>
            <button class="action-button">Restore Backup</button>
          </div>
          <div class="backup-schedule">
            <h3>Automatic Backup Schedule</h3>
            <div class="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  [(ngModel)]="dailyBackup"
                  name="dailyBackup"
                />
                Daily Backup
              </label>
              <label>
                <input
                  type="checkbox"
                  [(ngModel)]="weeklyBackup"
                  name="weeklyBackup"
                />
                Weekly Backup
              </label>
              <label>
                <input
                  type="checkbox"
                  [(ngModel)]="monthlyBackup"
                  name="monthlyBackup"
                />
                Monthly Backup
              </label>
            </div>
          </div>
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
      h3 {
        color: #2c3e50;
        margin: 1.5rem 0 1rem 0;
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
      select {
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
      .backup-actions {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .action-button {
        background: #3498db;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
      }
      .action-button:hover {
        background: #2980b9;
      }
      button[type='submit'] {
        background: #2ecc71;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
      }
      button[type='submit']:hover {
        background: #27ae60;
      }
    `,
  ],
})
export class SettingsComponent {
  siteName = 'Interactive Map';
  adminEmail = 'admin@example.com';
  timezone = 'UTC';
  require2FA = false;
  passwordExpiry = true;
  ipRestriction = false;
  dailyBackup = true;
  weeklyBackup = true;
  monthlyBackup = false;
}
