import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Home, 
  Award, 
  Target, 
  Heart, 
  Shield, 
  TrendingUp,
  Star,
  MapPin,
  Building2
} from "lucide-react";

const About = () => {
  const stats = [
    { icon: Home, label: "Properties Listed", value: "25,000+", color: "text-blue-500" },
    { icon: Users, label: "Happy Customers", value: "15,000+", color: "text-green-500" },
    { icon: MapPin, label: "Cities Covered", value: "50+", color: "text-purple-500" },
    { icon: Star, label: "Average Rating", value: "4.8/5", color: "text-yellow-500" }
  ];

  const team = [
    {
      name: "John Doe",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      description: "10+ years in real estate"
    },
    {
      name: "Jane Smith",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      description: "Expert in property management"
    },
    {
      name: "Mike Johnson",
      role: "Lead Developer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      description: "Full-stack development expert"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "We prioritize our customers' needs and satisfaction above everything else."
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Your data and transactions are protected with the highest security standards."
    },
    {
      icon: Target,
      title: "Quality Assurance",
      description: "Every property is verified and quality-checked before listing."
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "We continuously innovate to provide the best user experience."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">About ResaleFlats</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Revolutionizing Property Search
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            ResaleFlats is India's leading property marketplace, connecting buyers and sellers 
            with verified, quality properties. We make finding your dream home simple, secure, and seamless.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To democratize property search by providing a transparent, user-friendly platform 
                that connects genuine buyers with verified sellers, making the home-buying process 
                accessible to everyone.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To become the most trusted and preferred property marketplace in India, 
                setting industry standards for transparency, security, and customer satisfaction.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do and shape our company culture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <value.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals behind ResaleFlats who work tirelessly to make your property search easier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-foreground mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Our Story
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              Founded in 2024, ResaleFlats was born from a simple observation: the property search 
              process in India was fragmented, opaque, and often frustrating for both buyers and sellers.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our founders, having experienced these challenges firsthand, decided to create a platform 
              that would bring transparency, efficiency, and trust to the property market. What started 
              as a small team in Mumbai has now grown into a nationwide platform serving thousands of users.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, we're proud to have helped over 15,000 families find their dream homes and continue 
              to innovate with new features and technologies to make property search even better.
            </p>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Ready to Find Your Dream Home?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of satisfied customers who have found their perfect property through ResaleFlats.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  Browse Properties
                </Button>
                <Button variant="outline" size="lg">
                  List Your Property
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;