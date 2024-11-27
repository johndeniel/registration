import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ArrowRight, Phone, Mail, MapPin, Calendar, Heart, Bus, Book, Tag, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-primary to-primary-foreground text-white py-24 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight">Senior Citizens Affairs Registration</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 leading-relaxed">
              Our comprehensive support network is dedicated to enhancing the quality of life for seniors through personalized services, community engagement, and holistic wellness programs.
            </p>
            <Link href="/registration" passHref>
              <Button size="lg" className="text-lg px-8 py-6 bg-white text-primary hover:bg-gray-100 transition-colors duration-300 shadow-md">
                Registration
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-semibold mb-12 text-center text-gray-800 tracking-tight">Comprehensive Senior Support Services</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { 
                  title: 'Tailored Community Programs', 
                  description: 'Curated events and activities designed to foster social connection, personal growth, and enjoyment.', 
                  icon: Calendar 
                },
                { 
                  title: 'Integrated Health Management', 
                  description: 'Proactive health services including wellness checkups, preventive care, and personalized health guidance.', 
                  icon: Heart 
                },
                { 
                  title: 'Social Support Network', 
                  description: 'Build meaningful connections through peer support groups, community initiatives, and collaborative activities.', 
                  icon: Users 
                },
                { 
                  title: 'Exclusive Community Benefits', 
                  description: 'Access special discounts, rates, and privileges with local businesses and service providers.', 
                  icon: Tag 
                },
                { 
                  title: 'Mobility and Transportation', 
                  description: 'Reliable, comfortable, and accessible transportation services tailored to senior mobility needs.', 
                  icon: Bus 
                },
                { 
                  title: 'Continuous Learning', 
                  description: 'Engaging workshops, educational programs, and skill development opportunities to promote lifelong growth.', 
                  icon: Book 
                },
              ].map((benefit, index) => (
                <Card key={index} className="transition-all duration-300 hover:shadow-lg hover:border-primary/20">
                  <CardHeader>
                    <benefit.icon className="h-8 w-8 mb-2 text-primary" />
                    <CardTitle className="text-xl font-semibold">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="leading-relaxed">{benefit.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-semibold mb-8 text-gray-800 tracking-tight">Your Journey Starts Here</h3>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600 leading-relaxed">
              Transform your senior years into a period of growth, connection, and fulfillment. Join our supportive community and unlock a world of opportunities tailored just for you.
            </p>
            <Link href="/registration" passHref>
              <Button size="lg" className="text-lg px-8 py-6 shadow-md">
                Join Our Community
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-br from-primary/90 to-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div>
              <h4 className="text-2xl font-bold mb-6 tracking-tight">Contact Us</h4>
              <div className="space-y-4">
                <p className="flex items-center">
                  <Phone className="mr-4 h-6 w-6 text-white/80" />
                  <span className="text-lg">(800) SENIORS-CARE</span>
                </p>
                <p className="flex items-center">
                  <Mail className="mr-4 h-6 w-6 text-white/80" />
                  <span className="text-lg">support@seniornetwork.org</span>
                </p>
                <p className="flex items-center">
                  <MapPin className="mr-4 h-6 w-6 text-white/80" />
                  <span className="text-lg">Community Plaza, Nationwide</span>
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-white/20 text-center">
            <p className="text-white/80">
              &copy; 2024 Senior Citizens Support Network. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}