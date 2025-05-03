import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  isPopular: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  last4: string;
  expiry: string;
  isDefault: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl: string;
}

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'billing.component.html',
  styleUrls: ['billing.component.scss'],
})
export class BillingComponent {
  showAvailablePlans = false;
  currentPlan: SubscriptionPlan = {
    id: 'basic',
    name: 'Basic Plan',
    price: 9.99,
    features: ['Up to 5 maps', 'Basic customization', 'Email support'],
    isPopular: false,
  };

  nextBillingDate = '2024-04-01';

  paymentMethods: PaymentMethod[] = [
    {
      id: 'card1',
      type: 'card',
      last4: '4242',
      expiry: '12/24',
      isDefault: true,
    },
    {
      id: 'paypal1',
      type: 'paypal',
      last4: 'john.doe@example.com',
      expiry: '',
      isDefault: false,
    },
  ];

  invoices: Invoice[] = [
    {
      id: 'inv1',
      date: '2024-03-01',
      amount: 9.99,
      status: 'paid',
      downloadUrl: '#',
    },
    {
      id: 'inv2',
      date: '2024-02-01',
      amount: 9.99,
      status: 'paid',
      downloadUrl: '#',
    },
    {
      id: 'inv3',
      date: '2024-01-01',
      amount: 9.99,
      status: 'paid',
      downloadUrl: '#',
    },
  ];

  availablePlans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      features: ['Up to 5 maps', 'Basic customization', 'Email support'],
      isPopular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 19.99,
      features: [
        'Up to 20 maps',
        'Advanced customization',
        'Priority support',
        'Custom domains',
      ],
      isPopular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 49.99,
      features: [
        'Unlimited maps',
        'Full customization',
        '24/7 support',
        'Custom domains',
        'API access',
        'Team collaboration',
      ],
      isPopular: false,
    },
  ];

  showPlans() {
    this.showAvailablePlans = true;
  }

  selectPlan(planId: string) {
    console.log('Selected plan:', planId);
    this.showAvailablePlans = false;
  }

  cancelSubscription() {
    if (confirm('Are you sure you want to cancel your subscription?')) {
      console.log('Subscription cancelled');
    }
  }

  setDefaultMethod(methodId: string) {
    this.paymentMethods.forEach((method) => {
      method.isDefault = method.id === methodId;
    });
  }

  removePaymentMethod(methodId: string) {
    if (confirm('Are you sure you want to remove this payment method?')) {
      this.paymentMethods = this.paymentMethods.filter(
        (method) => method.id !== methodId
      );
    }
  }

  addPaymentMethod() {
    console.log('Adding new payment method...');
  }

  downloadInvoice(invoiceId: string) {
    console.log('Downloading invoice:', invoiceId);
  }
}
