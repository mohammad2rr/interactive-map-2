import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="users-container">
      <h1>User Management</h1>
      <div class="users-actions">
        <button class="action-button">Add New User</button>
        <button class="action-button">Import Users</button>
        <button class="action-button">Export Users</button>
      </div>

      <div class="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let i of [1, 2, 3, 4, 5]">
              <td>User {{ i }}</td>
              <td>user{{ i }}.com</td>
              <td>{{ i % 2 === 0 ? 'Admin' : 'User' }}</td>
              <td>
                <span class="status-badge" [class.active]="i % 2 === 0">
                  {{ i % 2 === 0 ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <button class="icon-button">✏️</button>
                <button class="icon-button">🗑️</button>
                <button class="icon-button">🔒</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [
    `
      .users-container {
        padding: 2rem;
      }
      .users-actions {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
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
      .users-table {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th,
      td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #eee;
      }
      th {
        background: #f8f9fa;
        font-weight: 600;
        color: #2c3e50;
      }
      .status-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        background: #f5f5f5;
        color: #666;
      }
      .status-badge.active {
        background: #d4edda;
        color: #155724;
      }
      .icon-button {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 4px;
        transition: background 0.2s;
      }
      .icon-button:hover {
        background: #f5f5f5;
      }
    `,
  ],
})
export class UsersComponent {}
