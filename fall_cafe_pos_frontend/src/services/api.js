import { getSupabase } from './supabaseClient';

/**
 * PUBLIC_INTERFACE
 * fetchMenu
 * Retrieves menu items from Supabase "menu_items" table.
 */
export async function fetchMenu() {
  const sb = getSupabase();
  try {
    const { data, error } = await sb.from('menu_items').select('*').order('category', { ascending: true }).order('name', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.warn('Falling back to local menu due to error:', e.message);
    // Fallback menu
    return [
      { id: '1', name: 'Pumpkin Spice Latte', price: 5.25, category: 'Drinks' },
      { id: '2', name: 'Maple Cappuccino', price: 4.75, category: 'Drinks' },
      { id: '3', name: 'Apple Cider', price: 3.5, category: 'Drinks' },
      { id: '4', name: 'Cranberry Scone', price: 3.25, category: 'Bakery' },
      { id: '5', name: 'Pecan Pie Slice', price: 4.0, category: 'Bakery' },
      { id: '6', name: 'Butternut Squash Soup', price: 6.5, category: 'Food' }
    ];
  }
}

/**
 * PUBLIC_INTERFACE
 * saveOrder
 * Persists an order into Supabase "orders" table and returns saved record.
 */
export async function saveOrder(order) {
  const sb = getSupabase();
  try {
    const { data, error } = await sb.from('orders').insert(order).select('*').single();
    if (error) throw error;
    return data;
  } catch (e) {
    console.error('Unable to save order to Supabase:', e.message);
    // Return the payload to keep UI functional even without persistence
    return { ...order, id: order.id || `local-${Date.now()}` };
  }
}

/**
 * PUBLIC_INTERFACE
 * fetchOrders
 * Retrieves recent orders list for the Orders page.
 */
export async function fetchOrders(limit = 50) {
  const sb = getSupabase();
  try {
    const { data, error } = await sb.from('orders').select('*').order('created_at', { ascending: false }).limit(limit);
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.warn('Falling back to empty recent orders:', e.message);
    return [];
  }
}

/**
 * PUBLIC_INTERFACE
 * upsertMenuItem
 * Creates or updates a menu item in Supabase "menu_items".
 */
export async function upsertMenuItem(item) {
  const sb = getSupabase();
  try {
    const { data, error } = await sb.from('menu_items').upsert(item).select('*').single();
    if (error) throw error;
    return data;
  } catch (e) {
    console.error('Upsert menu item failed:', e.message);
    return item;
  }
}

/**
 * PUBLIC_INTERFACE
 * deleteMenuItem
 * Deletes a menu item by id.
 */
export async function deleteMenuItem(id) {
  const sb = getSupabase();
  try {
    const { error } = await sb.from('menu_items').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Delete menu item failed:', e.message);
    return false;
  }
}

/**
 * PUBLIC_INTERFACE
 * fetchSalesSummary
 * Fetch aggregate sales metrics. If a Supabase RPC/view "sales_summary" exists, use it.
 */
export async function fetchSalesSummary() {
  const sb = getSupabase();
  try {
    // If a view or RPC exists, you can call it; here we try a simple aggregation
    const { data, error } = await sb
      .from('orders')
      .select('total, created_at')
      .limit(500);
    if (error) throw error;

    const summary = data.reduce(
      (acc, row) => {
        acc.totalRevenue += Number(row.total || 0);
        acc.count += 1;
        return acc;
      },
      { totalRevenue: 0, count: 0 }
    );
    return summary;
  } catch (e) {
    console.warn('Sales summary fallback:', e.message);
    return { totalRevenue: 0, count: 0 };
  }
}
