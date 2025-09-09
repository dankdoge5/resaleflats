import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Users, 
  TrendingUp, 
  Heart, 
  CheckCircle, 
  Star,
  Award,
  Target,
  Globe,
  Home
} from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Home, label: "Properties Listed", value: "25,000+" },
    { icon: Users, label: "Happy Customers", value: "15,000+" },
    { icon: Globe, label: "Cities Covered", value: "50+" },
    { icon: Star, label: "Average Rating", value: "4.8/5" }
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "We verify every property listing and ensure complete transparency in all transactions."
    },
    {
      icon: TrendingUp,
      title: "Best Market Prices",
      description: "Direct deals with property owners mean no broker commissions and better prices for you."
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Our dedicated support team is committed to making your property journey smooth and hassle-free."
    },
    {
      icon: Heart,
      title: "Passion for Homes",
      description: "We believe everyone deserves their perfect home, and we're here to make that dream a reality."
    }
  ];

  const team = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      description: "15+ years in real estate technology with a vision to democratize property buying in India."
    },
    {
      name: "Priya Sharma",
      role: "Head of Operations",
      description: "Expert in property verification and quality assurance with 12+ years of experience."
    },
    {
      name: "Amit Singh",
      role: "Technology Lead",
      description: "Building scalable platforms that connect millions of property seekers with their dream homes."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-6">
            About ResaleFlats.in
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Revolutionizing Resale Property Market in India
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make property buying and selling transparent, efficient, and 
            accessible to everyone. No more broker hassles, hidden charges, or fake listings.
          </p>
        </section>

        {/* Stats Section */}
        <section className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center shadow-md border-0">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Our Story */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2020, ResaleFlats.in emerged from a simple observation: buying and selling 
                  properties in India was unnecessarily complicated, expensive, and often unreliable.
                </p>
                <p>
                  Our founders experienced firsthand the frustration of dealing with multiple brokers, 
                  inflated prices, and questionable property listings. They envisioned a platform 
                  where property owners could directly connect with genuine buyers.
                </p>
                <p>
                  Today, we've successfully facilitated thousands of property transactions, saved 
                  crores in brokerage fees, and built India's most trusted resale property platform.
                </p>
              </div>
              <div className="flex gap-4 mt-6">
                <Button onClick={() => navigate('/properties')}>
                  Browse Properties
                </Button>
                <Button variant="outline" onClick={() => navigate('/signup')}>
                  Join Us Today
                </Button>
              </div>
            </div>
            <div className="lg:order-first">
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-12 text-center">
                  <div className="bg-primary/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Home className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">25,000+ Properties</h3>
                  <p className="text-muted-foreground">Verified and ready to view</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">What We Stand For</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our core values guide everything we do and every decision we make
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="shadow-md border-0">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Leadership Team */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground">
              Passionate professionals dedicated to transforming real estate
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center shadow-md border-0">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-primary to-primary-glow w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-20">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-0">
            <CardContent className="p-12 text-center">
              <div className="flex justify-center mb-6">
                <Award className="h-16 w-16 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Recognized Excellence
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div>
                  <h3 className="text-lg font-semibold mb-2">PropTech Innovation Award</h3>
                  <p className="text-muted-foreground text-sm">Best Real Estate Platform 2023</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Customer Choice Award</h3>
                  <p className="text-muted-foreground text-sm">Highest Customer Satisfaction 2023</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Startup Excellence</h3>
                  <p className="text-muted-foreground text-sm">Fast Growing Startup 2022</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section>
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Find Your Dream Home?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who found their perfect property with us. 
                Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate('/properties')}>
                  Browse Properties
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/signup')}>
                  List Your Property
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default About;