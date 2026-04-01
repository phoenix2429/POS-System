import { useState, useEffect } from "react";
import { Search, Plus, Minus, Trash2, ShoppingCart, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import { itemService, categoryService, orderService } from "@/services/endpoints";

interface Item {
  id: number;
  name: string;
  price: number;
  categoryId: number | null;
  categoryName: string | null;
  imagePath: string | null;
}

interface Category {
  id: number;
  name: string;
}

interface CartItem extends Item {
  quantity: number;
}

const ExplorePage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "UPI">("CASH");
  const [placingOrder, setPlacingOrder] = useState(false);
  
  // Modals
  const [showReceipt, setShowReceipt] = useState(false);
  const [showUpi, setShowUpi] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState<any>(null);

  useEffect(() => {
    categoryService.getAll().then(res => setCategories(res.data)).catch(console.error);
    itemService.getAll().then(res => setItems(res.data)).catch(console.error);
  }, []);

  const itemsByCategory = (categoryId: number | null) => {
    if (categoryId === null) return items.length;
    return items.filter(item => item.categoryId === categoryId).length;
  };

  const filteredItems = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === null || item.categoryId === selectedCategory;
    return matchSearch && matchCat;
  });

  const addToCart = (item: Item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) => prev.map((c) => {
      if (c.id === id) {
        const newQ = c.quantity + delta;
        return newQ > 0 ? { ...c, quantity: newQ } : c;
      }
      return c;
    }).filter(c => c.quantity > 0));
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const subTotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const tax = subTotal * 0.05; // 5% tax from backend
  const grandTotal = subTotal + tax;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    if (!customerInfo.name || !customerInfo.phone) {
      toast.error("Please enter customer name and phone number");
      return;
    }

    if (paymentMethod === "UPI") {
      setShowUpi(true);
      return;
    }

    await submitOrder();
  };

  const submitOrder = async () => {
    setPlacingOrder(true);
    try {
      const payload = {
        customerName: customerInfo.name,
        phone: customerInfo.phone,
        paymentType: paymentMethod,
        items: cart.map(c => ({ itemId: c.id, quantity: c.quantity }))
      };
      
      const res = await orderService.create(payload);
      setLastOrderDetails(res.data);
      
      toast.success("Order placed successfully!");
      setCart([]);
      setCustomerInfo({ name: "", phone: "" });
      setShowUpi(false);
      setShowReceipt(true);
    } catch (err) {
      toast.error("Failed to place order");
      console.error(err);
    } finally {
      setPlacingOrder(false);
    }
  };

  // Predefined vibrant colors for categories (like screenshot: cyan, brown, orange)
  const catColors = [
    "bg-[#1daeb5]", // Cyan
    "bg-[#8e6138]", // Brown
    "bg-[#e0750d]", // Orange
    "bg-[#8e44ad]", // Purple
    "bg-[#27ae60]", // Green
  ];

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)] gap-4 animate-fade-in relative">
      
      {/* Left Pane - Explore */}
      <div className="flex-1 flex flex-col space-y-5 overflow-hidden pr-2">
        
        {/* Category Tabs */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`flex items-center gap-3 min-w-[160px] p-3 rounded-2xl transition-all ${
              selectedCategory === null ? 'bg-[#4b5563] text-white shadow-lg' : 'bg-card border border-border text-muted-foreground hover:bg-accent'
            }`}
          >
            <div className="w-10 h-8 bg-black/40 rounded flex items-center justify-center">
              <span className="w-4 h-1 bg-white rounded-full"></span>
            </div>
            <div className="text-left leading-tight">
              <p className="font-semibold text-[15px]">All Items</p>
              <p className="text-xs opacity-80">{items.length} Items</p>
            </div>
          </button>

          {categories.map((cat, index) => {
            const isSelected = selectedCategory === cat.id;
            const colorClass = catColors[index % catColors.length];
            
            return (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-3 min-w-[170px] p-3 rounded-2xl transition-all text-white ${
                  isSelected ? colorClass + ' shadow-lg scale-[1.02]' : colorClass + ' opacity-90 hover:opacity-100 hover:scale-[1.02]'
                }`}
              >
                <div className="w-10 h-10 bg-white/20 rounded flex items-center justify-center p-1 overflow-hidden shrink-0">
                  <div className="w-full h-full bg-white/50 rounded-sm"></div>
                </div>
                <div className="text-left leading-tight overflow-hidden">
                  <p className="font-semibold text-[15px] truncate">{cat.name}</p>
                  <p className="text-xs opacity-90">{itemsByCategory(cat.id)} Items</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Divider & Search */}
        <div className="pt-2 border-t border-border flex justify-end">
          <div className="relative w-full max-w-sm">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full bg-[#1c1c1c] border border-border rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-yellow-500" 
              placeholder="Search items.." 
            />
          </div>
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto pr-2 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-[#18181b] border border-border/50 rounded-xl p-3 flex flex-col justify-between hover:border-yellow-500/50 transition-colors">
                <div className="flex items-start gap-4 mb-2">
                  <div className="w-16 h-16 rounded-xl bg-white overflow-hidden shrink-0 flex flex-col justify-center items-center shadow-inner">
                    {item.imagePath ? (
                       <img src={`http://localhost:8080/uploads/${item.imagePath}`} className="w-full h-full object-cover" />
                    ) : (
                       <Package className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1 w-full pt-1">
                    <h3 className="text-[15px] font-semibold text-gray-100 leading-snug break-words">{item.name}</h3>
                    <div className="flex items-center justify-between mt-auto">
                       <span className="font-bold text-gray-200">₹{item.price.toFixed(0)}</span>
                       <ShoppingCart className="w-4 h-4 text-yellow-500" />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-2">
                  <button onClick={() => addToCart(item)} className="bg-[#15803d] hover:bg-[#166534] w-8 h-8 rounded-lg flex items-center justify-center text-white transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {filteredItems.length === 0 && (
             <div className="text-center py-12 text-muted-foreground w-full">No items found. Add some from Manage Items.</div>
          )}
        </div>
      </div>

      {/* Right Pane - Cart */}
      <div className="w-full lg:w-[360px] bg-card border border-border rounded-xl p-5 flex flex-col shrink-0 overflow-hidden shadow-sm h-full max-h-[calc(100vh-6rem)]">
        
        {/* Customer Form */}
        <div className="space-y-4 mb-5 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium w-28 text-muted-foreground">Customer name</span>
            <input value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} className="flex-1 bg-background border border-border rounded px-3 py-1.5 text-sm focus:outline-none focus:border-yellow-500" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium w-28 text-muted-foreground">Mobile number</span>
            <input value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} className="flex-1 bg-background border border-border rounded px-3 py-1.5 text-sm focus:outline-none focus:border-yellow-500" />
          </div>
        </div>

        <hr className="border-border mb-4 shrink-0" />

        {/* Cart List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">
          {cart.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground py-8">Your cart is empty.</p>
          ) : (
            cart.map(c => (
              <div key={c.id} className="flex flex-col gap-2 relative group pb-3 border-b border-border/40 last:border-0">
                <div className="flex justify-between items-start">
                  <p className="text-[15px] font-medium text-gray-200">{c.name}</p>
                  <p className="text-[15px] font-medium">₹{(c.price * c.quantity).toFixed(2)}</p>
                </div>
                
                <div className="flex justify-between items-center">
                   <div className="flex items-center bg-background rounded-md overflow-hidden border border-border/50">
                     <button onClick={() => updateQuantity(c.id, -1)} className="w-8 h-7 flex items-center justify-center bg-[#be123c] hover:bg-[#9f1239] text-white">
                        <Minus className="w-3 h-3" />
                     </button>
                     <span className="w-8 h-7 flex items-center justify-center text-sm font-medium">{c.quantity}</span>
                     <button onClick={() => updateQuantity(c.id, 1)} className="w-8 h-7 flex items-center justify-center bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
                        <Plus className="w-3 h-3" />
                     </button>
                   </div>
                   
                   <button onClick={() => removeFromCart(c.id)} className="w-8 h-8 rounded-md bg-[#be123c] hover:bg-[#9f1239] text-white flex items-center justify-center opacity-80 hover:opacity-100">
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Totals */}
        <div className="shrink-0 pt-4 border-t border-border space-y-2 mb-4">
          <div className="flex justify-between text-sm text-gray-300">
            <span>Item:</span>
            <span>₹{subTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-300">
            <span>Tax (5%):</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-1">
            <span>Total:</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mb-4 shrink-0">
          <button 
            onClick={() => setPaymentMethod("CASH")}
            className={`flex-1 py-2.5 rounded text-sm font-semibold transition-colors ${paymentMethod === "CASH" ? "bg-[#15803d] text-white" : "bg-accent/50 text-muted-foreground hover:bg-accent"}`}
          >
            Cash
          </button>
          <button 
            onClick={() => setPaymentMethod("UPI")}
            className={`flex-1 py-2.5 rounded text-sm font-semibold transition-colors ${paymentMethod === "UPI" ? "bg-[#2563eb] text-white" : "bg-accent/50 text-muted-foreground hover:bg-accent"}`}
          >
            UPI
          </button>
        </div>

        <button 
          onClick={handlePlaceOrder}
          disabled={placingOrder}
          className="w-full bg-[#ca8a04] hover:bg-[#a16207] text-black font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
        >
          {placingOrder && <Loader2 className="w-4 h-4 animate-spin" />}
          Place Order
        </button>
      </div>

      {/* UPI Payment Modal */}
      {showUpi && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center animate-fade-in p-4">
          <div className="bg-[#1c1c1c] w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl flex relative">
             {/* Left Panel */}
             <div className="w-5/12 bg-blue-500 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="bg-white p-2 rounded-full mb-4 z-10">
                   <Package className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-white font-bold text-lg z-10 mb-6">My Retail Shop</h3>
                <div className="bg-white/20 p-4 rounded-xl w-full text-left z-10">
                  <p className="text-blue-50 text-xs text-center font-medium">Price Summary</p>
                  <p className="text-white text-3xl font-bold text-center mt-1">₹{grandTotal.toFixed(2)}</p>
                </div>
                <div className="absolute bottom-0 opacity-20 w-full h-32 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             </div>
             {/* Right Panel */}
             <div className="w-7/12 bg-white p-8 space-y-6">
                <div className="flex justify-between items-center text-black">
                   <h3 className="font-bold border-b-2 border-primary pb-1">UPI QR</h3>
                   <span className="text-xs text-gray-500 flex items-center gap-1">⏱️ 05:00</span>
                </div>
                <div className="flex justify-center my-4">
                   <div className="p-2 border border-blue-100 rounded-xl">
                      {/* Fake QR code using generic pattern */}
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=shop@upi&pn=RetailShop&am=${grandTotal.toFixed(2)}`} alt="QR Code" className="w-44 h-44" />
                   </div>
                </div>
                <p className="text-center text-xs text-gray-500 font-medium">Scan the QR using any UPI App</p>
                <div className="flex justify-center gap-2 mt-4 opacity-70 grayscale">
                    <div className="w-6 h-6 rounded-full bg-blue-600"></div>
                    <div className="w-6 h-6 rounded-full bg-purple-600"></div>
                    <div className="w-6 h-6 rounded-full bg-green-500"></div>
                </div>
                <div className="flex gap-3 justify-end mt-8 border-t pt-4">
                   <button onClick={() => setShowUpi(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200">Cancel</button>
                   <button onClick={submitOrder} disabled={placingOrder} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2">
                     {placingOrder && <Loader2 className="w-4 h-4 animate-spin" />}
                     MOCK PAYMENT SUCCESS
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* order receipt modal */}
      {showReceipt && lastOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center animate-fade-in p-4">
          <div className="bg-white text-black w-full max-w-sm rounded-xl overflow-hidden shadow-2xl p-6 relative">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center border-4 border-green-100">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
            </div>
            
            <h2 className="text-center font-bold text-xl mb-6">Order Receipt</h2>
            
            <div className="text-sm space-y-1 mb-6 border-b pb-4">
              <p><span className="font-semibold text-gray-700">Order ID:</span> ORD{lastOrderDetails.id}</p>
              <p><span className="font-semibold text-gray-700">Name:</span> {lastOrderDetails.customerName}</p>
              <p><span className="font-semibold text-gray-700">Phone:</span> {lastOrderDetails.phone}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-2">Items Ordered</h3>
              <div className="space-y-2 text-sm">
                {lastOrderDetails.items.map((it: any) => (
                  <div key={it.id} className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="text-gray-700">{it.itemName} x{it.quantity}</span>
                    <span className="font-medium">₹{(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-1 text-sm border-b pb-4 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>₹{(lastOrderDetails.totalAmount - lastOrderDetails.tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (5%):</span>
                <span>₹{lastOrderDetails.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t">
                <span>Grand Total:</span>
                <span>₹{lastOrderDetails.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-sm mb-6"><span className="font-semibold text-gray-700">Payment Method:</span> {lastOrderDetails.paymentType}</p>
            
            <div className="flex gap-3">
              <button onClick={() => toast.info("Printing receipt...")} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2.5 rounded-lg transition-colors text-sm">
                Print Receipt
              </button>
              <button onClick={() => setShowReceipt(false)} className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ExplorePage;
