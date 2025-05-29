
export interface GoAffProLineItem {
    name: string;
    quantity: number;
    price: number;
    sku: string;
    product_id: string;
    tax?: number; // Optional, since it may or may not be used
    discount?: number; // Optional, since it may or may not be used
  }
  
  
export interface GoAffProOrder {
    id: string;
    affiliate_id: string;
    total:string;
    subtotal:string;
    shipping_address: string;
    customer_email:string;
    number:string;
    commission:string;
    line_items: GoAffProLineItem[];
    status: string;  
    createdAt: string;
  }