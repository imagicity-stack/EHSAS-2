import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, MapPin, Briefcase, GraduationCap, Users } from "lucide-react";

const API = `${process.env.NEXT_PUBLIC_API_BASE || ""}/api`;

const DirectoryPage = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    batch: "",
    profession: "",
    city: "",
  });

  useEffect(() => {
    fetchAlumni();
  }, [filters]);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.batch) params.append("batch", filters.batch);
      if (filters.profession) params.append("profession", filters.profession);
      if (filters.city) params.append("city", filters.city);
      params.append("status", "approved");

      const res = await axios.get(`${API}/alumni?${params.toString()}`);
      setAlumni(res.data);
    } catch (err) {
      console.error("Error fetching alumni:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value === "all" ? "" : value }));
  };

  const currentYear = new Date().getFullYear();
  const batchYears = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-[#FAF8F3]" data-testid="directory-page">
      <Navbar />

      <div className="pt-32 pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-[#C9A227] font-medium tracking-[0.2em] uppercase text-xs">
              Find Your Peers
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#2D2D2D] mt-4 mb-4">
              Alumni Directory
            </h1>
            <div className="section-divider mx-auto"></div>
            <p className="text-[#4A4A4A] text-lg max-w-2xl mx-auto mt-6">
              Connect with fellow Eldenites. Search by batch, profession, or city 
              to find and reconnect with your schoolmates.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="bg-white border border-[#8B1C3A]/8 rounded-none p-8 mb-10">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label className="text-[#2D2D2D] font-medium mb-2 block text-sm">
                  <GraduationCap className="w-4 h-4 inline mr-2" />
                  Batch (Year of Leaving)
                </Label>
                <Select value={filters.batch || "all"} onValueChange={(val) => handleFilterChange("batch", val)}>
                  <SelectTrigger className="input-heritage rounded-none h-12" data-testid="filter-batch">
                    <SelectValue placeholder="All Batches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Batches</SelectItem>
                    {batchYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>Batch of {year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[#2D2D2D] font-medium mb-2 block text-sm">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Profession
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#4A4A4A]" />
                  <Input placeholder="Search profession..." value={filters.profession} onChange={(e) => handleFilterChange("profession", e.target.value)} className="input-heritage rounded-none pl-10 h-12" data-testid="filter-profession" />
                </div>
              </div>
              <div>
                <Label className="text-[#2D2D2D] font-medium mb-2 block text-sm">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  City
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#4A4A4A]" />
                  <Input placeholder="Search city..." value={filters.city} onChange={(e) => handleFilterChange("city", e.target.value)} className="input-heritage rounded-none pl-10 h-12" data-testid="filter-city" />
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-[#4A4A4A] text-sm">
              <Users className="w-4 h-4 inline mr-2" />
              <span className="font-semibold text-[#2D2D2D]">{alumni.length}</span> alumni found
            </p>
          </div>

          {/* Alumni Grid */}
          {loading ? (
            <div className="text-center py-16">
              <p className="text-[#4A4A4A]">Loading alumni...</p>
            </div>
          ) : alumni.length === 0 ? (
            <div className="text-center py-16 bg-white border border-[#8B1C3A]/8 rounded-none">
              <Users className="w-12 h-12 text-[#8B1C3A]/20 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold text-[#2D2D2D] mb-2">
                No Alumni Found
              </h3>
              <p className="text-[#4A4A4A]">
                Try adjusting your search filters or check back later.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {alumni.map((person, index) => (
                <Card key={person.id} className="alumni-card rounded-none" data-testid={`alumni-card-${index}`}>
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="mb-4">
                        <Badge className="bg-[#8B1C3A] text-white rounded-none mb-3 text-xs">
                          Batch of {person.year_of_leaving}
                        </Badge>
                        <h3 className="font-heading text-lg font-semibold text-[#2D2D2D]">
                          {person.first_name} {person.last_name}
                        </h3>
                        {person.ehsas_id && (
                          <p className="text-xs text-[#C9A227] font-mono mt-1 font-semibold">
                            {person.ehsas_id}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        {person.profession && (
                          <div className="flex items-center gap-2 text-[#4A4A4A]">
                            <Briefcase className="w-4 h-4 text-[#C9A227]" />
                            <span>{person.profession}</span>
                          </div>
                        )}
                        {person.organization && (
                          <p className="text-[#2D2D2D] font-medium pl-6">{person.organization}</p>
                        )}
                        <div className="flex items-center gap-2 text-[#4A4A4A]">
                          <MapPin className="w-4 h-4 text-[#C9A227]" />
                          <span>{person.city}, {person.country}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DirectoryPage;
