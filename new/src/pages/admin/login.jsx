import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Shield } from "lucide-react";

const API = `${process.env.NEXT_PUBLIC_API_BASE || ""}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_elden-alumni/artifacts/0ansi0ti_LOGO-2.png";

const AdminLoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`${API}/auth/admin/login`, credentials);
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminEmail", res.data.email);
      toast.success("Welcome back, Admin!");
      router.push("/admin/dashboard");
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Login failed. Please check your credentials.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#6B0F2A] flex items-center justify-center p-4" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-white/50 hover:text-white mb-10 transition-colors text-sm"
          data-testid="back-home-link"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-none p-10 shadow-2xl">
          <div className="text-center mb-10">
            <img src={LOGO_URL} alt="EHSAS" className="h-20 w-auto mx-auto mb-6" />
            <h1 className="font-heading text-2xl font-bold text-[#2D2D2D]">Admin Portal</h1>
            <p className="text-[#4A4A4A] text-sm mt-2">
              EHSAS Administration Access
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="form-label" htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={credentials.email}
                onChange={handleChange}
                required
                className="input-heritage rounded-none h-12"
                placeholder="admin@example.com"
                data-testid="admin-email-input"
              />
            </div>
            <div>
              <Label className="form-label" htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="input-heritage rounded-none h-12"
                placeholder="••••••••"
                data-testid="admin-password-input"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#8B1C3A] text-white hover:bg-[#6B0F2A] rounded-none py-6 text-sm tracking-wider font-medium"
              data-testid="admin-login-btn"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-[#4A4A4A] text-xs mt-8">
            Access restricted to authorized personnel only.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-white/30 text-sm mt-10">
          © {new Date().getFullYear()} EHSAS — Elden Heights School Alumni Society
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
