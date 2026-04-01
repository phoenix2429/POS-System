import { useState, useEffect } from "react";
import { orderService } from "@/services/endpoints";

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    orderService.getAll().then(res => setOrders(res.data)).catch(console.error);
  }, []);

  const statusColor = (status: string) => {
    switch (status) {
      case "SUCCESS": return "bg-success/15 text-success";
      case "PENDING": return "bg-warning/15 text-warning";
      case "FAILED": return "bg-destructive/15 text-destructive";
      default: return "bg-accent text-accent-foreground";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Order History</h1>

      <div className="pos-card-static">
        <div className="overflow-x-auto">
          <table className="pos-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="font-medium text-primary">ORD-00{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>₹{order.totalAmount.toFixed(2)}</td>
                  <td><span className="pos-badge bg-accent text-accent-foreground">{order.paymentType}</span></td>
                  <td><span className={`pos-badge ${statusColor(order.status)}`}>{order.status}</span></td>
                  <td className="text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
