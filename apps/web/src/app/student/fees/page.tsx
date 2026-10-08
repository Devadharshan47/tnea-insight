'use client';

import React, { useState } from 'react';
import { CreditCard, Wallet, Building, CheckCircle2, ShieldCheck, Loader2, FileText, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FeesPage() {
  const { t, language } = useLanguage();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Select, 2: Details, 3: Processing, 4: Success
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [amount, setAmount] = useState(5000);

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
    setTimeout(() => {
      setStep(4);
    }, 2500);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-[#070B1A] flex justify-center py-10 px-4 font-sans">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            {language === 'TA' ? 'கட்டணம் செலுத்துதல்' : 'Fee Payment'} <ShieldCheck className="text-green-400 h-6 w-6" />
          </h1>
          <p className="text-gray-400 mt-2">
            {language === 'TA' ? 'பாதுகாப்பான கட்டண நுழைவாயில்' : 'Secure payment gateway for counselling and admission fees'}
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <React.Fragment key={s}>
              <div className={`h-2 rounded-full flex-1 transition-all duration-500 ${s <= step ? 'bg-[#4F46E5] shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-white/10'}`} />
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Fee Details & Payment Method */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#4F46E5]/20 rounded-full blur-3xl"></div>
                <h2 className="text-xl font-bold text-white mb-6">Payment Summary</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-300">Initial Counselling Fee</span>
                    <span className="text-white font-medium">₹5,000.00</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-300">Platform Charges</span>
                    <span className="text-green-400 font-medium">Waived</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-bold text-white">Total Amount</span>
                    <span className="text-2xl font-bold text-[#4F46E5]">₹{amount.toLocaleString()}.00</span>
                  </div>
                </div>

                <div className="bg-[#4F46E5]/10 border border-[#4F46E5]/30 rounded-xl p-4 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-300">Your transaction is secured with 256-bit encryption. The counselling fee is partially refundable if you withdraw before allotment.</p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white mb-4">Select Payment Method</h2>
                
                <button 
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center gap-4 ${paymentMethod === 'card' ? 'bg-[#4F46E5]/10 border-[#4F46E5] shadow-[0_0_15px_rgba(79,70,229,0.2)]' : 'bg-[#111827] border-white/10 hover:border-white/30'}`}
                >
                  <div className={`p-3 rounded-xl ${paymentMethod === 'card' ? 'bg-[#4F46E5] text-white' : 'bg-white/5 text-gray-400'}`}>
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Credit / Debit Card</h3>
                    <p className="text-sm text-gray-400">Visa, Mastercard, RuPay</p>
                  </div>
                </button>

                <button 
                  onClick={() => setPaymentMethod('upi')}
                  className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center gap-4 ${paymentMethod === 'upi' ? 'bg-[#4F46E5]/10 border-[#4F46E5] shadow-[0_0_15px_rgba(79,70,229,0.2)]' : 'bg-[#111827] border-white/10 hover:border-white/30'}`}
                >
                  <div className={`p-3 rounded-xl ${paymentMethod === 'upi' ? 'bg-[#4F46E5] text-white' : 'bg-white/5 text-gray-400'}`}>
                    <Wallet className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">UPI Options</h3>
                    <p className="text-sm text-gray-400">GPay, PhonePe, Paytm</p>
                  </div>
                </button>

                <button 
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center gap-4 ${paymentMethod === 'netbanking' ? 'bg-[#4F46E5]/10 border-[#4F46E5] shadow-[0_0_15px_rgba(79,70,229,0.2)]' : 'bg-[#111827] border-white/10 hover:border-white/30'}`}
                >
                  <div className={`p-3 rounded-xl ${paymentMethod === 'netbanking' ? 'bg-[#4F46E5] text-white' : 'bg-white/5 text-gray-400'}`}>
                    <Building className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Net Banking</h3>
                    <p className="text-sm text-gray-400">All major Indian banks supported</p>
                  </div>
                </button>

                <button 
                  onClick={() => setStep(2)}
                  className="w-full mt-6 bg-[#4F46E5] hover:bg-[#4338CA] text-white py-4 rounded-2xl font-bold text-lg transition-all flex justify-center items-center gap-2"
                >
                  Proceed to Pay <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Enter Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-xl mx-auto"
            >
              <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative">
                <button 
                  onClick={() => setStep(1)}
                  className="absolute top-6 right-6 text-sm text-gray-400 hover:text-white transition-colors underline"
                >
                  Back
                </button>
                <h2 className="text-2xl font-bold text-white mb-2">Enter Details</h2>
                <p className="text-gray-400 mb-8">Amount to pay: <span className="text-white font-bold">₹{amount.toLocaleString()}.00</span></p>

                <form onSubmit={handleProcessPayment} className="space-y-5">
                  {paymentMethod === 'card' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Card Number</label>
                        <input required type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4F46E5] tracking-widest" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Expiry Date</label>
                          <input required type="text" placeholder="MM/YY" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4F46E5]" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">CVV</label>
                          <input required type="password" placeholder="***" maxLength={3} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4F46E5]" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Name on Card</label>
                        <input required type="text" placeholder="John Doe" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4F46E5]" />
                      </div>
                    </>
                  )}

                  {paymentMethod === 'upi' && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">UPI ID / VPA</label>
                      <input required type="text" placeholder="username@upi" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4F46E5]" />
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Select Bank</label>
                      <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4F46E5] appearance-none">
                        <option>State Bank of India</option>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>Indian Bank</option>
                        <option>Canara Bank</option>
                      </select>
                    </div>
                  )}

                  <button 
                    type="submit"
                    className="w-full mt-4 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] flex justify-center items-center gap-2"
                  >
                    Pay ₹{amount.toLocaleString()} <ShieldCheck className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Processing */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative">
                <div className="absolute inset-0 border-4 border-[#4F46E5] border-t-transparent rounded-full w-24 h-24 animate-spin"></div>
                <div className="absolute inset-2 border-4 border-[#7C3AED] border-b-transparent rounded-full w-20 h-20 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                <div className="w-24 h-24 flex items-center justify-center rounded-full bg-[#4F46E5]/10">
                  <ShieldCheck className="h-8 w-8 text-[#4F46E5]" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mt-8 mb-2">Processing Payment</h2>
              <p className="text-gray-400">Please do not refresh or close this window...</p>
            </motion.div>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-[#111827]/90 backdrop-blur-xl border border-green-500/30 rounded-3xl p-8 shadow-[0_0_40px_rgba(34,197,94,0.15)] text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-600"></div>
                
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                
                <h2 className="text-3xl font-extrabold text-white mb-2">Payment Successful!</h2>
                <p className="text-gray-400 mb-8">Your counselling fee has been received.</p>
                
                <div className="bg-black/40 rounded-xl p-5 mb-8 border border-white/5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Transaction ID</span>
                    <span className="text-white font-mono">TXN{Math.floor(Math.random() * 100000000)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Date</span>
                    <span className="text-white">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Amount</span>
                    <span className="text-green-400 font-bold">₹{amount.toLocaleString()}.00</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-medium transition-colors border border-white/10 flex items-center justify-center gap-2">
                    <FileText className="h-4 w-4" /> Download Receipt
                  </button>
                  <a href="/student/dashboard" className="flex-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white py-3 rounded-xl font-medium transition-colors">
                    Back to Dashboard
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
