import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Shield } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminLoginPage = () => {
  const navigate = useNavigate();
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
      navigate("/admin/dashboard");
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Login failed. Please check your credentials.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center p-4" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center text-white/50 hover:text-white mb-10 transition-colors text-sm"
          data-testid="back-home-link"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-none p-10 shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 border border-[#0D1B2A] flex items-center justify-center mx-auto mb-6">
              <Shield className="w-7 h-7 text-[#0D1B2A]" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-[#0D1B2A]">Admin Portal</h1>
            <p className="text-[#778DA9] text-sm mt-2">
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
              className="w-full bg-[#0D1B2A] text-white hover:bg-[#1B263B] rounded-none py-6 text-sm tracking-wider font-medium"
              data-testid="admin-login-btn"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-[#778DA9] text-xs mt-8">
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
