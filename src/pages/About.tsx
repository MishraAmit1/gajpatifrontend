{/* Stats Section */ }
import { Helmet } from 'react-helmet-async';
import LazyLoad from 'react-lazyload';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Factory, Award, MessageCircleCode, Calendar, Package, Building2, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { handleWhatsAppRedirect } from '../helper/whatsapp';

const Container = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const LeaderImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4 overflow-hidden">
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      loading="lazy"
      onError={() => (
        <div className="w-full h-full bg-gradient-hero flex items-center justify-center text-white">
          {alt[0]}
        </div>
      )}
    />
  </div>
);

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Gajpati Industries | Leading Infrastructure Chemicals Manufacturer</title>
        <meta
          name="description"
          content="Learn about Gajpati Industries, India's trusted infrastructure chemicals manufacturer since 1998, with 5 plants and 5000+ projects completed."
        />
        <meta
          name="keywords"
          content="Gajpati Industries, about us, infrastructure chemicals, manufacturing, India"
        />
        <meta
          property="og:title"
          content="About Gajpati Industries | Infrastructure Chemicals Manufacturer"
        />
        <meta
          property="og:description"
          content="Learn about Gajpati Industries, India's trusted infrastructure chemicals manufacturer since 1998, with 5 plants and 5000+ projects completed."
        />
        <meta property="og:image" content="https://yourdomain.com/images/about-og.jpg" />
        <meta property="og:url" content="https://yourdomain.com/about" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="About Gajpati Industries | Infrastructure Chemicals Manufacturer"
        />
        <meta
          name="twitter:description"
          content="Learn about Gajpati Industries, India's trusted infrastructure chemicals manufacturer since 1998, with 5 plants and 5000+ projects completed."
        />
        <meta name="twitter:image" content="https://yourdomain.com/images/about-og.jpg" />
        <link rel="canonical" href="https://yourdomain.com/about" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Gajpati Industries",
            "url": "https://yourdomain.com",
            "logo": "https://yourdomain.com/images/logo.png",
            "description": "India's premier infrastructure chemicals manufacturer since 1998, trusted by 5000+ projects.",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-123-456-7890",
              "contactType": "Customer Service",
            },
            "sameAs": ["https://twitter.com/yourtwitter", "https://linkedin.com/company/yourlinkedin"],
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://yourdomain.com" },
              { "@type": "ListItem", "position": 2, "name": "About", "item": "https://yourdomain.com/about" },
            ],
          })}
        </script>
      </Helmet>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-egyptian-blue to-violet-blue text-white py-12 sm:py-16 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-hero mb-3 sm:mb-4">
                Building India's Infrastructure
              </h1>
              <h5 className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl sm:max-w-3xl mx-auto mb-2">
                ( A Sister Company of A&T Infracon – Trusted Since  1998 )
              </h5>
              <p className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl sm:max-w-3xl mx-auto">
                India's Trusted Partner in Infrastructure Material Solutions
                From National Highways to Slope Protections, from Urban Projects to Industrial Developments.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 sm:py-16 bg-white">
          <Container>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8 text-center font-bold">
              <div className="group">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-egyptian-blue/10 flex items-center justify-center mb-3 group-hover:bg-egyptian-blue/20 transition-colors duration-300">
                    <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-egyptian-blue" />
                  </div>
                  {/* <div className="text-3xl sm:text-4xl font-bold text-egyptian-blue">5+</div> */}
                  <div className="text-gray-600 mt-2 text-sm sm:text-base">5+ Years Experience</div>
                </div>
              </div>
              <div className="group">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-egyptian-blue/10 flex items-center justify-center mb-3 group-hover:bg-egyptian-blue/20 transition-colors duration-300">
                    <Factory className="h-8 w-8 sm:h-10 sm:w-10 text-egyptian-blue" />
                  </div>
                  {/* <div className="text-3xl sm:text-4xl font-bold text-egyptian-blue">1</div> */}
                  <div className="text-gray-600 mt-2 text-sm sm:text-base">1+ Manufacturing Plants</div>
                </div>
              </div>
              <div className="group">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-egyptian-blue/10 flex items-center justify-center mb-3 group-hover:bg-egyptian-blue/20 transition-colors duration-300">
                    <Package className="h-8 w-8 sm:h-10 sm:w-10 text-egyptian-blue" />
                  </div>
                  {/* <div className="text-3xl sm:text-4xl font-bold text-egyptian-blue">70+</div> */}
                  <div className="text-gray-600 mt-2 text-sm sm:text-base">70+ Products</div>
                </div>
              </div>
              <div className="group">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-egyptian-blue/10 flex items-center justify-center mb-3 group-hover:bg-egyptian-blue/20 transition-colors duration-300">
                    <Wrench className="h-8 w-8 sm:h-10 sm:w-10 text-egyptian-blue" />
                  </div>
                  {/* <div className="text-3xl sm:text-4xl font-bold text-egyptian-blue">50+</div> */}
                  <div className="text-gray-600 mt-2 text-sm sm:text-base">50+ Projects completed</div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Story Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-platinum/30">
          <Container>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-h1 text-egyptian-blue mb-4 sm:mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed">
                  <p>
                    Founded in 2020, Gajpati Industries began as a vision to simplify and modernize the infrastructure material supply chain in India. Backed by the legacy and leadership of A&T Infracon, our sister concern, we've rapidly evolved into a trusted brand known for quality, scalability, and innovation.
                  </p>
                  <p>
                    Our expertise spans across critical categories such as:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Bitumen & Emulsions</li>
                    <li>Gabion Wire Structures
                    </li>
                    <li>Construction Chemicals</li>
                    <li>Waterproofing & Sealants</li>
                    <li>Concrete Admixtures</li>
                    <li>Curing Compounds & Epoxy Systems</li>
                  </ul>
                  <p>
                    With strategically placed stock points, field engineers, and a responsive support network, Gajpati ensures that infrastructure developers, government agencies, and contractors get the right material, at the right time, anywhere in India.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="shadow-card">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <Factory className="h-10 w-10 sm:h-12 sm:w-12 text-egyptian-blue mx-auto mb-3 sm:mb-4" />
                    <h3 className="font-semibold text-base sm:text-lg mb-2">Manufacturing Excellence</h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      State-of-the-art facilities with automated quality control
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-card">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <Award className="h-10 w-10 sm:h-12 sm:w-12 text-amber mx-auto mb-3 sm:mb-4" />
                    <h3 className="font-semibold text-base sm:text-lg mb-2">Quality Certified</h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      ISO 9001:2015, IS, and ASTM certified products
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Container>
        </section>

        {/* Leadership Section */}
        <LazyLoad height={200} offset={100}>
          <section className="py-12 sm:py-16 lg:py-20 bg-white">
            <Container>
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-h1 text-egyptian-blue mb-3 sm:mb-4">
                  Leadership Team
                </h2>
                <p className="text-gray-600 text-sm sm:text-base max-w-xl sm:max-w-2xl mx-auto">
                  Guided by experienced leaders with a strong commitment to excellence and client success.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                {[
                  {
                    name: 'Mr. Ashok Kumar Doshi:',
                    role: 'Managing Director',
                    experience: 'A distinguished veteran with profound industry insight, Mr. Doshi leads with a focus on innovation and strategic business expansion.',
                    image: 'https://your-supabase-url/storage/v1/object/public/leaders/rajesh-gajpati.jpg?format=webp&quality=80',
                  },
                  {
                    name: 'Mr. Punit Doshi',
                    role: 'Managing Director',
                    experience: ' An expert in operational efficiency and sophisticated supply chain logistics, Mr. Punit Doshi is instrumental in ensuring seamless pan-India material delivery.',
                    image: 'https://your-supabase-url/storage/v1/object/public/leaders/priya-sharma.jpg?format=webp&quality=80',
                  },
                  {
                    name: 'Mr. Mohit A. Doshi',
                    role: 'Managing Director',
                    experience: `A highly accomplished professional who contributes to the company's strategic direction and commitment to client success`,
                    image: 'https://your-supabase-url/storage/v1/object/public/leaders/amit-kumar.jpg?format=webp&quality=80',
                  },
                ].map((leader, index) => (
                  <Card key={index} className="shadow-card text-center" role="region" aria-label={`Team member ${leader.name}`}>
                    <CardContent className="p-6 sm:p-8">
                      <LeaderImage src={leader.image} alt={`${leader.name}, ${leader.role}`} />
                      <h3 className="font-semibold text-lg sm:text-xl mb-2">{leader.name}</h3>
                      <p className="text-egyptian-blue font-medium text-sm sm:text-base mb-2">{leader.role}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{leader.experience}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Container>
          </section>
        </LazyLoad>

        {/* Values Section */}
        <LazyLoad height={200} offset={100}>
          <section className="py-12 sm:py-16 lg:py-20 bg-platinum/30">
            <Container>
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-h1 text-egyptian-blue mb-3 sm:mb-4">
                  Our Core Values
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  {
                    title: 'Quality First',
                    desc: 'An uncompromising commitment to product excellence and customer satisfaction.',
                  },
                  {
                    title: 'Innovation',
                    desc: 'Continuous research and development to stay ahead of industry trends',
                  },
                  {
                    title: 'Integrity',
                    desc: 'Transparent business practices and ethical operations in all dealings',
                  },
                  {
                    title: 'Sustainability',
                    desc: 'Environmental responsibility and sustainable manufacturing practices',
                  },
                ].map((value, index) => (
                  <Card key={index} className="shadow-card" role="region" aria-label={`Core value ${value.title}`}>
                    <CardContent className="p-4 sm:p-6 text-center">
                      <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-egyptian-blue">{value.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{value.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Container>
          </section>
        </LazyLoad>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 bg-gradient-hero text-white">
          <Container>
            <div className="text-center">
              <h2 className="font-display font-bold text-2xl sm:text-h2 mb-4 sm:mb-6">
                Ready to Partner with India's Infrastructure Leader?
              </h2>
              <p className="text-base sm:text-xl mb-6 sm:mb-8 leading-relaxed max-w-xl sm:max-w-2xl mx-auto">
                Join our growing list of satisfied customers who trust Gajpati Industries for their most critical infrastructure projects.
              </p>
              <div className="flex justify-center">
                <Button variant="action" size="lg" asChild className="w-auto min-w-[160px] px-3 py-2 sm:min-w-[200px] sm:px-4 sm:py-2">
                  <Link to="/contact">Start Your Project Today</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Floating CTA */}
        <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 px-4">
          <Button variant="action" size="sm" className="shadow-xl" onClick={handleWhatsAppRedirect}>
            <MessageCircleCode className="h-4 w-4 mr-2" />
            Quick Quote
          </Button>
        </div>
      </div>
    </>
  );
};

export default About;