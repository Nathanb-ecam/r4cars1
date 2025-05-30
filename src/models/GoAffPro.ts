
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
    affiliate_id: number;
    total:number;
    subtotal:number;
    shipping_address: string;
    customer_email:string;
    number:string;
    coupons:Array<string>;
    commission:string;
    line_items: GoAffProLineItem[];
    status: string;  
    createdAt: string;
  }


export interface BaseSchemaGoAffPro{
  order:BaseOrderGoAffPro,
  affiliate_id: number
}

export interface ExtendSchemaGoAffPro{
  order:ExtendedOrderGoAffPro,
  affiliate_id: number
}

export interface BaseOrderGoAffPro{
  number: string,
  total: number,
  coupons: Array<string>;
}


export interface ExtendedOrderGoAffPro{
  id:string, // ex: 1001. the internal order ID of your system (useful if you are using REST JSON file)
  number:string, // ex: #1001. human readable order number displayed to the admins
  total: number, // the order total (the final amount that the customer paid)
  subtotal: number, // order subtotal (order total minus shipping and taxes)
  discount: number, // the discount received by the customer
  tax: number, // the tax charged on the order
  shipping: number,  // the shipping charged on the order
  currency:string, // ex: USD. ISO-4217 three letter currency code of the order
  date: string, // ex: 2021-04-27T17:06:55.450Z
  shipping_address:string,
  customer: { // customer details
      first_name:string,
      last_name:string,
      email:string,
      phone?:string, // optional
      is_new_customer?:boolean //optional
  },
  coupons: Array<string>, // ex: ['EASY10OFF']. an array of discount codes applied to the order
  line_items:[ // array of products sold in this order
      {
          name:string, // ex: Product A. name of the product
          quantity:number, //total quantities sold
          price: number,
          sku:string, // ex: PD-110-1. product SKU
          product_id: string, //ex: 21413232. Internal product ID (used if you are using REST JSON FILE)
          tax: number, // tax charged on this product. USE this only if the product price has VAT included in the price
          discount: number, // total discount received by the customer on this product. In this case, the customer got $25 discount per item.
      }
  ],
 status:string, // ex: approved
 forceSDK:boolean , //ex: true.  use this parameter to process this order as a CUSTOM ORDER (bypasses platform order enrichment 
//commission: 45, // (not recommended) specify the commission to be given for this order
 delay?: number, // ex: 60000. the amount in milliseconds to delay the processing of this order. This is use full for up-sell where the second conversion event should take preference over the first order. So send the first conversion event with a suitable delay parameter

}