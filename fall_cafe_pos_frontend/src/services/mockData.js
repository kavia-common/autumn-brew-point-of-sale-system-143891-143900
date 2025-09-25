//
// Mock data and helper methods for local-only flows when Supabase is unavailable
//

// PUBLIC_INTERFACE
export const mockMenu = [
  { id: "m1", name: "Pumpkin Spice Latte", price: 5.25, category: "Coffee" },
  { id: "m2", name: "Caramel Apple Cider", price: 4.5, category: "Tea" },
  { id: "m3", name: "Maple Cold Brew", price: 5.0, category: "Coffee" },
  { id: "m4", name: "Butternut Squash Soup", price: 6.25, category: "Food" },
  { id: "m5", name: "Cranberry Scone", price: 3.5, category: "Bakery" },
  { id: "m6", name: "Pecan Pie Slice", price: 4.25, category: "Bakery" },
  { id: "m7", name: "Chai Latte", price: 4.75, category: "Tea" },
  { id: "m8", name: "Turkey Panini", price: 7.95, category: "Food" },
];

// PUBLIC_INTERFACE
export const mockSales = [
  { id: "s1", date: "2025-09-17", total: 124.5, items: 28 },
  { id: "s2", date: "2025-09-18", total: 178.95, items: 41 },
  { id: "s3", date: "2025-09-19", total: 202.3, items: 47 },
];

// PUBLIC_INTERFACE
export const categories = ["All", "Coffee", "Tea", "Food", "Bakery"];
