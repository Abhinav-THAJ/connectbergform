"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Phone, Loader2, CheckCircle2, UploadCloud, X, ImageIcon } from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    course: "",
    semester: "",
    phone: "",
    email: "",
  });

  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [paymentPreview, setPaymentPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Payment screenshot must be under 5MB.");
      return;
    }
    setError("");
    setPaymentFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPaymentPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setPaymentFile(null);
    setPaymentPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentFile) {
      setError("Please upload your payment screenshot.");
      return;
    }
    setIsSubmitting(true);
    setError("");

    try {
      const scriptURL =
        "https://script.google.com/macros/s/AKfycbwRoo15p_zrxWD82T3R_5U1Kfeoy-n4mFSGnfHjXql7_xwgD6jZK4WfA-kqTrGy7DrJMA/exec";

      const base64Image = await toBase64(paymentFile);

      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => form.append(key, value));
      form.append("timestamp", new Date().toISOString());
      form.append("paymentScreenshot", base64Image);
      form.append("paymentFileName", paymentFile.name);
      form.append("paymentMimeType", paymentFile.type);

      await fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        body: form,
      });

      setSubmitted(true);
      setFormData({ name: "", college: "", course: "", semester: "", phone: "", email: "" });
      removeFile();
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-cyan-100 flex flex-col">
      {/* Header */}
      <header className="pt-20 pb-12 px-6 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-3">
          Connect Berg
        </h1>
        <p className="text-lg md:text-xl text-cyan-600/90 font-medium tracking-wide">
          Connecting you to endless opportunities
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-10 flex-grow w-full">
        {/* Form Section */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-slate-100">
            <h2 className="text-2xl font-semibold mb-8 text-slate-800">Registration Form</h2>

            {submitted ? (
              <div className="py-12 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-8 h-8 text-teal-500" />
                </div>
                <h3 className="text-2xl font-medium text-slate-900">Registration Successful!</h3>
                <p className="text-slate-500 max-w-sm">
                  Thank you for registering. We will reach out to you shortly with next steps.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-cyan-600 font-medium hover:text-cyan-700 transition-colors"
                >
                  Submit another response
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-slate-700 ml-1">Full Name</label>
                    <input
                      type="text" id="name" name="name" required
                      value={formData.name} onChange={handleChange}
                      className="w-full px-5 py-3.5 rounded-2xl bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 transition-all outline-none text-slate-800"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="college" className="text-sm font-medium text-slate-700 ml-1">College</label>
                    <input
                      type="text" id="college" name="college" required
                      value={formData.college} onChange={handleChange}
                      className="w-full px-5 py-3.5 rounded-2xl bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 transition-all outline-none text-slate-800"
                      placeholder="University Name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="course" className="text-sm font-medium text-slate-700 ml-1">Course</label>
                    <input
                      type="text" id="course" name="course" required
                      value={formData.course} onChange={handleChange}
                      className="w-full px-5 py-3.5 rounded-2xl bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 transition-all outline-none text-slate-800"
                      placeholder="e.g. B.Tech Computer Science"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="semester" className="text-sm font-medium text-slate-700 ml-1">Semester</label>
                    <div className="relative">
                      <select
                        id="semester" name="semester" required
                        value={formData.semester} onChange={handleChange}
                        className="w-full px-5 py-3.5 rounded-2xl bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 transition-all outline-none appearance-none text-slate-800"
                      >
                        <option value="" disabled>Select Semester</option>
                        {[1,2,3,4,5,6,7,8].map(n => (
                          <option key={n} value={String(n)}>{n}{n===1?"st":n===2?"nd":n===3?"rd":"th"} Semester</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-slate-700 ml-1">Phone Number</label>
                    <input
                      type="tel" id="phone" name="phone" required
                      value={formData.phone} onChange={handleChange}
                      className="w-full px-5 py-3.5 rounded-2xl bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 transition-all outline-none text-slate-800"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
                    <input
                      type="email" id="email" name="email" required
                      value={formData.email} onChange={handleChange}
                      className="w-full px-5 py-3.5 rounded-2xl bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 transition-all outline-none text-slate-800"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Payment Screenshot Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 ml-1">
                    Payment Screenshot <span className="text-cyan-600">*</span>
                  </label>

                  {paymentPreview ? (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                      <img
                        src={paymentPreview}
                        alt="Payment preview"
                        className="w-full max-h-48 object-contain p-2"
                      />
                      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-100">
                        <div className="flex items-center gap-2 text-sm text-slate-600 truncate">
                          <ImageIcon className="w-4 h-4 text-cyan-500 shrink-0" />
                          <span className="truncate">{paymentFile?.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="ml-3 shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="payment-screenshot"
                      className="flex flex-col items-center justify-center w-full py-8 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-cyan-50/40 hover:border-cyan-300 cursor-pointer transition-all group"
                    >
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-3 group-hover:border-cyan-200 transition-colors">
                        <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 transition-colors" />
                      </div>
                      <p className="text-sm font-medium text-slate-600 group-hover:text-cyan-700 transition-colors">
                        Click to upload payment screenshot
                      </p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
                      <input
                        ref={fileInputRef}
                        id="payment-screenshot"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>

                {error && (
                  <p className="text-red-500 text-sm ml-1 bg-red-50 py-2 px-4 rounded-xl border border-red-100">
                    {error}
                  </p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Registration"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Sidebar: QR & Contact */}
        <div className="lg:col-span-5 space-y-8 flex flex-col">
          {/* QR Code Card */}
          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center text-center">
            <h3 className="text-xl font-medium text-slate-800 mb-6">Scan QR Code</h3>
            <div className="w-48 h-48 sm:w-52 sm:h-52 relative bg-white rounded-2xl overflow-hidden border-2 border-slate-50 p-2 shadow-sm flex items-center justify-center hover:scale-[1.02] transition-transform duration-300">
              <Image
                src="/qr-code.png"
                alt="Connect Berg QR Code"
                width={200}
                height={200}
                className="w-full h-full object-contain rounded-xl"
                priority
              />
            </div>
            <p className="text-sm text-slate-500 mt-6 font-medium">
              Scan to quickly access our platform from your mobile device.
            </p>
          </div>

          {/* Contact Card */}
          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-slate-100 flex-grow flex flex-col justify-center">
            <h3 className="text-xl font-medium text-slate-800 mb-6">Contact Us</h3>
            <div className="space-y-4">
              <a
                href="tel:9048468404"
                className="flex items-center p-4 rounded-2xl bg-slate-50/80 hover:bg-cyan-50 transition-colors group border border-transparent hover:border-cyan-100"
              >
                <div className="w-11 h-11 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4 group-hover:text-cyan-600 transition-colors border border-slate-100">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-0.5">Phone Support</p>
                  <p className="text-slate-800 font-medium">9048468404</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100/80 py-8 mt-auto bg-slate-50/30">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-slate-400 text-sm">
          <p className="font-medium">&copy; {new Date().getFullYear()} Connect Berg. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
