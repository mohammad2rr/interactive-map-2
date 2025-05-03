import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your account information and preferences</p>
      </div>

      <div class="profile-content">
        <div class="profile-section">
          <h2>Personal Information</h2>
          <form class="profile-form" (ngSubmit)="updateProfile()">
            <div class="form-group">
              <label for="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                [(ngModel)]="profile.fullName"
                name="fullName"
                required
              />
            </div>

            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                type="email"
                id="email"
                [(ngModel)]="profile.email"
                name="email"
                required
              />
            </div>

            <div class="form-group">
              <label for="bio">Bio</label>
              <textarea
                id="bio"
                [(ngModel)]="profile.bio"
                name="bio"
                rows="4"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="location">Location</label>
              <input
                type="text"
                id="location"
                [(ngModel)]="profile.location"
                name="location"
              />
            </div>

            <div class="form-group">
              <label for="website">Website</label>
              <input
                type="url"
                id="website"
                [(ngModel)]="profile.website"
                name="website"
              />
            </div>

            <div class="form-actions">
              <button type="submit" [disabled]="isLoading">
                {{ isLoading ? 'Saving...' : 'Save Changes' }}
              </button>
              <button type="button" class="cancel-btn" (click)="resetForm()">
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div class="profile-section">
          <h2>Account Security</h2>
          <div class="security-options">
            <div class="security-item">
              <h3>Change Password</h3>
              <p>Update your account password</p>
              <button (click)="changePassword()">Change Password</button>
            </div>

            <div class="security-item">
              <h3>Two-Factor Authentication</h3>
              <p>Add an extra layer of security to your account</p>
              <button (click)="toggleTwoFactor()">
                {{ profile.twoFactorEnabled ? 'Disable' : 'Enable' }} 2FA
              </button>
            </div>

            <div class="security-item">
              <h3>Account Deletion</h3>
              <p>Permanently delete your account and all data</p>
              <button class="delete-btn" (click)="deleteAccount()">
                Delete Account
              </button>
            </div>
          </div>
        </div>

        <div class="profile-section">
          <h2>Notification Preferences</h2>
          <div class="notification-options">
            <div class="notification-item">
              <label>
                <input
                  type="checkbox"
                  [(ngModel)]="profile.notifications.email"
                  name="emailNotifications"
                />
                Email Notifications
              </label>
              <p>Receive updates about your maps and account activity</p>
            </div>

            <div class="notification-item">
              <label>
                <input
                  type="checkbox"
                  [(ngModel)]="profile.notifications.push"
                  name="pushNotifications"
                />
                Push Notifications
              </label>
              <p>Get instant alerts about important updates</p>
            </div>

            <div class="notification-item">
              <label>
                <input
                  type="checkbox"
                  [(ngModel)]="profile.notifications.newsletter"
                  name="newsletter"
                />
                Newsletter
              </label>
              <p>Receive our monthly newsletter with tips and updates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .profile-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
      }

      .profile-header {
        margin-bottom: 2rem;
      }

      .profile-header h1 {
        color: #2c3e50;
        margin: 0 0 0.5rem 0;
        font-size: 2rem;
      }

      .profile-header p {
        color: #666;
        margin: 0;
      }

      .profile-section {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .profile-section h2 {
        color: #2c3e50;
        margin: 0 0 1rem 0;
        font-size: 1.5rem;
      }

      .profile-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-group label {
        color: #2c3e50;
        font-weight: 500;
      }

      .form-group input,
      .form-group textarea {
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }

      .form-group textarea {
        resize: vertical;
        min-height: 100px;
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
      }

      .form-actions button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.2s;
      }

      .form-actions button:first-child {
        background: #3498db;
        color: white;
      }

      .form-actions button:first-child:hover {
        background: #2980b9;
      }

      .form-actions button:last-child {
        background: #f5f5f5;
        color: #2c3e50;
      }

      .form-actions button:last-child:hover {
        background: #e0e0e0;
      }

      .security-options,
      .notification-options {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .security-item,
      .notification-item {
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
      }

      .security-item h3,
      .notification-item label {
        color: #2c3e50;
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
      }

      .security-item p,
      .notification-item p {
        color: #666;
        margin: 0 0 1rem 0;
        font-size: 0.9rem;
      }

      .security-item button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.2s;
      }

      .security-item button:not(.delete-btn) {
        background: #3498db;
        color: white;
      }

      .security-item button:not(.delete-btn):hover {
        background: #2980b9;
      }

      .delete-btn {
        background: #e74c3c;
        color: white;
      }

      .delete-btn:hover {
        background: #c0392b;
      }

      .notification-item label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
      }

      .notification-item input[type='checkbox'] {
        width: 1.2rem;
        height: 1.2rem;
      }

      @media (max-width: 768px) {
        .profile-container {
          padding: 1rem;
        }

        .form-actions {
          flex-direction: column;
        }

        .form-actions button {
          width: 100%;
        }
      }
    `,
  ],
})
export class ProfileComponent {
  isLoading = false;
  profile = {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Map enthusiast and data visualization expert',
    location: 'New York, USA',
    website: 'https://johndoe.com',
    twoFactorEnabled: false,
    notifications: {
      email: true,
      push: true,
      newsletter: false,
    },
  };

  updateProfile() {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      console.log('Profile updated:', this.profile);
      this.isLoading = false;
    }, 1000);
  }

  resetForm() {
    // Reset form to initial values
    this.profile = {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      bio: 'Map enthusiast and data visualization expert',
      location: 'New York, USA',
      website: 'https://johndoe.com',
      twoFactorEnabled: false,
      notifications: {
        email: true,
        push: true,
        newsletter: false,
      },
    };
  }

  changePassword() {
    // Implement password change logic
    console.log('Changing password...');
  }

  toggleTwoFactor() {
    this.profile.twoFactorEnabled = !this.profile.twoFactorEnabled;
    console.log(
      'Two-factor authentication:',
      this.profile.twoFactorEnabled ? 'enabled' : 'disabled'
    );
  }

  deleteAccount() {
    if (
      confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      console.log('Deleting account...');
    }
  }
}
