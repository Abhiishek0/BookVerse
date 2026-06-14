import { useState } from "react";
import { CartItem } from "../types";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (bookId: string, delta: number) => void;
  onRemoveFromCart: (bookId: string) => void;
  onCheckout: () => void;
  onContinueReading: () => void;
}

export default function Cart({
  cart,
  onUpdateQuantity,
  onRemoveFromCart,
  onCheckout,
  onContinueReading,
}: CartProps) {
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "BOOKVERSE20") {
      setDiscountApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid literary code. Try 'BOOKVERSE20'.");
      setDiscountApplied(false);
    }
  };

  // Pricing calculations
  const subtotal = cart.reduce((acc, item) => acc + item.book.price * item.quantity, 0);
  const discountAmount = discountApplied ? subtotal * 0.2 : 0;
  const shippingCharge = subtotal > 150 || subtotal === 0 ? 0.0 : 15.0;
  const total = subtotal - discountAmount + shippingCharge;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      
      {/* Header section */}
      <div className="flex flex-col items-start mb-10 text-left">
        <span className="text-[11px] font-mono tracking-widest text-[#274e37] uppercase font-bold bg-[#274e37]/5 px-3 py-1 rounded-full border border-[#274e37]/15">
          Cart Checkout
        </span>
        <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#2a2927] tracking-tight mt-3">
          Shopping Bag
        </h2>
        <p className="text-sm text-[#2a2927]/60 mt-2 font-sans max-w-lg">
          Exquisite volumes prepared for physical binding and delivery to your literary sanctuary.
        </p>
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Cart items table */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  key={item.book.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-[#f6f3eb] p-5 rounded-2xl border border-[#ece7dc] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left"
                >
                  {/* Thumb and descriptor */}
                  <div className="flex gap-4 items-center min-w-0">
                    <img
                      src={item.book.coverUrl}
                      alt={item.book.title}
                      className="w-12 h-18 object-cover rounded shadow"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest leading-none">
                        {item.book.category}
                      </span>
                      <h4 className="font-serif text-base font-semibold text-[#2a2927] truncate mt-0.5">
                        {item.book.title}
                      </h4>
                      <p className="text-xs text-neutral-500 italic">by {item.book.author}</p>
                    </div>
                  </div>

                  {/* Quantity adjustment & Pricing */}
                  <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto">
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-3 bg-[#fbf9f4] border border-[#ece7dc] rounded-full p-1 shadow-sm">
                      <button
                        onClick={() => onUpdateQuantity(item.book.id, -1)}
                        className="p-1.5 rounded-full hover:bg-neutral-200 text-[#2a2927]"
                        title="Reduce quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-xs font-semibold w-6 text-center text-[#2a2927]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.book.id, 1)}
                        className="p-1.5 rounded-full hover:bg-neutral-200 text-[#2a2927]"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Cost Math */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-[10px] font-mono text-[#2a2927]/40 uppercase block">Total</span>
                      <span className="font-mono font-bold text-[#2a2927] block text-sm mt-0.5">
                        ₹{(item.book.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Trash dismissing button */}
                    <button
                      onClick={() => onRemoveFromCart(item.book.id)}
                      className="p-2.5 rounded-full border border-[#ece7dc] hover:bg-[#c15c3d]/10 text-neutral-400 hover:text-[#c15c3d] transition-colors"
                      title="Remove volume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Right Column: Calculations & coupon sidebar */}
          <div className="lg:col-span-4 bg-[#f6f3eb] p-6 rounded-2xl border border-[#ece7dc] text-left">
            
            <h3 className="font-serif text-lg font-semibold text-[#2a2927] mb-6">
              Receipt Invoice
            </h3>

            {/* Pricing metrics breakdown */}
            <div className="space-y-4 pb-6 border-b border-[#ece7dc] text-xs font-mono">
              <div className="flex justify-between text-[#2a2927]/60">
                <span>Subtotal:</span>
                <span className="font-semibold text-[#2a2927]">₹{subtotal.toFixed(2)}</span>
              </div>

              {discountApplied && (
                <div className="flex justify-between text-[#274e37] font-bold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Code (20% Off):
                  </span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#2a2927]/60">
                <span>Safe Pack & Shipping:</span>
                <span className="font-semibold text-[#2a2927]">
                  {shippingCharge === 0 ? "Free Shipping" : `₹${shippingCharge.toFixed(2)}`}
                </span>
              </div>
              
              {shippingCharge > 0 && (
                <p className="text-[10px] text-neutral-400 italic">
                  Tip: Add ₹{(150 - subtotal).toFixed(2)} more to unlock free shipping.
                </p>
              )}
            </div>

            {/* Promo Code Input */}
            <div className="py-6 border-b border-[#ece7dc]">
              <span className="text-[10px] font-mono text-[#2a2927]/50 uppercase tracking-widest block mb-2.5">
                Promotion Literature Code
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. BOOKVERSE20"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-[#fbf9f4] border border-[#ece7dc] outline-none text-xs px-4 py-2.5 rounded-xl text-[#2a2927] uppercase tracking-wider"
                />
                <button
                  onClick={applyCoupon}
                  className="bg-[#2a2927] text-[#fbf9f4] hover:bg-[#274e37] text-xs font-bold px-4 rounded-xl transition-all"
                >
                  Apply
                </button>
              </div>

              {discountApplied && (
                <p className="text-[11px] text-[#274e37] font-semibold mt-2.5 flex items-center gap-1 font-sans">
                  Success! Code Applied correctly. Saving 20% on subtotal.
                </p>
              )}

              {couponError && (
                <p className="text-[11px] text-[#c15c3d] font-semibold mt-2.5 flex items-center gap-1 font-sans">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {couponError}
                </p>
              )}
            </div>

            {/* Total Block */}
            <div className="pt-6 pb-6 flex justify-between items-baseline mb-6">
              <span className="font-serif text-base text-[#2a2927]">Grand Total:</span>
              <span className="font-mono text-2xl font-bold text-[#2a2927]">
                ₹{total.toFixed(2)}
              </span>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={onCheckout}
              className="w-full py-4 bg-[#2a2927] hover:bg-[#274e37] text-[#fbf9f4] font-serif font-semibold tracking-wide rounded-full flex items-center justify-center gap-2 shadow-lg mb-4 transition-all"
            >
              Sign & Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onContinueReading}
              className="w-full text-center text-xs font-mono font-semibold uppercase tracking-widest text-[#2a2927]/60 hover:text-[#2a2927] transition-all"
            >
              Back to Catalog Library
            </button>

          </div>

        </div>
      ) : (
        <div className="py-24 text-center bg-[#f6f3eb] rounded-3xl border border-dashed border-[#ece7dc] max-w-xl mx-auto mt-6">
          <ShoppingBag className="w-12 h-12 text-[#2a2927]/30 mx-auto mb-4" />
          <p className="font-serif text-lg font-medium text-[#2a2927]">Your shopping bag is empty</p>
          <p className="text-xs text-neutral-500 mt-1">Visit our Explore catalog to acquire premium bound books.</p>
          <button
            onClick={onContinueReading}
            className="mt-6 px-6 py-2.5 bg-[#2a2927] text-[#fbf9f4] text-xs font-semibold rounded-full hover:bg-[#274e37] transition-all"
          >
            Browse Books
          </button>
        </div>
      )}

    </div>
  );
}
