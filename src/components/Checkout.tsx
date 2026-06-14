import { useState } from "react";
import { CartItem } from "../types";
import { Check, ArrowRight, ArrowLeft, ShieldCheck, CreditCard, Sparkles, Truck, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CheckoutProps {
  cart: CartItem[];
  onSuccessClearCart: () => void;
  onGoHome: () => void;
}

export default function Checkout({
  cart,
  onSuccessClearCart,
  onGoHome,
}: CheckoutProps) {
  const [step, setStep] = useState(1); // Steps 1 to 4

  // Form Fields State
  const [shipping, setShipping] = useState({
    fullName: "Arthur Pendragon",
    email: "as9549761@gmail.com",
    address: "Cair Paravel Citadel, High Chamber",
    city: "New Avalon",
    postalCode: "10024",
    country: "United Kingdom",
  });

  const [payment, setPayment] = useState({
    cardName: "Arthur Pendragon",
    cardNumber: "•••• •••• •••• 4242",
    expiry: "12/28",
    cvv: "349",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Math constants
  const subtotal = cart.reduce((acc, item) => acc + item.book.price * item.quantity, 0);
  const shippingCharge = subtotal > 150 ? 0.0 : 15.0;
  const total = subtotal + shippingCharge;

  const handleNextStep = () => {
    if (step === 3) {
      // Execute simulated processing loading bar
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setStep(4);
        onSuccessClearCart();
      }, 2000);
    } else {
      setStep((p) => p + 1);
    }
  };

  const handleBackStep = () => {
    setStep((p) => Math.max(1, p - 1));
  };

  // Steps headers progress configuration
  const checkoutSteps = [
    { number: 1, label: "Shipping", icon: Truck },
    { number: 2, label: "Payment", icon: CreditCard },
    { number: 3, label: "Review", icon: ShieldCheck },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-left">
      
      {/* progress stepper */}
      {step < 4 && (
        <div className="flex justify-between items-center max-w-xl mx-auto mb-12 bg-[#f6f3eb] rounded-full p-2 border border-[#ece7dc]">
          {checkoutSteps.map((s) => {
            const isActive = step === s.number;
            const isCompleted = step > s.number;
            const SIcon = s.icon;
            return (
              <div 
                key={s.number}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full text-xs font-semibold ${
                  isActive 
                    ? "bg-[#2a2927] text-white shadow-sm" 
                    : isCompleted 
                    ? "text-[#274e37]" 
                    : "text-[#2a2927]/40"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 shrink-0" />
                ) : (
                  <SIcon className="w-4 h-4 shrink-0" />
                )}
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Forms Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side Active Form Column */}
        <div className="lg:col-span-8 bg-[#f6f3eb] p-8 rounded-3xl border border-[#ece7dc]">
          
          <AnimatePresence mode="wait">
            
            {/* STEP 1: SHIPPING DETAILS */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-[#2a2927]">Shipping Sanctuary</h3>
                  <p className="text-xs text-neutral-500 mt-1 font-sans">Where should we deliver your beautiful volumes?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono uppercase text-neutral-400 font-bold mb-1.5">Recipient Full Name</label>
                    <input
                      type="text"
                      value={shipping.fullName}
                      onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                      className="bg-[#fbf9f4] border border-[#ece7dc] outline-none rounded-xl px-4 py-3 text-sm text-[#2a2927]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono uppercase text-neutral-400 font-bold mb-1.5">Delivery Contact Email</label>
                    <input
                      type="email"
                      value={shipping.email}
                      onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                      className="bg-[#fbf9f4] border border-[#ece7dc] outline-none rounded-xl px-4 py-3 text-sm text-[#2a2927]"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-mono uppercase text-neutral-400 font-bold mb-1.5">Street Address</label>
                  <input
                    type="text"
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    className="bg-[#fbf9f4] border border-[#ece7dc] outline-none rounded-xl px-4 py-3 text-sm text-[#2a2927]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col col-span-2">
                    <label className="text-[10px] font-mono uppercase text-neutral-400 font-bold mb-1.5">City</label>
                    <input
                      type="text"
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="bg-[#fbf9f4] border border-[#ece7dc] outline-none rounded-xl px-4 py-3 text-sm text-[#2a2927]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono uppercase text-neutral-400 font-bold mb-1.5">Code</label>
                    <input
                      type="text"
                      value={shipping.postalCode}
                      onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                      className="bg-[#fbf9f4] border border-[#ece7dc] outline-none rounded-xl px-4 py-3 text-sm text-[#2a2927]"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-mono uppercase text-neutral-400 font-bold mb-1.5">Country</label>
                  <input
                    type="text"
                    value={shipping.country}
                    onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                    className="bg-[#fbf9f4] border border-[#ece7dc] outline-none rounded-xl px-4 py-3 text-sm text-[#2a2927]"
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 2: SECURE STRIPE-STYLE PAYMENT */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-[#2a2927]">Secure Vault Payment</h3>
                  <p className="text-xs text-neutral-500 mt-1 font-sans">Handcrafted payments powered by secure TLS links.</p>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-mono uppercase text-neutral-400 font-bold mb-1.5">Cardholder Full Name</label>
                  <input
                    type="text"
                    value={payment.cardName}
                    onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                    className="bg-[#fbf9f4] border border-[#ece7dc] outline-none rounded-xl px-4 py-3 text-sm text-[#2a2927]"
                  />
                </div>

                <div className="flex flex-col relative">
                  <label className="text-[10px] font-mono uppercase text-neutral-400 font-bold mb-1.5">Card Number</label>
                  <input
                    type="text"
                    value={payment.cardNumber}
                    onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                    className="bg-[#fbf9f4] border border-[#ece7dc] outline-none rounded-xl px-4 py-3 text-sm text-[#2a2927] tracking-widest"
                  />
                  <CreditCard className="w-5 h-5 text-neutral-400 absolute right-4 top-10" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono uppercase text-neutral-400 font-bold mb-1.5">Expiry Date</label>
                    <input
                      type="text"
                      value={payment.expiry}
                      onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                      placeholder="MM/YY"
                      className="bg-[#fbf9f4] border border-[#ece7dc] outline-none rounded-xl px-4 py-3 text-sm text-[#2a2927] text-center"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono uppercase text-neutral-400 font-bold mb-1.5">Secure CVV</label>
                    <input
                      type="password"
                      value={payment.cvv}
                      onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                      className="bg-[#fbf9f4] border border-[#ece7dc] outline-none rounded-xl px-4 py-3 text-sm text-[#2a2927] text-center"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-[#274e37]/5 px-4 py-3 rounded-xl border border-[#274e37]/15">
                  <ShieldCheck className="w-5 h-5 text-[#274e37] shrink-0" />
                  <span className="text-[10px] font-mono text-[#274e37]">
                    Encrypted with 256-bit AES standard. Your credentials remain inside security boundaries.
                  </span>
                </div>
              </motion.div>
            )}

            {/* STEP 3: LITERARY REVIEW & CONFIRM */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-[#2a2927]">Sanctuary Order Review</h3>
                  <p className="text-xs text-neutral-500 mt-1 font-sans">Please review the details before our printing bards bind your books.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-[#ece7dc]">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">Delivery Address</span>
                    <strong className="text-sm text-[#2a2927] block font-serif">{shipping.fullName}</strong>
                    <p className="text-xs text-stone-500 leading-relaxed font-sans">
                      {shipping.address}, {shipping.city}, {shipping.postalCode}, {shipping.country}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">Payment Option</span>
                    <strong className="text-sm text-[#2a2927] block font-mono">{payment.cardNumber}</strong>
                    <p className="text-xs text-stone-500 font-sans">Secured with signature of {payment.cardName}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-mono uppercase text-[#2a2927]/40 font-bold block">Acquired Volumes</span>
                  {cart.map((item) => (
                    <div key={item.book.id} className="flex justify-between items-center bg-[#fbf9f4] p-3 rounded-xl border border-[#ece7dc]">
                      <span className="text-xs font-serif font-medium text-[#2a2927] truncate">
                        {item.book.title} <span className="font-mono text-[10px] text-neutral-400">({item.quantity}x)</span>
                      </span>
                      <span className="font-mono text-xs font-semibold text-[#2a2927]">
                        ₹{(item.book.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 4: SUCCESS RECEIPT */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6 flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-[#274e37]/10 rounded-full flex items-center justify-center text-[#274e37] animate-bounce">
                  <CheckCircle className="w-10 h-10" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-mono text-[#274e37] uppercase tracking-widest font-bold">Consumated Success</span>
                  <h3 className="font-serif text-3xl font-semibold text-[#2a2927]">Welcome to BookVerse Fellowship!</h3>
                  <p className="text-sm text-[#2a2927]/60 max-w-md mx-auto">
                    Arthur, your order credentials have been validated successfully. Your physical books are heading to printing vaults right now.
                  </p>
                </div>

                {/* Simulated Order Reference Badge */}
                <div className="bg-[#fbf9f4] p-5 rounded-2xl border border-[#ece7dc] text-left max-w-sm w-full divide-y divide-[#ece7dc] space-y-3 font-mono text-xs">
                  <div className="flex justify-between pb-3 pt-1">
                    <span className="text-neutral-400">Order Token:</span>
                    <span className="font-bold text-[#2a2927]">BVRST-92841-A</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-neutral-400">Destination:</span>
                    <span className="font-bold text-[#a2927] text-right truncate pl-2">{shipping.city}, UK</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-neutral-400">Grand Total paid:</span>
                    <span className="font-bold text-[#274e37]">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={onGoHome}
                    className="px-8 py-3.5 bg-[#2a2927] text-[#fbf9f4] rounded-full font-serif font-semibold text-xs uppercase tracking-widest hover:bg-[#274e37] transition-all"
                  >
                    Return to Library Sanctuary
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Stepper buttons handles */}
          {step < 4 && (
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-[#ece7dc]">
              {step > 1 ? (
                <button
                  onClick={handleBackStep}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#2a2927]/60 hover:text-[#2a2927] disabled:opacity-40"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous Step
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={handleNextStep}
                disabled={isProcessing || cart.length === 0}
                className="px-6 py-3 bg-[#2a2927] hover:bg-[#274e37] text-[#fbf9f4] rounded-full font-serif text-sm font-medium tracking-wide flex items-center gap-2 shadow-md transition-all disabled:opacity-40"
              >
                {isProcessing ? (
                  <span className="animate-spin mr-1">⌛</span>
                ) : step === 3 ? (
                  "Authorise Payment & Finalize"
                ) : (
                  "Continue Next"
                )}
                {step < 3 && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          )}

        </div>

        {/* Right Side Summary Panel */}
        {step < 4 && (
          <div className="lg:col-span-4 bg-[#f6f3eb] p-6 rounded-3xl border border-[#ece7dc] space-y-6">
            <h4 className="font-serif text-lg font-semibold text-[#2a2927]">Order Summary</h4>

            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 divide-y divide-stone-200">
              {cart.map((item) => (
                <div key={item.book.id} className="flex gap-4 items-center pt-3 text-xs">
                  <img
                    src={item.book.coverUrl}
                    alt={item.book.title}
                    className="w-8 h-12 object-cover rounded shadow"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1 text-left">
                    <h5 className="font-serif font-semibold text-[#2a2927] truncate">{item.book.title}</h5>
                    <p className="text-neutral-400 font-mono text-[9px] mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-mono text-[#2a2927] font-semibold">₹{(item.book.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-[#ece7dc] space-y-3 font-mono text-xs">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Standard Post:</span>
                <span>{shippingCharge === 0 ? "Free" : `₹${shippingCharge.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm font-serif font-bold text-[#2a2927] pt-2 border-t border-stone-200">
                <span>Grand Total:</span>
                <span className="font-mono">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
