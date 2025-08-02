// src/types.ts

// The product data structure from your database
export interface Product {
    id: string;
    _id?: string;
    name: string;
    price: number;
    image: string;
  }
  
  export interface Subscription {
    id?: string;
    _id?: string;
    milkType: string;
    animal: string;
    quantity: string;
    startDate: Date;
    slot: string;
    userId: string;
    bill: number;
  }

  export interface User {
    _id: string;
    phone?: string;
    email?: string;
    name?: string;
    role: 'Customer' | 'DeliveryPartner';
  }

  export interface Address {
    _id: string;
    userId: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault: boolean;
  }

  // The product data structure for the bestsellers and other product lists
  export interface ProductSectionProps {
    title: string;
    products: Product[];
  }
  
  // Subscription Card Props
  export interface SubscriptionCardProps {
    // Add specific props for your subscription card if needed
    title: string;
  }