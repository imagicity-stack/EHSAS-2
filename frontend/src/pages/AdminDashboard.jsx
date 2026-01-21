import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pendingAlumni, setPendingAlumni] = useState([]);
  const [allAlumni, setAllAlumni] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchDashboardData();
  }, [token, navigate]);

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes, allRes, notifRes, eventsRes] = await Promise.all([
        axios.get(`${API}/admin/stats`, getAuthHeaders()),
        axios.get(`${API}/alumni/pending`, getAuthHeaders()),
        axios.get(`${API}/alumni/all`, getAuthHeaders()),
        axios.get(`${API}/admin/notifications`, getAuthHeaders()),
        axios.get(`${API}/events`),
      ]);
      setStats(statsRes.data);
      setPendingAlumni(pendingRes.data);
      setAllAlumni(allRes.data);
      setNotifications(notifRes.data);
      setEvents(eventsRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
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

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    navigate("/admin/login");
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
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <p className="text-[#0D1B2A]">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]" data-testid="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar fixed left-0 top-0 w-64 h-full z-40">
        <div className="p-6 border-b border-white/10">
          <h1 className="font-heading text-2xl font-bold text-white">EHSAS</h1>
          <p className="text-[#778DA9] text-xs tracking-wider mt-1">ADMIN PORTAL</p>
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
              <Badge className="ml-auto bg-[#6B0F1A] text-white rounded-none text-xs px-2">
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
              <Badge className="ml-auto bg-[#6B0F1A] text-white rounded-none text-xs px-2">
                {notifications.filter((n) => !n.is_read).length}
              </Badge>
            )}
          </button>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Link
            to="/"
            className="admin-nav-item mb-2"
            data-testid="nav-home"
          >
            <Home size={18} />
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="admin-nav-item w-full text-[#6B0F1A] hover:text-[#8B1E2F]"
            data-testid="logout-btn"
          >
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
              <Users className="w-10 h-10 text-[#778DA9]" />
            </div>
          </div>
          <div className="stat-card rounded-none" data-testid="stat-pending">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Pending</p>
                <p className="stat-number">{stats?.pending_registrations || 0}</p>
              </div>
              <UserCheck className="w-10 h-10 text-[#6B0F1A]" />
            </div>
          </div>
          <div className="stat-card rounded-none" data-testid="stat-events">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Active Events</p>
                <p className="stat-number">{stats?.total_events || 0}</p>
              </div>
              <Calendar className="w-10 h-10 text-[#0D1B2A]" />
            </div>
          </div>
          <div className="stat-card rounded-none" data-testid="stat-notifications">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Notifications</p>
                <p className="stat-number">{notifications.filter((n) => !n.is_read).length}</p>
              </div>
              <Bell className="w-10 h-10 text-[#778DA9]" />
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-[#0D1B2A]/8 rounded-none">
          {/* Pending Approvals */}
          {activeTab === "pending" && (
            <div className="p-8">
              <h2 className="font-heading text-2xl font-semibold text-[#0D1B2A] mb-8">
                Pending Registrations
              </h2>
              {pendingAlumni.length === 0 ? (
                <div className="text-center py-16">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-[#778DA9]">No pending registrations!</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[#778DA9] text-xs tracking-wider">Name</TableHead>
                      <TableHead className="text-[#778DA9] text-xs tracking-wider">Email</TableHead>
                      <TableHead className="text-[#778DA9] text-xs tracking-wider">Batch</TableHead>
                      <TableHead className="text-[#778DA9] text-xs tracking-wider">City</TableHead>
                      <TableHead className="text-[#778DA9] text-xs tracking-wider">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingAlumni.map((alumni, index) => (
                      <TableRow key={alumni.id} data-testid={`pending-row-${index}`}>
                        <TableCell className="font-medium text-[#0D1B2A]">
                          {alumni.first_name} {alumni.last_name}
                        </TableCell>
                        <TableCell className="text-[#415A77]">{alumni.email}</TableCell>
                        <TableCell className="text-[#415A77]">{alumni.year_of_leaving}</TableCell>
                        <TableCell className="text-[#415A77]">{alumni.city}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-none h-8 w-8 p-0"
                              onClick={() => viewAlumniDetail(alumni)}
                              data-testid={`view-btn-${index}`}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 rounded-none h-8 w-8 p-0"
                              onClick={() => handleApprove(alumni.id)}
                              data-testid={`approve-btn-${index}`}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-[#6B0F1A] hover:bg-[#8B1E2F] rounded-none h-8 w-8 p-0"
                              onClick={() => handleReject(alumni.id)}
                              data-testid={`reject-btn-${index}`}
                            >
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
                <h2 className="font-heading text-2xl font-semibold text-[#0D1B2A]">
                  All Alumni
                </h2>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#778DA9]" />
                  <Input
                    placeholder="Search alumni..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-none h-10"
                    data-testid="search-alumni"
                  />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#778DA9] text-xs tracking-wider">EHSAS ID</TableHead>
                    <TableHead className="text-[#778DA9] text-xs tracking-wider">Name</TableHead>
                    <TableHead className="text-[#778DA9] text-xs tracking-wider">Email</TableHead>
                    <TableHead className="text-[#778DA9] text-xs tracking-wider">Batch</TableHead>
                    <TableHead className="text-[#778DA9] text-xs tracking-wider">City</TableHead>
                    <TableHead className="text-[#778DA9] text-xs tracking-wider">Status</TableHead>
                    <TableHead className="text-[#778DA9] text-xs tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAllAlumni.map((alumni, index) => (
                    <TableRow key={alumni.id} data-testid={`alumni-row-${index}`}>
                      <TableCell className="font-mono text-[#0D1B2A] font-medium">
                        {alumni.ehsas_id || "—"}
                      </TableCell>
                      <TableCell className="text-[#0D1B2A]">
                        {alumni.first_name} {alumni.last_name}
                      </TableCell>
                      <TableCell className="text-[#415A77]">{alumni.email}</TableCell>
                      <TableCell className="text-[#415A77]">{alumni.year_of_leaving}</TableCell>
                      <TableCell className="text-[#415A77]">{alumni.city}</TableCell>
                      <TableCell>{getStatusBadge(alumni.status)}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-none h-8 w-8 p-0"
                          onClick={() => viewAlumniDetail(alumni)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Events */}
          {activeTab === "events" && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-heading text-2xl font-semibold text-[#0D1B2A]">
                  Events Management
                </h2>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#778DA9] text-xs tracking-wider">Title</TableHead>
                    <TableHead className="text-[#778DA9] text-xs tracking-wider">Type</TableHead>
                    <TableHead className="text-[#778DA9] text-xs tracking-wider">Date</TableHead>
                    <TableHead className="text-[#778DA9] text-xs tracking-wider">Location</TableHead>
                    <TableHead className="text-[#778DA9] text-xs tracking-wider">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event, index) => (
                    <TableRow key={event.id} data-testid={`event-row-${index}`}>
                      <TableCell className="font-medium text-[#0D1B2A]">{event.title}</TableCell>
                      <TableCell className="capitalize text-[#415A77]">{event.event_type}</TableCell>
                      <TableCell className="text-[#415A77]">{event.date}</TableCell>
                      <TableCell className="text-[#415A77]">{event.location}</TableCell>
                      <TableCell>
                        <Badge className={`rounded-none text-xs ${event.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                          {event.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="p-8">
              <h2 className="font-heading text-2xl font-semibold text-[#0D1B2A] mb-8">
                Notifications
              </h2>
              {notifications.length === 0 ? (
                <div className="text-center py-16">
                  <Bell className="w-12 h-12 text-[#0D1B2A]/20 mx-auto mb-4" />
                  <p className="text-[#778DA9]">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notif, index) => (
                    <div
                      key={notif.id}
                      className={`p-5 border rounded-none ${
                        notif.is_read ? "bg-white" : "bg-[#FAFAF8] border-[#0D1B2A]/20"
                      }`}
                      data-testid={`notification-${index}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-[#0D1B2A]">{notif.title}</h4>
                          <p className="text-[#415A77] text-sm mt-1">{notif.message}</p>
                        </div>
                        {!notif.is_read && (
                          <Badge className="bg-[#0D1B2A] text-white rounded-none text-xs">New</Badge>
                        )}
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
            <DialogTitle className="font-heading text-2xl text-[#0D1B2A]">
              Alumni Details
            </DialogTitle>
            <DialogDescription className="text-[#778DA9]">
              Review the registration details below
            </DialogDescription>
          </DialogHeader>
          {selectedAlumni && (
            <div className="grid grid-cols-2 gap-4 py-6">
              <div>
                <p className="text-xs text-[#778DA9] tracking-wider uppercase">Full Name</p>
                <p className="font-medium text-[#0D1B2A] mt-1">
                  {selectedAlumni.first_name} {selectedAlumni.last_name}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#778DA9] tracking-wider uppercase">Email</p>
                <p className="font-medium text-[#0D1B2A] mt-1">{selectedAlumni.email}</p>
              </div>
              <div>
                <p className="text-xs text-[#778DA9] tracking-wider uppercase">Mobile</p>
                <p className="font-medium text-[#0D1B2A] mt-1">{selectedAlumni.mobile}</p>
              </div>
              <div>
                <p className="text-xs text-[#778DA9] tracking-wider uppercase">Batch</p>
                <p className="font-medium text-[#0D1B2A] mt-1">
                  {selectedAlumni.year_of_joining} - {selectedAlumni.year_of_leaving}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#778DA9] tracking-wider uppercase">Class</p>
                <p className="font-medium text-[#0D1B2A] mt-1">
                  {selectedAlumni.class_of_joining} to {selectedAlumni.last_class_studied}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#778DA9] tracking-wider uppercase">House</p>
                <p className="font-medium text-[#0D1B2A] mt-1">{selectedAlumni.last_house}</p>
              </div>
              <div>
                <p className="text-xs text-[#778DA9] tracking-wider uppercase">Profession</p>
                <p className="font-medium text-[#0D1B2A] mt-1">
                  {selectedAlumni.profession || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#778DA9] tracking-wider uppercase">Organization</p>
                <p className="font-medium text-[#0D1B2A] mt-1">
                  {selectedAlumni.organization || "Not specified"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-[#778DA9] tracking-wider uppercase">Address</p>
                <p className="font-medium text-[#0D1B2A] mt-1">
                  {selectedAlumni.full_address}, {selectedAlumni.city}, {selectedAlumni.state} - {selectedAlumni.pincode}, {selectedAlumni.country}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#778DA9] tracking-wider uppercase">Status</p>
                <div className="mt-1">{getStatusBadge(selectedAlumni.status)}</div>
              </div>
              {selectedAlumni.ehsas_id && (
                <div>
                  <p className="text-xs text-[#778DA9] tracking-wider uppercase">EHSAS ID</p>
                  <p className="font-mono font-bold text-[#0D1B2A] mt-1">{selectedAlumni.ehsas_id}</p>
                </div>
              )}
            </div>
          )}
          {selectedAlumni?.status === "pending" && (
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                className="rounded-none"
                onClick={() => handleReject(selectedAlumni.id)}
                data-testid="modal-reject-btn"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 rounded-none"
                onClick={() => handleApprove(selectedAlumni.id)}
                data-testid="modal-approve-btn"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
