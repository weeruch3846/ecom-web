import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useEcomStore from "../../store/ecom-store";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShoppingBag } from "lucide-react";

const Login = () => {
  // Javascript
  const navigate = useNavigate();
  const actionLogin = useEcomStore((state) => state.actionLogin);
  const user = useEcomStore((state) => state.user);
  console.log("user form zustand", user);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await actionLogin(form);
      const role = res.data.payload.role;
      roleRedirect(role);
      toast.success("Welcome Back");
    } catch (err) {
      console.log(err);
      const errMsg = err.response?.data?.message;
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const roleRedirect = (role) => {
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen flex 
  items-center justify-center bg-gray-100 ">
      {/* Left / brand panel */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700">
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-[-6rem] right-[-4rem] w-[28rem] h-[28rem] rounded-full bg-white/10"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full border border-white/20"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
            <span className="text-lg font-semibold tracking-tight">Ecom Shop</span>
          </div>

          <div className="max-w-sm">
            <h2 className="text-3xl font-semibold leading-snug">
              ยินดีต้อนรับกลับมาอีกครั้ง
            </h2>
            <p className="mt-3 text-indigo-100 text-sm leading-relaxed">
              เข้าสู่ระบบเพื่อติดตามคำสั่งซื้อ จัดการตะกร้าสินค้า
              และรับสิทธิพิเศษสำหรับสมาชิก
            </p>
          </div>

          <p className="text-xs text-indigo-200">
            © {new Date().getFullYear()} Ecom Shop. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right / form panel */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-800">เข้าสู่ระบบ</h1>
            <p className="text-sm text-slate-400 mt-1">
              กรอกอีเมลและรหัสผ่านเพื่อเข้าใช้งานบัญชีของคุณ
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">อีเมล</label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm
                  text-slate-700 placeholder:text-slate-400
                  focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                  transition-colors"
                  onChange={handleOnChange}
                  name="email"
                  type="email"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-500">รหัสผ่าน</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  ลืมรหัสผ่าน?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg text-sm
                  text-slate-700 placeholder:text-slate-400
                  focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                  transition-colors"
                  onChange={handleOnChange}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg
              shadow-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2
              disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-6">
            ยังไม่มีบัญชี?{" "}
            <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-700">
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
