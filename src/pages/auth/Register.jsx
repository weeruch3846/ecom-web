import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import zxcvbn from "zxcvbn";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShoppingBag } from "lucide-react";

const registerSchema = z
  .object({
    email: z.string().email({ message: "Invalid email!!!" }),
    password: z.string().min(8, { message: "Password ต้องมากกว่า 8 ตัวอักษร" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password มันบ่ตรงกันเด้อ",
    path: ["confirmPassword"],
  });

const strengthLabel = ["อ่อนมาก", "อ่อน", "พอใช้", "ดี", "แข็งแรงมาก"];
const strengthColor = [
  "bg-rose-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-emerald-500",
];

const Register = () => {
  // Javascript
  const [passwordScore, setPasswordScore] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const validatePassword = () => {
    let password = watch().password;
    return zxcvbn(password ? password : "").score;
  };
  useEffect(() => {
    setPasswordScore(validatePassword());
  }, [watch().password]);

  const onSubmit = async (data) => {
    // const passwordScore = zxcvbn(data.password).score;
    // console.log(passwordScore);
    // if (passwordScore < 3) {
    //   toast.warning("Password บ่ Strong!!!!!");
    //   return;
    // }
    // console.log("ok ลูกพี่");
    // Send to Back
    setSubmitting(true);
    try {
      const res = await axios.post("https://ecom-api-wheat.vercel.app/api/register", data);

      console.log(res.data);
      toast.success(res.data);
    } catch (err) {
      const errMsg = err.response?.data?.message;
      toast.error(errMsg);
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  // const tam = Array.from(Array(5))
  // console.log(tam)
  console.log(passwordScore);
  return (
    <div className="min-h-screen flex 
  items-center justify-center bg-gray-100">
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
              สมัครสมาชิกใหม่วันนี้
            </h2>
            <p className="mt-3 text-indigo-100 text-sm leading-relaxed">
              สร้างบัญชีเพื่อเริ่มช้อปปิ้ง ติดตามคำสั่งซื้อ
              และรับข้อเสนอพิเศษก่อนใคร
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
            <h1 className="text-2xl font-semibold text-slate-800">สมัครสมาชิก</h1>
            <p className="text-sm text-slate-400 mt-1">
              กรอกข้อมูลด้านล่างเพื่อสร้างบัญชีใหม่
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">อีเมล</label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  {...register("email")}
                  placeholder="you@example.com"
                  type="email"
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm
                  text-slate-700 placeholder:text-slate-400
                  focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                  transition-colors
                  ${errors.email ? "border-rose-400" : "border-slate-200"}`}
                />
              </div>
              {errors.email && (
                <p className="text-rose-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">รหัสผ่าน</label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  {...register("password")}
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm
                  text-slate-700 placeholder:text-slate-400
                  focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                  transition-colors
                  ${errors.password ? "border-rose-400" : "border-slate-200"}`}
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

              {errors.password && (
                <p className="text-rose-500 text-xs">
                  {errors.password.message}
                </p>
              )}

              {watch().password?.length > 0 && (
                <div className="pt-1">
                  <div className="flex gap-1.5">
                    {Array.from(Array(5).keys()).map((item, index) => (
                      <div
                        key={index}
                        className={`h-1.5 flex-1 rounded-full ${
                          index <= passwordScore
                            ? strengthColor[passwordScore]
                            : "bg-slate-100"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">
                    ความปลอดภัย:{" "}
                    <span className="font-medium text-slate-500">
                      {strengthLabel[passwordScore]}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">ยืนยันรหัสผ่าน</label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm
                  text-slate-700 placeholder:text-slate-400
                  focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                  transition-colors
                  ${errors.confirmPassword ? "border-rose-400" : "border-slate-200"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-rose-500 text-xs">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              disabled={submitting}
              className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg
              shadow-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2
              disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              {submitting ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
              {!submitting && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-6">
            มีบัญชีอยู่แล้ว?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
