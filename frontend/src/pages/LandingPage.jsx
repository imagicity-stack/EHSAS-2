import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Users,
  Calendar,
  Award,
  Heart,
  BookOpen,
  Briefcase,
  GraduationCap,
  ArrowRight,
  MapPin,
  Clock,
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const LandingPage = () => {
  const [spotlight, setSpotlight] = useState([]);
  const [events, setEvents] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchSpotlight();
    fetchEvents();
  }, []);

  const fetchSpotlight = async () => {
    try {
      const res = await axios.get(`${API}/spotlight`);
      setSpotlight(res.data);
    } catch (err) {
      console.error("Error fetching spotlight:", err);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API}/events`);
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "doctor":
        return <Heart className="w-4 h-4" />;
      case "founder":
        return <Briefcase className="w-4 h-4" />;
      case "civil_servant":
        return <Award className="w-4 h-4" />;
      case "creator":
        return <BookOpen className="w-4 h-4" />;
      case "corporate":
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      doctor: "Healthcare",
      founder: "Entrepreneur",
      civil_servant: "Civil Service",
      creator: "Creator",
      corporate: "Corporate",
    };
    return labels[category] || "Alumni";
  };

  return (
    <div className="min-h-screen bg-[#F9F7F1]" data-testid="landing-page">
      <Navbar transparent={!scrolled} />

      {/* Hero Section */}
      <section
        className="hero-section relative bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/29704448/pexels-photo-29704448.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
        }}
        data-testid="hero-section"
      >
        <div className="hero-overlay"></div>
        <div className="hero-content max-w-4xl mx-auto">
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 animate-fade-in-up">
            EHSAS
          </h1>
          <p className="font-accent italic text-[#C9A227] text-xl md:text-2xl mb-6 animate-fade-in-up animate-delay-100">
            Elden Heights School Alumni Society
          </p>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-in-up animate-delay-200">
            A lifelong community of Eldenites across the world.
            <br />
            <span className="text-[#C9A227]">Connect. Contribute. Celebrate the journey.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-300">
            <Link to="/register" data-testid="hero-join-btn">
              <Button className="bg-[#C9A227] hover:bg-[#E3C565] text-[#1A2A4A] font-semibold rounded-sm text-base px-8 py-6 shadow-lg">
                Join EHSAS
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/directory" data-testid="hero-explore-btn">
              <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#1A2A4A] rounded-sm text-base px-8 py-6">
                Explore Alumni Network
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white" data-testid="about-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#C9A227] font-medium tracking-widest uppercase text-sm">
                Our Story
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#1A2A4A] mt-4 mb-6">
                What is EHSAS?
              </h2>
              <div className="section-divider"></div>
              <p className="text-[#475569] text-lg leading-relaxed mb-6">
                <strong className="text-[#1A2A4A]">EHSAS</strong> stands for{" "}
                <em className="text-[#8B0000]">Elden Heights School Alumni Society</em>.
              </p>
              <p className="text-[#475569] text-lg leading-relaxed mb-6">
                But EHSAS also means <span className="font-accent italic text-xl text-[#C9A227]">"feeling"</span> in Hindi — 
                a word that captures the essence of what we're building here.
              </p>
              <p className="text-[#475569] text-lg leading-relaxed">
                This platform is built on belonging, memories, and lifelong connection. 
                It's where Eldenites from every generation come together to celebrate their shared journey, 
                support current students, and strengthen the legacy of The Elden Heights School.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#C9A227] rounded-sm"></div>
              <img
                src="https://images.pexels.com/photos/8730123/pexels-photo-8730123.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Alumni community"
                className="relative z-10 w-full h-[500px] object-cover rounded-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Spotlight Section */}
      <section id="spotlight" className="py-24 bg-[#F9F7F1] paper-texture" data-testid="spotlight-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#C9A227] font-medium tracking-widest uppercase text-sm">
              Pride of EHSAS
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#1A2A4A] mt-4 mb-4">
              Eldenites Making Us Proud
            </h2>
            <div className="section-divider mx-auto"></div>
            <p className="text-[#475569] text-lg max-w-2xl mx-auto mt-4">
              Our alumni are making waves across industries — founders, doctors, civil servants, 
              creators, and corporate leaders shaping the future.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {spotlight.map((person, index) => (
              <Card
                key={person.id}
                className="spotlight-card border-0 rounded-sm overflow-hidden"
                data-testid={`spotlight-card-${index}`}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={person.image_url || "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=400"}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="badge-gold rounded-sm flex items-center gap-1">
                      {getCategoryIcon(person.category)}
                      {getCategoryLabel(person.category)}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-[#C9A227] font-medium text-sm mb-1">Batch of {person.batch}</p>
                  <h3 className="font-heading text-xl font-semibold text-[#1A2A4A] mb-2">
                    {person.name}
                  </h3>
                  <p className="text-[#475569] text-sm mb-3">{person.profession}</p>
                  <p className="text-[#1A2A4A] text-sm font-medium">{person.achievement}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-24 bg-white" data-testid="events-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#C9A227] font-medium tracking-widest uppercase text-sm">
              Stay Connected
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#1A2A4A] mt-4 mb-4">
              Events & Reunions
            </h2>
            <div className="section-divider mx-auto"></div>
            <p className="text-[#475569] text-lg max-w-2xl mx-auto mt-4">
              From campus reunions to virtual webinars, there's always an opportunity 
              to reconnect with your fellow Eldenites.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.slice(0, 3).map((event, index) => (
              <Card
                key={event.id}
                className="event-card border-0 rounded-sm overflow-hidden"
                data-testid={`event-card-${index}`}
              >
                <div className="event-card-image h-48">
                  <img
                    src={event.image_url || "https://images.pexels.com/photos/6759183/pexels-photo-6759183.jpeg?w=600"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <Badge className="badge-navy rounded-sm mb-3 capitalize">
                    {event.event_type}
                  </Badge>
                  <h3 className="font-heading text-xl font-semibold text-[#1A2A4A] mb-3">
                    {event.title}
                  </h3>
                  <p className="text-[#475569] text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-[#475569]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-[#C9A227]" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-[#C9A227]" />
                      {event.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-sm text-[#475569]">
                    <MapPin className="w-4 h-4 text-[#C9A227]" />
                    {event.location}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Give Back Section */}
      <section id="giveback" className="py-24 bg-[#1A2A4A]" data-testid="giveback-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#C9A227] font-medium tracking-widest uppercase text-sm">
              Make a Difference
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mt-4 mb-4">
              Give Back to Your Roots
            </h2>
            <div className="section-divider mx-auto bg-[#C9A227]"></div>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mt-4">
              Your success story began at Elden Heights. Now, help write the next chapter 
              for current students and the school community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                title: "Mentorship Program",
                description: "Guide students through career choices and life decisions.",
              },
              {
                icon: <Briefcase className="w-8 h-8" />,
                title: "Internships",
                description: "Offer internship opportunities at your organization.",
              },
              {
                icon: <GraduationCap className="w-8 h-8" />,
                title: "Scholarships",
                description: "Support deserving students' education journey.",
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Donations",
                description: "Contribute to school infrastructure and growth.",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="bg-white/5 border border-white/10 rounded-sm p-6 hover:bg-white/10 transition-colors group"
                data-testid={`giveback-card-${index}`}
              >
                <div className="w-16 h-16 bg-[#C9A227]/20 rounded-sm flex items-center justify-center text-[#C9A227] mb-4 group-hover:bg-[#C9A227] group-hover:text-[#1A2A4A] transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-heading text-xl font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-white/60 text-sm">{item.description}</p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/register">
              <Button className="btn-gold rounded-sm text-base px-8 py-6">
                Get Involved Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#F9F7F1] paper-texture" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#1A2A4A] mb-6">
            Ready to Reconnect?
          </h2>
          <p className="text-[#475569] text-lg mb-10">
            Join thousands of Eldenites who are already part of this growing community. 
            Register today and receive your official EHSAS membership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" data-testid="cta-register-btn">
              <Button className="btn-primary rounded-sm text-base px-8 py-6">
                Register Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/directory" data-testid="cta-directory-btn">
              <Button className="btn-secondary rounded-sm text-base px-8 py-6">
                Browse Directory
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
