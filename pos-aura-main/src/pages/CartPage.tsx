import { useState, useEffect } from "react";
import { getCart, setGlobalCart, CartItem } from "./ExplorePage";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [payment, setPayment] = useState("Cash");
  const navigate = useNavigate();

  useEffect(() => {
    setCart([...getCart()]);
  }, []);

  const updateQty = (id: number, delta: number) => {
    const updated = cart.map((item) => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter((item) => item.quantity > 0);
    setCart(updated);
    setGlobalCart(updated);
  };

  const removeItem = (id: number) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    setGlobalCart(updated);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) { toast.error("Cart is empty"); return; }
    if (!customer.name.trim()) { toast.error("Customer name required"); return; }
    // await orderService.create({ items: cart, customer, payment, total });
    toast.success("Order placed successfully!");
    setGlobalCart([]);
    setCart([]);
    setCustomer({ name: "", phone: "" });
    navigate("/orders");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Cart & Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Table */}
        <div className="lg:col-span-2 pos-card-static">
          <h2 className="text-lg font-semibold mb-4">Cart Items</h2>
          {cart.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">Your cart is empty. Go to Explore to add items.</p>
          ) : (
            <table className="pos-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td className="font-medium">{item.name}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(item.id, -1)} className="p-1 rounded-lg bg-accent hover:bg-accent/80 transition-colors"><Minus className="w-3 h-3" /></button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="p-1 rounded-lg bg-accent hover:bg-accent/80 transition-colors"><Plus className="w-3 h-3" /></button>
                      </div>
                    </td>
                    <td>${item.price.toFixed(2)}</td>
                    <td className="font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button onClick={() => removeItem(item.id)} className="p-1.5 rounded-lg hover:bg-destructive/15 text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-right font-semibold border-t border-border pt-3">Grand Total</td>
                  <td className="font-bold text-primary border-t border-border pt-3">${total.toFixed(2)}</td>
                  <td className="border-t border-border"></td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>

        {/* Checkout */}
        <div className="pos-card-static space-y-5">
          <h2 className="text-lg font-semibold">Customer Details</h2>
          <div className="space-y-3">
            <input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} className="pos-input w-full" placeholder="Customer name" />
            <input value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} className="pos-input w-full" placeholder="Phone number" />
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Payment Method</h3>
            <div className="flex gap-3">
              {["Cash", "UPI"].map((method) => (
                <button
                  key={method}
                  onClick={() => setPayment(method)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                    payment === method
                      ? "bg-primary/15 border-primary text-primary"
                      : "border-border text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <div className="flex justify-between mb-4">
              <span className="text-muted-foreground">Total</span>
              <span className="text-xl font-bold text-primary">${total.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} className="pos-btn-primary w-full">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
