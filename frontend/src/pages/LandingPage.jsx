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
        return <Heart className="w-3.5 h-3.5" />;
      case "founder":
        return <Briefcase className="w-3.5 h-3.5" />;
      case "civil_servant":
        return <Award className="w-3.5 h-3.5" />;
      case "creator":
        return <BookOpen className="w-3.5 h-3.5" />;
      case "corporate":
        return <GraduationCap className="w-3.5 h-3.5" />;
      default:
        return <Users className="w-3.5 h-3.5" />;
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
    <div className="min-h-screen bg-[#FAFAF8]" data-testid="landing-page">
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
          <p className="text-[#E0E1DD] text-sm tracking-[0.3em] uppercase mb-6 animate-fade-in-up">
            The Elden Heights School
          </p>
          <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-fade-in-up animate-delay-100">
            EHSAS
          </h1>
          <p className="font-accent italic text-[#E0E1DD] text-xl md:text-2xl mb-8 animate-fade-in-up animate-delay-200">
            Elden Heights School Alumni Society
          </p>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-12 animate-fade-in-up animate-delay-300 leading-relaxed">
            A lifelong community of Eldenites across the world.
            <br />
            <span className="text-white font-medium">Connect. Contribute. Celebrate the journey.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-400">
            <Link to="/register" data-testid="hero-join-btn">
              <Button className="bg-white text-[#0D1B2A] hover:bg-[#E0E1DD] rounded-none text-sm tracking-wider px-10 py-6 font-medium shadow-2xl">
                Join EHSAS
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/directory" data-testid="hero-explore-btn">
              <Button className="bg-transparent border border-white/40 text-white hover:bg-white/10 hover:border-white rounded-none text-sm tracking-wider px-10 py-6 font-medium">
                Explore Network
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-28 bg-white" data-testid="about-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-[#778DA9] font-medium tracking-[0.2em] uppercase text-xs">
                Our Legacy
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#0D1B2A] mt-4 mb-6">
                What is EHSAS?
              </h2>
              <div className="section-divider"></div>
              <p className="text-[#415A77] text-lg leading-relaxed mb-6">
                <strong className="text-[#0D1B2A]">EHSAS</strong> stands for{" "}
                <em className="text-[#6B0F1A]">Elden Heights School Alumni Society</em>.
              </p>
              <p className="text-[#415A77] text-lg leading-relaxed mb-6">
                But EHSAS also means <span className="font-accent italic text-2xl text-[#0D1B2A]">"feeling"</span> in Hindi — 
                a word that captures the essence of what we're building here.
              </p>
              <p className="text-[#415A77] text-lg leading-relaxed">
                This platform is built on belonging, memories, and lifelong connection. 
                It's where Eldenites from every generation come together to celebrate their shared journey, 
                support current students, and strengthen the legacy of The Elden Heights School.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-full h-full border border-[#0D1B2A]/10"></div>
              <img
                src="https://images.pexels.com/photos/8730123/pexels-photo-8730123.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Alumni community"
                className="relative z-10 w-full h-[520px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Spotlight Section */}
      <section id="spotlight" className="py-28 bg-[#FAFAF8] paper-texture" data-testid="spotlight-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="text-[#778DA9] font-medium tracking-[0.2em] uppercase text-xs">
              Distinguished Alumni
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#0D1B2A] mt-4 mb-4">
              Eldenites Making Us Proud
            </h2>
            <div className="section-divider mx-auto"></div>
            <p className="text-[#415A77] text-lg max-w-2xl mx-auto mt-6">
              Our alumni are making waves across industries — founders, doctors, civil servants, 
              creators, and corporate leaders shaping the future.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {spotlight.map((person, index) => (
              <Card
                key={person.id}
                className="spotlight-card border-0 rounded-none overflow-hidden"
                data-testid={`spotlight-card-${index}`}
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={person.image_url || "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=400"}
                    alt={person.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="badge-navy rounded-none flex items-center gap-1.5">
                      {getCategoryIcon(person.category)}
                      {getCategoryLabel(person.category)}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-[#778DA9] font-medium text-xs tracking-wider mb-2">BATCH OF {person.batch}</p>
                  <h3 className="font-heading text-xl font-semibold text-[#0D1B2A] mb-2">
                    {person.name}
                  </h3>
                  <p className="text-[#415A77] text-sm mb-3">{person.profession}</p>
                  <p className="text-[#0D1B2A] text-sm font-medium">{person.achievement}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-28 bg-white" data-testid="events-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[#778DA9] font-medium tracking-[0.2em] uppercase text-xs">
              Stay Connected
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#0D1B2A] mt-4 mb-4">
              Events & Reunions
            </h2>
            <div className="section-divider mx-auto"></div>
            <p className="text-[#415A77] text-lg max-w-2xl mx-auto mt-6">
              From campus reunions to virtual webinars, there's always an opportunity 
              to reconnect with your fellow Eldenites.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.slice(0, 3).map((event, index) => (
              <Card
                key={event.id}
                className="event-card border-0 rounded-none overflow-hidden"
                data-testid={`event-card-${index}`}
              >
                <div className="event-card-image h-52">
                  <img
                    src={event.image_url || "https://images.pexels.com/photos/6759183/pexels-photo-6759183.jpeg?w=600"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <Badge className="badge-slate rounded-none mb-4 capitalize">
                    {event.event_type}
                  </Badge>
                  <h3 className="font-heading text-xl font-semibold text-[#0D1B2A] mb-3">
                    {event.title}
                  </h3>
                  <p className="text-[#415A77] text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-[#778DA9]">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 text-sm text-[#778DA9]">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Give Back Section */}
      <section id="giveback" className="py-28 bg-[#0D1B2A]" data-testid="giveback-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[#778DA9] font-medium tracking-[0.2em] uppercase text-xs">
              Make a Difference
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mt-4 mb-4">
              Give Back to Your Roots
            </h2>
            <div className="section-divider mx-auto bg-[#E0E1DD]"></div>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mt-6">
              Your success story began at Elden Heights. Now, help write the next chapter 
              for current students and the school community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Users className="w-7 h-7" />,
                title: "Mentorship",
                description: "Guide students through career choices and life decisions.",
              },
              {
                icon: <Briefcase className="w-7 h-7" />,
                title: "Internships",
                description: "Offer internship opportunities at your organization.",
              },
              {
                icon: <GraduationCap className="w-7 h-7" />,
                title: "Scholarships",
                description: "Support deserving students' education journey.",
              },
              {
                icon: <Heart className="w-7 h-7" />,
                title: "Donations",
                description: "Contribute to school infrastructure and growth.",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="bg-white/5 border border-white/10 rounded-none p-8 hover:bg-white/8 transition-all duration-500 group"
                data-testid={`giveback-card-${index}`}
              >
                <div className="w-14 h-14 border border-[#E0E1DD]/30 flex items-center justify-center text-[#E0E1DD] mb-6 group-hover:border-white group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="font-heading text-xl font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link to="/register">
              <Button className="bg-white text-[#0D1B2A] hover:bg-[#E0E1DD] rounded-none text-sm tracking-wider px-10 py-6 font-medium">
                Get Involved Today
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 bg-[#FAFAF8] paper-texture" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#0D1B2A] mb-6">
            Ready to Reconnect?
          </h2>
          <p className="text-[#415A77] text-lg mb-12 max-w-xl mx-auto">
            Join thousands of Eldenites who are already part of this growing community. 
            Register today and receive your official EHSAS membership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" data-testid="cta-register-btn">
              <Button className="bg-[#0D1B2A] text-white hover:bg-[#1B263B] rounded-none text-sm tracking-wider px-10 py-6 font-medium shadow-xl">
                Register Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/directory" data-testid="cta-directory-btn">
              <Button className="bg-transparent border border-[#0D1B2A] text-[#0D1B2A] hover:bg-[#0D1B2A] hover:text-white rounded-none text-sm tracking-wider px-10 py-6 font-medium">
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
