import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Users,
  UserCheck,
  Calendar,
  Bell,
  LogOut,
  Home,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Plus,
  Star,
  Trash2,
  Edit,
} from "lucide-react";

const API = `${process.env.NEXT_PUBLIC_API_BASE || ""}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_elden-alumni/artifacts/0ansi0ti_LOGO-2.png";

const AdminDashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [pendingAlumni, setPendingAlumni] = useState([]);
  const [allAlumni, setAllAlumni] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [events, setEvents] = useState([]);
  const [spotlight, setSpotlight] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSpotlightModal, setShowSpotlightModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingSpotlight, setEditingSpotlight] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");

  const [spotlightForm, setSpotlightForm] = useState({
    name: "", batch: "", profession: "", achievement: "", category: "corporate", image_url: ""
  });
  const [eventForm, setEventForm] = useState({
    title: "", description: "", event_type: "reunion", date: "", time: "", location: "", image_url: ""
  });

  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("adminToken"));
    }
  }, []);

  useEffect(() => {
    if (token === null) {
      return;
    }
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchDashboardData();
  }, [token, router]);

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes, allRes, notifRes, eventsRes, spotlightRes] = await Promise.all([
        axios.get(`${API}/admin/stats`, getAuthHeaders()),
        axios.get(`${API}/alumni/pending`, getAuthHeaders()),
        axios.get(`${API}/alumni/all`, getAuthHeaders()),
        axios.get(`${API}/admin/notifications`, getAuthHeaders()),
        axios.get(`${API}/events`),
        axios.get(`${API}/spotlight`),
      ]);
      setStats(statsRes.data);
      setPendingAlumni(pendingRes.data);
      setAllAlumni(allRes.data);
      setNotifications(notifRes.data);
      setEvents(eventsRes.data);
      setSpotlight(spotlightRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (alumniId) => {
    try {
      const res = await axios.put(`${API}/alumni/${alumniId}/approve`, {}, getAuthHeaders());
      toast.success(res.data.message);
      fetchDashboardData();
      setShowDetailModal(false);
    } catch (err) {
      toast.error("Failed to approve alumni");
    }
  };

  const handleReject = async (alumniId) => {
    try {
      await axios.put(`${API}/alumni/${alumniId}/reject`, {}, getAuthHeaders());
      toast.success("Alumni registration rejected");
      fetchDashboardData();
      setShowDetailModal(false);
    } catch (err) {
      toast.error("Failed to reject alumni");
    }
  };

  // Spotlight CRUD
  const handleAddSpotlight = () => {
    setEditingSpotlight(null);
    setSpotlightForm({ name: "", batch: "", profession: "", achievement: "", category: "corporate", image_url: "" });
    setShowSpotlightModal(true);
  };

  const handleEditSpotlight = (item) => {
    setEditingSpotlight(item);
    setSpotlightForm({
      name: item.name,
      batch: item.batch,
      profession: item.profession,
      achievement: item.achievement,
      category: item.category,
      image_url: item.image_url || ""
    });
    setShowSpotlightModal(true);
  };

  const handleSaveSpotlight = async () => {
    try {
      if (editingSpotlight) {
        await axios.put(`${API}/spotlight/${editingSpotlight.id}`, spotlightForm, getAuthHeaders());
        toast.success("Spotlight alumni updated");
      } else {
        await axios.post(`${API}/spotlight`, spotlightForm, getAuthHeaders());
        toast.success("Spotlight alumni added");
      }
      setShowSpotlightModal(false);
      fetchDashboardData();
    } catch (err) {
      toast.error("Failed to save spotlight alumni");
    }
  };

  const handleDeleteSpotlight = async (id) => {
    if (!confirm("Are you sure you want to delete this spotlight alumni?")) return;
    try {
      await axios.delete(`${API}/spotlight/${id}`, getAuthHeaders());
      toast.success("Spotlight alumni deleted");
      fetchDashboardData();
    } catch (err) {
      toast.error("Failed to delete spotlight alumni");
    }
  };

  // Events CRUD
  const handleAddEvent = () => {
    setEditingEvent(null);
    setEventForm({ title: "", description: "", event_type: "reunion", date: "", time: "", location: "", image_url: "" });
    setShowEventModal(true);
  };

  const handleEditEvent = (item) => {
    setEditingEvent(item);
    setEventForm({
      title: item.title,
      description: item.description,
      event_type: item.event_type,
      date: item.date,
      time: item.time,
      location: item.location,
      image_url: item.image_url || ""
    });
    setShowEventModal(true);
  };

  const handleSaveEvent = async () => {
    try {
      if (editingEvent) {
        await axios.put(`${API}/events/${editingEvent.id}`, eventForm, getAuthHeaders());
        toast.success("Event updated");
      } else {
        await axios.post(`${API}/events`, eventForm, getAuthHeaders());
        toast.success("Event created");
      }
      setShowEventModal(false);
      fetchDashboardData();
    } catch (err) {
      toast.error("Failed to save event");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`${API}/events/${id}`, getAuthHeaders());
      toast.success("Event deleted");
      fetchDashboardData();
    } catch (err) {
      toast.error("Failed to delete event");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    router.push("/admin/login");
  };

  const viewAlumniDetail = (alumni) => {
    setSelectedAlumni(alumni);
    setShowDetailModal(true);
  };

  const filteredAllAlumni = allAlumni.filter(
    (a) =>
      a.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 rounded-none text-xs">Approved</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 rounded-none text-xs">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 rounded-none text-xs">Rejected</Badge>;
      default:
        return <Badge className="rounded-none text-xs">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
        <p className="text-[#2D2D2D]">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3]" data-testid="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar fixed left-0 top-0 w-64 h-full z-40">
        <div className="p-6 border-b border-white/10">
          <img src={LOGO_URL} alt="EHSAS" className="h-12 w-auto brightness-0 invert" />
        </div>
        <nav className="py-6">
          <button
            onClick={() => setActiveTab("pending")}
            className={`admin-nav-item w-full ${activeTab === "pending" ? "active" : ""}`}
            data-testid="nav-pending"
          >
            <UserCheck size={18} />
            Pending Approvals
            {pendingAlumni.length > 0 && (
              <Badge className="ml-auto bg-[#C9A227] text-[#2D2D2D] rounded-none text-xs px-2">
                {pendingAlumni.length}
              </Badge>
            )}
          </button>
          <button
            onClick={() => setActiveTab("directory")}
            className={`admin-nav-item w-full ${activeTab === "directory" ? "active" : ""}`}
            data-testid="nav-directory"
          >
            <Users size={18} />
            All Alumni
          </button>
          <button
            onClick={() => setActiveTab("spotlight")}
            className={`admin-nav-item w-full ${activeTab === "spotlight" ? "active" : ""}`}
            data-testid="nav-spotlight"
          >
            <Star size={18} />
            Spotlight
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`admin-nav-item w-full ${activeTab === "events" ? "active" : ""}`}
            data-testid="nav-events"
          >
            <Calendar size={18} />
            Events
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`admin-nav-item w-full ${activeTab === "notifications" ? "active" : ""}`}
            data-testid="nav-notifications"
          >
            <Bell size={18} />
            Notifications
            {notifications.filter((n) => !n.is_read).length > 0 && (
              <Badge className="ml-auto bg-[#C9A227] text-[#2D2D2D] rounded-none text-xs px-2">
                {notifications.filter((n) => !n.is_read).length}
              </Badge>
            )}
          </button>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Link href="/" className="admin-nav-item mb-2" data-testid="nav-home">
            <Home size={18} />
            View Site
          </Link>
          <button onClick={handleLogout} className="admin-nav-item w-full text-[#C9A227] hover:text-[#D4B84A]" data-testid="logout-btn">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="stat-card rounded-none" data-testid="stat-total-alumni">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Total Alumni</p>
                <p className="stat-number">{stats?.total_alumni || 0}</p>
              </div>
              <Users className="w-10 h-10 text-[#C9A227]" />
            </div>
          </div>
          <div className="stat-card rounded-none" data-testid="stat-pending">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Pending</p>
                <p className="stat-number">{stats?.pending_registrations || 0}</p>
              </div>
              <UserCheck className="w-10 h-10 text-[#8B1C3A]" />
            </div>
          </div>
          <div className="stat-card rounded-none" data-testid="stat-spotlight">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Spotlight</p>
                <p className="stat-number">{spotlight.length}</p>
              </div>
              <Star className="w-10 h-10 text-[#C9A227]" />
            </div>
          </div>
          <div className="stat-card rounded-none" data-testid="stat-events">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Events</p>
                <p className="stat-number">{events.length}</p>
              </div>
              <Calendar className="w-10 h-10 text-[#8B1C3A]" />
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-[#8B1C3A]/8 rounded-none">
          {/* Pending Approvals */}
          {activeTab === "pending" && (
            <div className="p-8">
              <h2 className="font-heading text-2xl font-semibold text-[#2D2D2D] mb-8">Pending Registrations</h2>
              {pendingAlumni.length === 0 ? (
                <div className="text-center py-16">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-[#4A4A4A]">No pending registrations!</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[#4A4A4A] text-xs tracking-wider">Name</TableHead>
                      <TableHead className="text-[#4A4A4A] text-xs tracking-wider">Email</TableHead>
                      <TableHead className="text-[#4A4A4A] text-xs tracking-wider">Batch</TableHead>
                      <TableHead className="text-[#4A4A4A] text-xs tracking-wider">City</TableHead>
                      <TableHead className="text-[#4A4A4A] text-xs tracking-wider">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingAlumni.map((alumni, index) => (
                      <TableRow key={alumni.id} data-testid={`pending-row-${index}`}>
                        <TableCell className="font-medium text-[#2D2D2D]">{alumni.first_name} {alumni.last_name}</TableCell>
                        <TableCell className="text-[#4A4A4A]">{alumni.email}</TableCell>
                        <TableCell className="text-[#4A4A4A]">{alumni.year_of_leaving}</TableCell>
                        <TableCell className="text-[#4A4A4A]">{alumni.city}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="rounded-none h-8 w-8 p-0" onClick={() => viewAlumniDetail(alumni)} data-testid={`view-btn-${index}`}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 rounded-none h-8 w-8 p-0" onClick={() => handleApprove(alumni.id)} data-testid={`approve-btn-${index}`}>
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button size="sm" className="bg-[#8B1C3A] hover:bg-[#6B0F2A] rounded-none h-8 w-8 p-0" onClick={() => handleReject(alumni.id)} data-testid={`reject-btn-${index}`}>
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}

          {/* All Alumni */}
          {activeTab === "directory" && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-heading text-2xl font-semibold text-[#2D2D2D]">All Alumni</h2>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#4A4A4A]" />
                  <Input placeholder="Search alumni..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 rounded-none h-10" data-testid="search-alumni" />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#4A4A4A] text-xs tracking-wider">EHSAS ID</TableHead>
                    <TableHead className="text-[#4A4A4A] text-xs tracking-wider">Name</TableHead>
                    <TableHead className="text-[#4A4A4A] text-xs tracking-wider">Email</TableHead>
                    <TableHead className="text-[#4A4A4A] text-xs tracking-wider">Batch</TableHead>
                    <TableHead className="text-[#4A4A4A] text-xs tracking-wider">Status</TableHead>
                    <TableHead className="text-[#4A4A4A] text-xs tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAllAlumni.map((alumni, index) => (
                    <TableRow key={alumni.id} data-testid={`alumni-row-${index}`}>
                      <TableCell className="font-mono text-[#8B1C3A] font-medium">{alumni.ehsas_id || "—"}</TableCell>
                      <TableCell className="text-[#2D2D2D]">{alumni.first_name} {alumni.last_name}</TableCell>
                      <TableCell className="text-[#4A4A4A]">{alumni.email}</TableCell>
                      <TableCell className="text-[#4A4A4A]">{alumni.year_of_leaving}</TableCell>
                      <TableCell>{getStatusBadge(alumni.status)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" className="rounded-none h-8 w-8 p-0" onClick={() => viewAlumniDetail(alumni)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Spotlight Management */}
          {activeTab === "spotlight" && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-heading text-2xl font-semibold text-[#2D2D2D]">Spotlight Alumni</h2>
                <Button onClick={handleAddSpotlight} className="bg-[#8B1C3A] hover:bg-[#6B0F2A] rounded-none" data-testid="add-spotlight-btn">
                  <Plus className="w-4 h-4 mr-2" /> Add Spotlight
                </Button>
              </div>
              {spotlight.length === 0 ? (
                <div className="text-center py-16">
                  <Star className="w-12 h-12 text-[#C9A227]/30 mx-auto mb-4" />
                  <p className="text-[#4A4A4A]">No spotlight alumni yet. Add your first one!</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[#4A4A4A] text-xs tracking-wider">Name</TableHead>
                      <TableHead className="text-[#4A4A4A] text-xs tracking-wider">Batch</TableHead>
                      <TableHead className="text-[#4A4A4A] text-xs tracking-wider">Category</TableHead>
                      <TableHead className="text-[#4A4A4A] text-xs tracking-wider">Achievement</TableHead>
                      <TableHead className="text-[#4A4A4A] text-xs tracking-wider">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {spotlight.map((item, index) => (
                      <TableRow key={item.id} data-testid={`spotlight-row-${index}`}>
                        <TableCell className="font-medium text-[#2D2D2D]">{item.name}</TableCell>
                        <TableCell className="text-[#4A4A4A]">{item.batch}</TableCell>
                        <TableCell className="capitalize text-[#4A4A4A]">{item.category.replace("_", " ")}</TableCell>
                        <TableCell className="text-[#4A4A4A] max-w-xs truncate">{item.achievement}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="rounded-none h-8 w-8 p-0" onClick={() => handleEditSpotlight(item)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" className="bg-[#8B1C3A] hover:bg-[#6B0F2A] rounded-none h-8 w-8 p-0" onClick={() => handleDeleteSpotlight(item.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}

          {/* Events Management */}
          {activeTab === "events" && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-heading text-2xl font-semibold text-[#2D2D2D]">Events Management</h2>
                <Button onClick={handleAddEvent} className="bg-[#8B1C3A] hover:bg-[#6B0F2A] rounded-none" data-testid="add-event-btn">
                  <Plus className="w-4 h-4 mr-2" /> Add Event
                </Button>
              </div>
              {events.length === 0 ? (
                <div className="text-center py-16">
                  <Calendar className="w-12 h-12 text-[#8B1C3A]/30 mx-auto mb-4" />
                  <p className="text-[#4A4A4A]">No events yet. Create your first event!</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[#4A4A4A] text-xs tracking-wider">Title</TableHead>
                      <TableHead className="text-[#4A4A4A] text-xs tracking-wider">Type</TableHead>
                      <TableHead className="text-[#4A4A4A] text-xs tracking-wider">Date</TableHead>
                      <TableHead className="text-[#4A4A4A] text-xs tracking-wider">Location</TableHead>
                      <TableHead className="text-[#4A4A4A] text-xs tracking-wider">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event, index) => (
                      <TableRow key={event.id} data-testid={`event-row-${index}`}>
                        <TableCell className="font-medium text-[#2D2D2D]">{event.title}</TableCell>
                        <TableCell className="capitalize text-[#4A4A4A]">{event.event_type}</TableCell>
                        <TableCell className="text-[#4A4A4A]">{event.date}</TableCell>
                        <TableCell className="text-[#4A4A4A]">{event.location}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="rounded-none h-8 w-8 p-0" onClick={() => handleEditEvent(event)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" className="bg-[#8B1C3A] hover:bg-[#6B0F2A] rounded-none h-8 w-8 p-0" onClick={() => handleDeleteEvent(event.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="p-8">
              <h2 className="font-heading text-2xl font-semibold text-[#2D2D2D] mb-8">Notifications</h2>
              {notifications.length === 0 ? (
                <div className="text-center py-16">
                  <Bell className="w-12 h-12 text-[#2D2D2D]/20 mx-auto mb-4" />
                  <p className="text-[#4A4A4A]">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notif, index) => (
                    <div key={notif.id} className={`p-5 border rounded-none ${notif.is_read ? "bg-white" : "bg-[#F5F0E6] border-[#C9A227]/30"}`} data-testid={`notification-${index}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-[#2D2D2D]">{notif.title}</h4>
                          <p className="text-[#4A4A4A] text-sm mt-1">{notif.message}</p>
                        </div>
                        {!notif.is_read && <Badge className="bg-[#C9A227] text-[#2D2D2D] rounded-none text-xs">New</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Alumni Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl rounded-none">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl text-[#2D2D2D]">Alumni Details</DialogTitle>
            <DialogDescription className="text-[#4A4A4A]">Review the registration details below</DialogDescription>
          </DialogHeader>
          {selectedAlumni && (
            <div className="grid grid-cols-2 gap-4 py-6">
              <div><p className="text-xs text-[#4A4A4A] tracking-wider uppercase">Full Name</p><p className="font-medium text-[#2D2D2D] mt-1">{selectedAlumni.first_name} {selectedAlumni.last_name}</p></div>
              <div><p className="text-xs text-[#4A4A4A] tracking-wider uppercase">Email</p><p className="font-medium text-[#2D2D2D] mt-1">{selectedAlumni.email}</p></div>
              <div><p className="text-xs text-[#4A4A4A] tracking-wider uppercase">Mobile</p><p className="font-medium text-[#2D2D2D] mt-1">{selectedAlumni.mobile}</p></div>
              <div><p className="text-xs text-[#4A4A4A] tracking-wider uppercase">Batch</p><p className="font-medium text-[#2D2D2D] mt-1">{selectedAlumni.year_of_joining} - {selectedAlumni.year_of_leaving}</p></div>
              <div><p className="text-xs text-[#4A4A4A] tracking-wider uppercase">Status</p><div className="mt-1">{getStatusBadge(selectedAlumni.status)}</div></div>
              {selectedAlumni.ehsas_id && <div><p className="text-xs text-[#4A4A4A] tracking-wider uppercase">EHSAS ID</p><p className="font-mono font-bold text-[#8B1C3A] mt-1">{selectedAlumni.ehsas_id}</p></div>}
            </div>
          )}
          {selectedAlumni?.status === "pending" && (
            <DialogFooter className="gap-2">
              <Button variant="outline" className="rounded-none" onClick={() => handleReject(selectedAlumni.id)}>
                <XCircle className="w-4 h-4 mr-2" /> Reject
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 rounded-none" onClick={() => handleApprove(selectedAlumni.id)}>
                <CheckCircle className="w-4 h-4 mr-2" /> Approve
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Spotlight Modal */}
      <Dialog open={showSpotlightModal} onOpenChange={setShowSpotlightModal}>
        <DialogContent className="max-w-lg rounded-none">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl text-[#2D2D2D]">{editingSpotlight ? "Edit" : "Add"} Spotlight Alumni</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label className="text-sm font-medium">Name *</Label><Input value={spotlightForm.name} onChange={(e) => setSpotlightForm({...spotlightForm, name: e.target.value})} className="rounded-none mt-1" data-testid="spotlight-name" /></div>
            <div><Label className="text-sm font-medium">Batch Year *</Label><Input value={spotlightForm.batch} onChange={(e) => setSpotlightForm({...spotlightForm, batch: e.target.value})} placeholder="e.g., 2015" className="rounded-none mt-1" data-testid="spotlight-batch" /></div>
            <div><Label className="text-sm font-medium">Profession *</Label><Input value={spotlightForm.profession} onChange={(e) => setSpotlightForm({...spotlightForm, profession: e.target.value})} className="rounded-none mt-1" data-testid="spotlight-profession" /></div>
            <div><Label className="text-sm font-medium">Achievement *</Label><Input value={spotlightForm.achievement} onChange={(e) => setSpotlightForm({...spotlightForm, achievement: e.target.value})} className="rounded-none mt-1" data-testid="spotlight-achievement" /></div>
            <div>
              <Label className="text-sm font-medium">Category *</Label>
              <Select value={spotlightForm.category} onValueChange={(val) => setSpotlightForm({...spotlightForm, category: val})}>
                <SelectTrigger className="rounded-none mt-1" data-testid="spotlight-category"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="doctor">Healthcare</SelectItem>
                  <SelectItem value="founder">Entrepreneur</SelectItem>
                  <SelectItem value="civil_servant">Civil Service</SelectItem>
                  <SelectItem value="creator">Creator</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-sm font-medium">Image URL</Label><Input value={spotlightForm.image_url} onChange={(e) => setSpotlightForm({...spotlightForm, image_url: e.target.value})} placeholder="https://..." className="rounded-none mt-1" data-testid="spotlight-image" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setShowSpotlightModal(false)}>Cancel</Button>
            <Button className="bg-[#8B1C3A] hover:bg-[#6B0F2A] rounded-none" onClick={handleSaveSpotlight} data-testid="save-spotlight-btn">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Modal */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="max-w-lg rounded-none">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl text-[#2D2D2D]">{editingEvent ? "Edit" : "Add"} Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label className="text-sm font-medium">Title *</Label><Input value={eventForm.title} onChange={(e) => setEventForm({...eventForm, title: e.target.value})} className="rounded-none mt-1" data-testid="event-title" /></div>
            <div><Label className="text-sm font-medium">Description *</Label><Textarea value={eventForm.description} onChange={(e) => setEventForm({...eventForm, description: e.target.value})} className="rounded-none mt-1" data-testid="event-description" /></div>
            <div>
              <Label className="text-sm font-medium">Event Type *</Label>
              <Select value={eventForm.event_type} onValueChange={(val) => setEventForm({...eventForm, event_type: val})}>
                <SelectTrigger className="rounded-none mt-1" data-testid="event-type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="reunion">Reunion</SelectItem>
                  <SelectItem value="webinar">Webinar</SelectItem>
                  <SelectItem value="campus">Campus Event</SelectItem>
                  <SelectItem value="meetup">Meetup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-sm font-medium">Date *</Label><Input type="date" value={eventForm.date} onChange={(e) => setEventForm({...eventForm, date: e.target.value})} className="rounded-none mt-1" data-testid="event-date" /></div>
              <div><Label className="text-sm font-medium">Time *</Label><Input value={eventForm.time} onChange={(e) => setEventForm({...eventForm, time: e.target.value})} placeholder="e.g., 6:00 PM" className="rounded-none mt-1" data-testid="event-time" /></div>
            </div>
            <div><Label className="text-sm font-medium">Location *</Label><Input value={eventForm.location} onChange={(e) => setEventForm({...eventForm, location: e.target.value})} className="rounded-none mt-1" data-testid="event-location" /></div>
            <div><Label className="text-sm font-medium">Image URL</Label><Input value={eventForm.image_url} onChange={(e) => setEventForm({...eventForm, image_url: e.target.value})} placeholder="https://..." className="rounded-none mt-1" data-testid="event-image" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setShowEventModal(false)}>Cancel</Button>
            <Button className="bg-[#8B1C3A] hover:bg-[#6B0F2A] rounded-none" onClick={handleSaveEvent} data-testid="save-event-btn">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
