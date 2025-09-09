import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Send,
  Building,
  Users,
  HeadphonesIcon
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    category: ""
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Message Sent Successfully!",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      category: ""
    });
    setLoading(false);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone Support",
      details: ["+91 98765 43210", "+91 87654 32109"],
      description: "Mon-Fri: 9:00 AM - 8:00 PM"
    },
    {
      icon: Mail,
      title: "Email Support",
      details: ["support@resaleflats.in", "hello@resaleflats.in"],
      description: "We respond within 2 hours"
    },
    {
      icon: MapPin,
      title: "Office Address",
      details: ["ResaleFlats.in Headquarters", "Sector 18, Gurgaon, Haryana"],
      description: "Visit us for property consultation"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Monday - Friday: 9:00 AM - 8:00 PM", "Saturday: 10:00 AM - 6:00 PM"],
      description: "Sunday: Emergency support only"
    }
  ];

  const faqCategories = [
    {
      icon: Building,
      title: "Property Listing",
      description: "Questions about listing your property"
    },
    {
      icon: Users,
      title: "Buying Support", 
      description: "Help with finding and buying properties"
    },
    {
      icon: HeadphonesIcon,
      title: "Technical Support",
      description: "Website and app related issues"
    },
    {
      icon: MessageSquare,
      title: "General Inquiry",
      description: "Other questions and feedback"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-6">
            Get in Touch
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            We're Here to Help
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about properties, need assistance, or want to share feedback? 
            Our expert team is ready to assist you.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="property-listing">Property Listing</SelectItem>
                          <SelectItem value="buying-support">Buying Support</SelectItem>
                          <SelectItem value="technical-support">Technical Support</SelectItem>
                          <SelectItem value="general-inquiry">General Inquiry</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="Brief description of your inquiry"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Please provide detailed information about your inquiry..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
                    <Send className="h-4 w-4" />
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Cards */}
            {contactInfo.map((info, index) => (
              <Card key={index} className="shadow-md border-0">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                      <info.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground mb-1">{detail}</p>
                      ))}
                      <p className="text-xs text-muted-foreground mt-2 font-medium">{info.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Quick Help */}
            <Card className="shadow-md border-0 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Need Quick Help?</h3>
                <div className="space-y-3">
                  {faqCategories.map((category, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors cursor-pointer">
                      <category.icon className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{category.title}</p>
                        <p className="text-xs text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Visit Help Center
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="shadow-md border-0 border-l-4 border-l-destructive">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-destructive" />
                  Emergency Support
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  For urgent property-related issues outside business hours
                </p>
                <p className="text-lg font-bold text-destructive">+91 98765 00000</p>
                <p className="text-xs text-muted-foreground">Available 24/7 for emergencies</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;