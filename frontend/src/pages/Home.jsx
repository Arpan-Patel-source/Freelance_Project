import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Briefcase, Users, IndianRupee, Shield, Search, MessageSquare, Sparkles, Zap, TrendingUp, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';
import ScrollReveal from '../components/ScrollReveal';

export default function Home() {
  const features = [
    {
      icon: <Search className="h-10 w-10 text-primary" />,
      title: 'Find Perfect Jobs',
      description: 'Browse thousands of freelance opportunities across various categories',
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: 'Hire Top Talent',
      description: 'Connect with skilled freelancers from around the world',
    },

    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: 'Real-time Chat',
      description: 'Communicate instantly with clients and freelancers',
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: 'Verified Profiles',
      description: 'Work with confidence using our verification system',
    },
    {
      icon: <Briefcase className="h-10 w-10 text-primary" />,
      title: 'Project Management',
      description: 'Track milestones, deliverables, and project progress',
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-purple-700 to-pink-700 py-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-sm text-white font-medium">The Future of Freelancing is Here</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 text-white animate-fade-in-up">
              Connect, Collaborate,
              <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent"> Create Magic</span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Join the premier platform where top talent meets ambitious projects.
              Build your dream career or find the perfect freelancer.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/register">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100 text-lg px-8 py-6 rounded-xl shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 group">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/jobs">
                <Button size="lg" variant="outline" className="border-2 border-white bg-white/10 text-white hover:bg-white hover:text-purple-700 backdrop-blur-sm text-lg px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105 font-semibold">
                  Explore Opportunities
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-1">
                  <AnimatedCounter end={10} suffix="K+" className="text-white" />
                </div>
                <div className="text-blue-200 text-sm">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-1">
                  <AnimatedCounter end={50} suffix="K+" className="text-white" />
                </div>
                <div className="text-blue-200 text-sm">Freelancers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-1">
                  <AnimatedCounter end={10} prefix="" suffix="M+" className="text-white" />
                </div>
                <div className="text-blue-200 text-sm">Paid Out</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-4 py-2 mb-4">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-semibold">POWERFUL FEATURES</span>
            </div>
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-800 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Why Choose Worksera?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to succeed in the modern freelance economy
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <Card
                  className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-purple-200 bg-white/50 backdrop-blur-sm h-full hover-lift glow-hover"
                >
                  <CardHeader>
                    <div className="mb-4 p-3 bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300 group-hover:from-purple-600 group-hover:to-pink-500">
                      <div className="text-purple-700 group-hover:text-white transition-colors">{feature.icon}</div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-purple-700 transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-purple-900 via-purple-700 to-pink-600 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <Sparkles className="h-16 w-16 mx-auto mb-6 text-yellow-300 animate-pulse" />
            <h2 className="text-5xl font-bold mb-6 animate-fade-in-up">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl mb-10 opacity-90 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Join thousands of freelancers and clients already using Worksera to build their dreams.
              Start your journey today—completely free!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/register">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100 text-lg px-10 py-6 rounded-xl shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:scale-105 group">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/jobs">
                <Button size="lg" variant="outline" className="border-2 border-white bg-white/10 text-white hover:bg-white hover:text-purple-700 backdrop-blur-sm text-lg px-10 py-6 rounded-xl transition-all duration-300 hover:scale-105 font-semibold">
                  Browse Opportunities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
