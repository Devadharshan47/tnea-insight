"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, ChevronRight, Loader2, Eye, GraduationCap, ArrowLeft } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";

export default function StudentLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuthContext();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role: 'student' })
            });

            if (res.ok) {
                const data = await res.json();
                login(data.user);
                // AuthContext handles redirect to /student/dashboard
            } else {
                alert('Invalid credentials');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Login failed', error);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#070b14] flex text-white font-sans relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-600/10 blur-[120px] rounded-full" />
            </div>

            {/* Left Side: Student Branding */}
            <div className="hidden lg:flex w-1/2 flex-col justify-center p-16 relative z-10 border-r border-white/5">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                            <GraduationCap className="text-orange-400" size={28} />
                        </div>
                        <h1 className="text-2xl font-bold tracking-wide">TNEA Insight</h1>
                    </div>

                    <h2 className="text-5xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-br from-orange-200 via-white to-orange-200 mb-6 tracking-tight">
                        Your Journey to<br />
                        Top Engineering<br />
                        Colleges
                    </h2>

                    <p className="text-lg text-gray-400 max-w-lg leading-relaxed mb-12">
                        Predict cutoffs with AI, explore detailed analytics, and master choice-filling to secure your dream college in Tamil Nadu.
                    </p>

                    <div className="inline-flex items-center gap-4 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
                        <Shield className="text-orange-500" size={24} />
                        <div>
                            <h3 className="text-sm font-bold text-white">Student Dashboard</h3>
                            <p className="text-xs text-gray-500">Secure Personal Portal</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 relative z-10">
                <div className="absolute top-8 left-8 lg:hidden">
                     <div className="flex items-center gap-2">
                        <GraduationCap className="text-orange-400" size={24} />
                        <span className="font-bold">TNEA</span>
                     </div>
                </div>

                <div className="absolute top-8 right-8">
                    <div className="px-4 py-1.5 rounded-full border border-white/10 text-xs font-bold text-gray-400 tracking-wider">
                        EN / TA
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-[440px]"
                >
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-white mb-3">Student Portal</h1>
                        <p className="text-sm text-gray-400">Log in to track your admission journey</p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-[#0b1120] border border-orange-900/30 p-8 rounded-3xl shadow-2xl relative group">
                        
                        {/* Demo Access Banner */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1">Demo Access</p>
                                <p className="text-sm text-gray-300">student@example.com</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-transparent uppercase tracking-wider mb-1">.</p>
                                <p className="text-sm font-mono text-gray-500">student123</p>
                            </div>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-5">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="student@example.com"
                                            className="w-full bg-[#070b14] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-gray-600 outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-[#070b14] border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-sm text-white placeholder:text-gray-600 outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                                            required
                                        />
                                        <Eye className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center px-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded bg-[#070b14] border-white/10 text-orange-500 focus:ring-orange-500/20" />
                                    <span className="text-xs text-gray-400 font-medium">Remember device</span>
                                </label>
                                <button type="button" className="text-xs text-orange-400 font-medium hover:text-orange-300">
                                    Forgot password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-900/50 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        Sign In <ChevronRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-500 mb-4">Are you an administrator?</p>
                        <Link href="/admin/login" className="block w-full py-4 bg-transparent border border-white/10 hover:bg-white/5 rounded-2xl text-sm font-medium text-gray-300 transition-colors">
                            Access Admin Portal
                        </Link>
                    </div>

                </motion.div>
            </div>
        </div>
    );
}
