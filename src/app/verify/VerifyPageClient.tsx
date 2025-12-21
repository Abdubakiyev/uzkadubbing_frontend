"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyAuth, resendCode } from "@/src/features/api/Auth";
import { FaEnvelopeOpenText, FaShieldAlt } from "react-icons/fa";
import { FiAlertCircle, FiArrowRight, FiCheck, FiLock, FiMail, FiRefreshCw } from "react-icons/fi";

const VerifyPageClient: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Emailni olish va tekshirish
  useEffect(() => {
    const queryEmail = searchParams.get("email");
    const savedEmail = localStorage.getItem("verify_email");
    const finalEmail = queryEmail || savedEmail;

    if (!finalEmail) {
      setAlertMsg("Email topilmadi. Iltimos, qayta ro'yxatdan o'ting.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(finalEmail)) {
      setAlertMsg("Email noto'g'ri formatda!");
      return;
    }

    setEmail(finalEmail);
  }, [searchParams]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  // OTP input handling
  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();

    if (index === 5 && value && newOtp.every(d => d !== "")) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasteData.split("").forEach((char, i) => { if (i < 6) newOtp[i] = char; });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasteData.length - 1, 5)]?.focus();
  };

  const handleSubmit = async (otpString?: string) => {
    const otpValue = otpString || otp.join("");
    if (otpValue.length !== 6) {
      setAlertMsg("Iltimos, 6 xonali kodni kiriting!");
      return;
    }

    setLoading(true);
    setAlertMsg(null);

    try {
      const data = await verifyAuth(email, otpValue);

      if (data.tokens) {
        localStorage.setItem("access_token", data.tokens.accessToken);
        localStorage.setItem("refresh_token", data.tokens.refreshToken);
      }

      if (data.userId) localStorage.setItem("user_id", data.userId);

      await new Promise(resolve => setTimeout(resolve, 500));
      router.push(data.redirectTo);
    } catch (error: any) {
      setAlertMsg(error?.message || "Kod tasdiqlashda xatolik yuz berdi");
      document.querySelector(".otp-container")?.classList.add("animate-shake");
      setTimeout(() => {
        document.querySelector(".otp-container")?.classList.remove("animate-shake");
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || !canResend) return;
    setResendLoading(true);
    setAlertMsg(null);

    try {
      await resendCode(email);
      setAlertMsg("Yangi kod emailingizga yuborildi!");
      setCanResend(false);
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      setAlertMsg(error?.message || "Kodni qayta yuborishda xatolik");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900/30 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="max-w-lg w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600/20 to-amber-600/20 rounded-3xl mb-6 border border-white/10">
              <FaShieldAlt className="text-white text-3xl" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent mb-3">
              Xavfsizlik Tasdiqlash
            </h1>
            <p className="text-gray-400">
              Profilingizni himoya qilish uchun emailingizga yuborilgan kodni kiriting
            </p>
          </div>

          {/* Main Card */}
          <div className="relative group">
            {/* Card Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-40 transition duration-1000"></div>
            
            {/* Card Content */}
            <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              {/* Email Display */}
              <div className="flex items-center justify-center gap-3 mb-8 p-4 bg-black/30 rounded-xl border border-white/10">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600/20 to-purple-800/20 rounded-lg flex items-center justify-center">
                  <FiMail className="text-purple-300" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Tasdiqlash kodi yuborildi</p>
                  <p className="text-white font-medium truncate max-w-xs">{email}</p>
                </div>
              </div>

              {/* Alert */}
              {alertMsg && (
                <div className={`mb-6 bg-gradient-to-r ${alertMsg.includes('yuborildi') ? 'from-green-900/30 to-emerald-900/30 border-green-500/30' : 'from-orange-900/30 to-red-900/30 border-orange-500/30'} backdrop-blur-sm rounded-xl p-4 border`}>
                  <div className="flex items-start gap-3">
                    {alertMsg.includes('yuborildi') ? (
                      <FiCheck className="text-green-400 text-xl flex-shrink-0 mt-0.5" />
                    ) : (
                      <FiAlertCircle className="text-orange-400 text-xl flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm ${alertMsg.includes('yuborildi') ? 'text-green-300' : 'text-orange-300'}`}>
                        {alertMsg}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* OTP Input */}
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-300 mb-6">
                    6 xonali tasdiqlash kodini kiriting
                  </p>
                  
                  <div className="otp-container flex justify-center gap-3 mb-8">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}                        
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        className="w-16 h-16 text-center text-3xl font-bold bg-black/50 backdrop-blur-sm border border-white/20 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300"
                        autoFocus={index === 0}
                        disabled={loading}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-2 text-gray-400 mb-6">
                    <FaEnvelopeOpenText />
                    <span className="text-sm">Emailingizni tekshiring</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={() => handleSubmit()}
                  disabled={loading || otp.some(digit => !digit)}
                  className="group/btn relative w-full overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:from-purple-700 hover:via-pink-700 hover:to-amber-700 text-white font-bold py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Tekshirilmoqda...</span>
                      </>
                    ) : (
                      <>
                        <FiLock />
                        <span>Hisobni Tasdiqlash</span>
                        <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </div>

              {/* Resend Code Section */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="text-center">
                  <p className="text-gray-400 mb-4">
                    Kodni olmadingizmi?
                  </p>
                  <button
                    onClick={handleResend}
                    disabled={resendLoading || !canResend}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${canResend ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-cyan-300 hover:from-blue-600/30 hover:to-cyan-600/30 border border-cyan-500/30' : 'bg-gray-800/50 text-gray-500 border border-gray-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {resendLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-cyan-300/30 border-t-cyan-300 rounded-full animate-spin"></div>
                        <span>Yuborilmoqda...</span>
                      </>
                    ) : (
                      <>
                        <FiRefreshCw className={canResend ? "animate-spin-once" : ""} />
                        <span>Kodni Qayta Yuborish</span>
                        {!canResend && (
                          <span className="ml-2 text-amber-400">({countdown}s)</span>
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Security Info */}
              <div className="mt-8 p-4 bg-black/30 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-600/20 to-emerald-800/20 rounded-lg flex items-center justify-center">
                    <FaShieldAlt className="text-green-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Xavfsizlik eslatmasi</p>
                    <p className="text-xs text-gray-400">Kod faqat 10 daqiqa amal qiladi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Register */}
          <div className="text-center mt-8">
            <button
              onClick={() => router.push("/register")}
              className="text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <span>Ro'yxatdan o'tish sahifasiga qaytish</span>
              <FiArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 animate-bounce">
        <div className="w-3 h-3 bg-purple-500 rounded-full opacity-50"></div>
      </div>
      <div className="absolute bottom-20 right-10 animate-pulse">
        <div className="w-4 h-4 bg-amber-500 rounded-full opacity-30"></div>
      </div>
    </div>
  );
};

export default VerifyPageClient;