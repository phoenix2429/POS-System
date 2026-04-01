import { useState, useEffect } from "react";
import { dashboardService, orderService } from "@/services/endpoints";
import { DollarSign, ShoppingBag, TrendingUp, Loader2 } from "lucide-react";

const statCards = [
  { label: "Total Sales", icon: DollarSign, key: "totalSales" as const, prefix: "₹" },
  { label: "Total Orders", icon: ShoppingBag, key: "totalOrders" as const, prefix: "" },
  { label: "Revenue Today", icon: TrendingUp, key: "todaySales" as const, prefix: "₹" },
];

const DashboardPage = () => {
  const [data, setData] = useState({ totalSales: 0, totalOrders: 0, todaySales: 0 });
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dashboardService.get()
      .then(res => setData(res.data))
      .catch(console.error);
      
    orderService.getAll()
      .then(res => setOrders(res.data.slice(-5).reverse())) // Get 5 most recent orders
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map((card) => (
          <div key={card.key} className="pos-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <card.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="text-2xl font-bold">{card.prefix}{data[card.key].toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pos-card-static">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="pos-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="font-medium text-primary">ORD-{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>₹{Number(order.totalAmount).toFixed(2)}</td>
                  <td>
                    <span className="pos-badge bg-accent text-accent-foreground">{order.paymentType}</span>
                  </td>
                  <td>
                    <span className={`pos-badge ${order.status === "SUCCESS" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
