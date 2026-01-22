import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, CheckCircle } from "lucide-react";

const API = `${process.env.NEXT_PUBLIC_API_BASE || ""}/api`;

const RegisterPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    year_of_joining: "",
    year_of_leaving: "",
    class_of_joining: "",
    last_class_studied: "",
    last_house: "",
    full_address: "",
    city: "",
    pincode: "",
    state: "",
    country: "India",
    profession: "",
    organization: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        year_of_joining: parseInt(formData.year_of_joining),
        year_of_leaving: parseInt(formData.year_of_leaving),
      };
      await axios.post(`${API}/alumni/register`, submitData);
      setIsSuccess(true);
      toast.success("Registration submitted successfully!");
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Registration failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  const classes = ["Nursery", "LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const houses = ["Red House", "Blue House", "Green House", "Yellow House"];

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#FAF8F3]" data-testid="register-success">
        <Navbar />
        <div className="pt-36 pb-28">
          <div className="max-w-xl mx-auto px-4 text-center">
            <div className="w-20 h-20 border-2 border-green-600 flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-4">
              Registration Submitted
            </h1>
            <p className="text-[#4A4A4A] text-lg mb-10 leading-relaxed">
              Thank you for registering with EHSAS. Your application has been received and is pending verification.
              Once approved, you will receive your official EHSAS ID via email.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-[#8B1C3A] text-white hover:bg-[#6B0F2A] rounded-none px-8 py-5"
              data-testid="back-home-btn"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3]" data-testid="register-page">
      <Navbar />

      <div className="pt-32 pb-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-[#C9A227] font-medium tracking-[0.2em] uppercase text-xs">
              Join the Community
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#2D2D2D] mt-4 mb-4">
              Alumni Registration
            </h1>
            <div className="section-divider mx-auto"></div>
            <p className="text-[#4A4A4A] text-lg max-w-2xl mx-auto mt-6">
              Join the official EHSAS alumni network. Your registration will be verified 
              before you receive your official EHSAS membership ID.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="form-section rounded-none p-10 md:p-14">
            {/* Student's Profile */}
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-semibold text-[#2D2D2D] mb-8 pb-3 border-b border-[#8B1C3A]/10">
                Student's Profile
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="form-label" htmlFor="first_name">First Name *</Label>
                  <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required className="input-heritage rounded-none h-12" data-testid="input-first-name" />
                </div>
                <div>
                  <Label className="form-label" htmlFor="last_name">Last Name *</Label>
                  <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required className="input-heritage rounded-none h-12" data-testid="input-last-name" />
                </div>
                <div>
                  <Label className="form-label" htmlFor="email">Email ID *</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="input-heritage rounded-none h-12" data-testid="input-email" />
                </div>
                <div>
                  <Label className="form-label" htmlFor="mobile">Mobile Number *</Label>
                  <Input id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} required className="input-heritage rounded-none h-12" data-testid="input-mobile" />
                </div>
                <div>
                  <Label className="form-label" htmlFor="year_of_joining">Year of Joining *</Label>
                  <Select value={formData.year_of_joining} onValueChange={(val) => handleSelectChange("year_of_joining", val)}>
                    <SelectTrigger className="input-heritage rounded-none h-12" data-testid="select-year-joining"><SelectValue placeholder="Select year" /></SelectTrigger>
                    <SelectContent>{years.map((year) => (<SelectItem key={year} value={year.toString()}>{year}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="form-label" htmlFor="year_of_leaving">Year of Leaving *</Label>
                  <Select value={formData.year_of_leaving} onValueChange={(val) => handleSelectChange("year_of_leaving", val)}>
                    <SelectTrigger className="input-heritage rounded-none h-12" data-testid="select-year-leaving"><SelectValue placeholder="Select year" /></SelectTrigger>
                    <SelectContent>{years.map((year) => (<SelectItem key={year} value={year.toString()}>{year}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="form-label" htmlFor="class_of_joining">Class of Joining *</Label>
                  <Select value={formData.class_of_joining} onValueChange={(val) => handleSelectChange("class_of_joining", val)}>
                    <SelectTrigger className="input-heritage rounded-none h-12" data-testid="select-class-joining"><SelectValue placeholder="Select class" /></SelectTrigger>
                    <SelectContent>{classes.map((cls) => (<SelectItem key={cls} value={cls}>{cls}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="form-label" htmlFor="last_class_studied">Last Class Studied *</Label>
                  <Select value={formData.last_class_studied} onValueChange={(val) => handleSelectChange("last_class_studied", val)}>
                    <SelectTrigger className="input-heritage rounded-none h-12" data-testid="select-last-class"><SelectValue placeholder="Select class" /></SelectTrigger>
                    <SelectContent>{classes.map((cls) => (<SelectItem key={cls} value={cls}>{cls}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="form-label" htmlFor="last_house">Last House while in School *</Label>
                  <Select value={formData.last_house} onValueChange={(val) => handleSelectChange("last_house", val)}>
                    <SelectTrigger className="input-heritage rounded-none h-12" data-testid="select-house"><SelectValue placeholder="Select house" /></SelectTrigger>
                    <SelectContent>{houses.map((house) => (<SelectItem key={house} value={house}>{house}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="form-label" htmlFor="profession">Current Profession</Label>
                  <Input id="profession" name="profession" value={formData.profession} onChange={handleChange} className="input-heritage rounded-none h-12" placeholder="e.g., Software Engineer" data-testid="input-profession" />
                </div>
                <div className="md:col-span-2">
                  <Label className="form-label" htmlFor="organization">Current Organization</Label>
                  <Input id="organization" name="organization" value={formData.organization} onChange={handleChange} className="input-heritage rounded-none h-12" placeholder="e.g., Google India" data-testid="input-organization" />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-semibold text-[#2D2D2D] mb-8 pb-3 border-b border-[#8B1C3A]/10">
                Address
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label className="form-label" htmlFor="full_address">Full Address *</Label>
                  <Input id="full_address" name="full_address" value={formData.full_address} onChange={handleChange} required className="input-heritage rounded-none h-12" data-testid="input-address" />
                </div>
                <div>
                  <Label className="form-label" htmlFor="city">City *</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleChange} required className="input-heritage rounded-none h-12" data-testid="input-city" />
                </div>
                <div>
                  <Label className="form-label" htmlFor="pincode">Pincode *</Label>
                  <Input id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} required className="input-heritage rounded-none h-12" data-testid="input-pincode" />
                </div>
                <div>
                  <Label className="form-label" htmlFor="state">State *</Label>
                  <Input id="state" name="state" value={formData.state} onChange={handleChange} required className="input-heritage rounded-none h-12" data-testid="input-state" />
                </div>
                <div>
                  <Label className="form-label" htmlFor="country">Country *</Label>
                  <Input id="country" name="country" value={formData.country} onChange={handleChange} required className="input-heritage rounded-none h-12" data-testid="input-country" />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="text-center pt-8">
              <Button type="submit" disabled={isSubmitting} className="bg-[#8B1C3A] text-white hover:bg-[#6B0F2A] rounded-none px-14 py-6 text-sm tracking-wider font-medium shadow-xl" data-testid="submit-registration-btn">
                {isSubmitting ? "Submitting..." : "Submit Registration"}
              </Button>
              <p className="text-[#4A4A4A] text-sm mt-6">
                By registering, you agree to be part of the official EHSAS alumni network.
              </p>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterPage;
