import React, { useMemo, useState } from "react";
import { theme } from "../theme";
import Sidebar from "../components/Layout/Sidebar";
import OrderTicket from "../components/Orders/OrderTicket";
import MenuGrid from "../components/Menu/MenuGrid";
import FooterBar from "../components/Layout/FooterBar";
import { mockMenu } from "../services/mockData";
import { useNavigate } from "react-router-dom";

// PUBLIC_INTERFACE
export default function OrderTaking() {
  /**
   * Order Taking screen: classic layout with left categories, center menu, right order ticket, footer summary
   */
  const [category, setCategory] = useState("All");
  const [orderItems, setOrderItems] = useState([]);
  const navigate = useNavigate();

  const filteredMenu = useMemo(() => {
    if (category === "All") return mockMenu;
    return mockMenu.filter((m) => m.category === category);
  }, [category]);

  const addItem = (item) => {
    setOrderItems((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) {
        return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const inc = (item) =>
    setOrderItems((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p))
    );

  const dec = (item) =>
    setOrderItems((prev) =>
      prev
        .map((p) => (p.id === item.id ? { ...p, qty: Math.max(0, p.qty - 1) } : p))
        .filter((p) => p.qty > 0)
    );

  const remove = (item) =>
    setOrderItems((prev) => prev.filter((p) => p.id !== item.id));

  const subtotal = orderItems.reduce((sum, it) => sum + it.price * it.qty, 0);

  const goToPayment = () => {
    navigate("/payment", { state: { orderItems } });
  };

  return (
    <div style={styles.page}>
      <div style={styles.content}>
        <Sidebar current={category} onSelect={setCategory} />
        <main style={styles.main}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitle}>Menu</div>
            <div style={styles.sectionSub}>Select items to add to order</div>
          </div>
          <MenuGrid items={filteredMenu} onAdd={addItem} />
        </main>
        <div style={styles.ticketPane}>
          <OrderTicket
            items={orderItems}
            onIncrement={inc}
            onDecrement={dec}
            onRemove={remove}
          />
        </div>
      </div>
      <FooterBar subtotal={subtotal} onPay={goToPayment} />
    </div>
  );
}

const styles = {
  page: {
    background: `linear-gradient(0deg, ${theme.colors.background}, ${theme.colors.background})`,
    minHeight: "calc(100vh - 64px)",
    display: "flex",
    flexDirection: "column",
  },
  content: {
    display: "grid",
    gridTemplateColumns: "220px 1fr 360px",
    gap: 16,
    padding: 16,
    flex: 1,
  },
  main: {
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.outline}`,
    borderRadius: 12,
    padding: 12,
    boxShadow: theme.elevation.sm,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    overflow: "hidden",
  },
  sectionHeader: {
    borderBottom: `1px solid ${theme.colors.outline}`,
    paddingBottom: 8,
  },
  sectionTitle: { fontWeight: 800 },
  sectionSub: { color: theme.colors.subtleText, fontSize: 12, marginTop: 2 },
  ticketPane: {
    background: "transparent",
  },
};
