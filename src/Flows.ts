
export interface FlowOption {
  label: string;
  /** If set, clicking the option opens this URL in a new tab instead of submitting a query */
  link?: string;
  /** If true, show the items from the order API response so the customer can select the affected item */
  showItems?: boolean;
  /** If true, display the tracking link returned by the order API */
  showTracking?: boolean;
}

type Categories = "orders" | "enquiries";

export const Flows: Record<Categories, FlowOption[]> = {
  orders: [
    { label: "Where is my order?",                              showTracking: true },
    { label: "I have a click and collect query",                showTracking: true },
    { label: "I have a tracking query",                         showTracking: true },
    { label: "Courier experience",                              showTracking: true },
    { label: "I have a delivery enquiry",                       showTracking: true },
    { label: "Received damaged or affected during delivery",    showTracking: true },
    { label: "My order is incorrect or missing an item",        showItems: true },
    { label: "My product is faulty",                            showItems: true },
    { label: "Order amendment" },
    { label: "Cancellation" },
    { label: "How do I return an item?" },
    { label: "Difficulties returning an item" },
  ],
  enquiries: [
    { label: "I have a payment issue" },
    { label: "Promotional query" },
    { label: "Gift card" },
    { label: "Admin" },
    { label: "Price match",                link: "https://example.com/price-match" },
    { label: "Loyalty scheme",             link: "https://example.com/loyalty" },
    { label: "VAT invoice" },
    { label: "Will this be back in stock?" },
    { label: "Size query",                 link: "https://example.com/size-guide" },
    { label: "Product care",               link: "https://example.com/product-care" },
    { label: "Chemical query",             link: "https://example.com/chemical-info" },
    { label: "More info about this product", link: "https://example.com/products" },
    { label: "MW guarantee",               link: "https://example.com/guarantee" },
    { label: "Tent care & maintenance",    link: "https://example.com/tent-care" },
    { label: "Store complaint" },
    { label: "Store compliment" },
    { label: "Where is my local store?",   link: "https://example.com/store-finder" },
    { label: "E-receipt",                  link: "https://example.com/e-receipt" },
    { label: "Account help",               link: "https://example.com/account" },
    { label: "Trouble with website" },
    { label: "Privacy policy",             link: "https://example.com/privacy" },
  ],
};