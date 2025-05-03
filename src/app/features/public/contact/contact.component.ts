import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="contact-container">
      <div class="contact-content">
        <h1>Contact Us</h1>

        <div class="contact-info">
          <div class="info-section">
            <h2>Get in Touch</h2>
            <p>Have questions or feedback? We'd love to hear from you!</p>

            <div class="contact-details">
              <div class="detail-item">
                <i class="icon">📧</i>
                <span>support.com</span>
              </div>
              <div class="detail-item">
                <i class="icon">📞</i>
                <span>+1 (555) 123-4567</span>
              </div>
              <div class="detail-item">
                <i class="icon">📍</i>
                <span>123 Map Street, Geography City, GC 12345</span>
              </div>
            </div>
          </div>

          <div class="contact-form">
            <h2>Send us a Message</h2>
            <form (ngSubmit)="onSubmit()" #contactForm="ngForm">
              <div class="form-group">
                <label for="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  [(ngModel)]="formData.name"
                  required
                  placeholder="Your name"
                />
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  [(ngModel)]="formData.email"
                  required
                  placeholder="Your email"
                />
              </div>

              <div class="form-group">
                <label for="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  [(ngModel)]="formData.subject"
                  required
                  placeholder="Subject"
                />
              </div>

              <div class="form-group">
                <label for="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  [(ngModel)]="formData.message"
                  required
                  placeholder="Your message"
                  rows="5"
                ></textarea>
              </div>

              <button
                type="submit"
                [disabled]="!contactForm.form.valid || loading"
              >
                {{ loading ? 'Sending...' : 'Send Message' }}
              </button>

              <div *ngIf="error" class="error-message">{{ error }}</div>
              <div *ngIf="success" class="success-message">{{ success }}</div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .contact-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }
      .contact-content {
        background: white;
        border-radius: 8px;
        padding: 2rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #2c3e50;
        margin-bottom: 2rem;
        text-align: center;
      }
      h2 {
        color: #34495e;
        margin: 1.5rem 0 1rem 0;
      }
      .contact-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }
      .info-section {
        padding-right: 2rem;
      }
      .contact-details {
        margin-top: 1.5rem;
      }
      .detail-item {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
        color: #666;
      }
      .icon {
        margin-right: 1rem;
        font-size: 1.2rem;
      }
      .form-group {
        margin-bottom: 1.5rem;
      }
      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #666;
      }
      input,
      textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }
      textarea {
        resize: vertical;
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
      button:disabled {
        background: #bdc3c7;
        cursor: not-allowed;
      }
      .error-message {
        color: #e74c3c;
        margin-top: 1rem;
      }
      .success-message {
        color: #2ecc71;
        margin-top: 1rem;
      }
    `,
  ],
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };
  loading = false;
  error = '';
  success = '';

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.success = '';

    // Simulate form submission
    setTimeout(() => {
      this.loading = false;
      this.success = 'Your message has been sent successfully!';
      this.formData = {
        name: '',
        email: '',
        subject: '',
        message: '',
      };
    }, 1500);
  }
}
