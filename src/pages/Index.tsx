import { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import LazyLoad from 'react-lazyload';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Link } from 'react-router-dom';
import { fetchPlantsWithStats, type PlantWithStats } from '../services/plantStats';
import heroManufacturing from '../assets/hero-manufacturing.jpg';
import { ArrowRight, CheckCircle, Factory, Shield, Award, Phone, Building2, Beaker } from 'lucide-react';
import { fetchProducts } from '../services/product';
import type { Product } from '../services/product';
import QuoteModal from "../components/QuoteModal";

const Container = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 ${className}`}>{children}</div>
);

const LoadingSpinner = () => (
  <div className="text-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber mx-auto"></div>
    <p className="text-gray-600 mt-4">Loading...</p>
  </div>
);

const ErrorFallback = ({ error }: { error: string }) => (
  <div className="text-center py-12">
    <p className="text-red-500">{error}</p>
    <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
      Retry
    </Button>
  </div>
);

const Index = () => {
  const getPlantIcon = useCallback((plantName: string) => {
    const name = plantName.toLowerCase();
    if (name.includes('road') || name.includes('bitumen') || name.includes('tar')) {
      return <Building2 className="h-9 w-9 text-white" />;
    } else if (name.includes('rock') || name.includes('gabion') || name.includes('mesh')) {
      return <Shield className="h-9 w-9 text-white" />;
    } else if (name.includes('chem') || name.includes('concrete') || name.includes('construction')) {
      return <Beaker className="h-9 w-9 text-white" />;
    } else {
      return <Factory className="h-9 w-9 text-white" />;
    }
  }, []);

  const { data: plants, isLoading: plantsLoading, error: plantsError } = useQuery({
    queryKey: ['plants'],
    queryFn: fetchPlantsWithStats,
    staleTime: 5 * 60 * 1000,
    // select: (plants) => {
    //   // Ye ab nahi chahiye, custom sort neeche karenge
    //   return [...plants].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    // }
  });

  const { data: flagshipProducts, isLoading: flagshipLoading, error: flagshipError } = useQuery({
    queryKey: ['flagshipProducts'],
    queryFn: () => fetchProducts(20),
    staleTime: 5 * 60 * 1000,
    select: (allProducts) => {
      const plantMap = {
        bitumen: '68808208cf8dba209c5a0b1d',
        gabion: '68808208cf8dba209c5a0b1e',
        construct: '68808208cf8dba209c5a0b1f',
      };
      const flagship: Product[] = [];
      Object.values(plantMap).forEach((plantId) => {
        const prod = allProducts.find((p) => p.plantId && p.plantId._id === plantId);
        if (prod) flagship.push(prod);
      });
      return flagship;
    },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Gajpati Industries | India's Premier Infrastructure Chemicals Manufacturer</title>
        <meta
          name="description"
          content="Trusted by 5000+ projects, Gajpati Industries offers IS/ASTM certified infrastructure chemicals from 5 plants across India since 1998."
        />
        <meta
          name="keywords"
          content="infrastructure chemicals, eco-friendly products, Gajpati Industries, manufacturing plants, India"
        />
        <meta property="og:title" content="Gajpati Industries | Infrastructure Chemicals Manufacturer" />
        <meta
          property="og:description"
          content="Trusted by 5000+ projects, Gajpati Industries offers IS/ASTM certified infrastructure chemicals from 5 plants across India since 1998."
        />
        <meta property="og:image" content="https://yourdomain.com/images/hero-manufacturing.jpg" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gajpati Industries | Infrastructure Chemicals Manufacturer" />
        <meta
          name="twitter:description"
          content="Trusted by 5000+ projects, Gajpati Industries offers IS/ASTM certified infrastructure chemicals from 5 plants across India since 1998."
        />
        <meta name="twitter:image" content="https://yourdomain.com/images/hero-manufacturing.jpg" />
        <link rel="canonical" href="https://yourdomain.com" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Gajpati Industries",
            "url": "https://yourdomain.com",
            "logo": "https://yourdomain.com/images/logo.png",
            "description": "India's premier infrastructure chemicals manufacturer, trusted by 5000+ projects since 1998.",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-123-456-7890",
              "contactType": "Customer Service",
            },
            "sameAs": ["https://twitter.com/yourtwitter", "https://linkedin.com/company/yourlinkedin"],
          })}
        </script>
      </Helmet>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-hero text-white py-12 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{ backgroundImage: `url(${heroManufacturing})` }}
          ></div>

          <div className="relative max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-7xl mb-4 sm:mb-6 leading-tight">
                India's Premier
                <br />
                <span className="text-amber">Infrastructure Materials</span>
                <br />
                Partner
              </h1>
              <p className="text-base sm:text-xl leading-relaxed max-w-2xl sm:max-w-4xl mx-auto mb-6 sm:mb-8">
                Building a stronger India, together. IS/ASTM certified products from our manufacturing plant in Jammu & Kashmir, powering infrastructure development since 2020.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center w-full max-w-sm sm:max-w-none mx-auto">
                <Button
                  variant="cta"
                  size="lg"
                  asChild
                  className="w-auto min-w-[160px] px-3 py-2 sm:min-w-[200px] sm:px-4 sm:py-8 lg:min-w-[240px] lg:px-6 lg:py-7 text-base sm:text-lg"
                >
                  <Link to="/products">
                    Explore Industrial Solutions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="trust"
                  size="lg"
                  className="w-auto min-w-[160px] px-3 py-2 sm:min-w-[200px] sm:px-4 sm:py-8 lg:min-w-[240px] lg:px-6 lg:py-6 text-base sm:text-lg"
                >
                  Download Company Profile
                </Button>
              </div>
              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-6 mt-8 sm:mt-12 text-xs sm:text-sm">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-amber" />
                  ISO 9001:2015 Certified
                </div>
                <div className="flex items-center">
                  <Factory className="h-4 w-4 mr-2 text-amber" />
                  1 Manufacturing Plant
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2 text-amber" />
                  5+ Years Experience
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Plant Cards Section */}
        <LazyLoad height={200} offset={100}>
          <section className="py-8 sm:py-16 bg-white">
            <Container>
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="font-display font-bold text-2xl sm:text-4xl text-egyptian-blue mb-2 sm:mb-4">
                  Industrial Chemical Solutions Portfolio
                </h2>
                <p className="text-gray-600 max-w-xl sm:max-w-3xl mx-auto text-sm sm:text-base">
                  Our specialized product categories deliver comprehensive solutions for every infrastructure challenge.
                </p>
              </div>
              {plantsLoading ? (
                <LoadingSpinner />
              ) : plantsError ? (
                <ErrorFallback error={plantsError.message} />
              ) : (
                (() => {
                  // Custom order array
                  const plantOrder = ['bitumen', 'construct chemical', 'gabions'];
                  // Sort plants as per custom order
                  const orderedPlants = plants?.slice().sort(
                    (a, b) =>
                      plantOrder.indexOf(a.name.toLowerCase()) - plantOrder.indexOf(b.name.toLowerCase())
                  );
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {orderedPlants?.map((plant) => (
                        <Card key={plant._id} className="shadow-card hover:shadow-xl transition-all duration-300 group">
                          <CardContent className="p-4 sm:p-6">
                            <div className="text-center mb-4">
                              <div className="flex justify-center mb-3">
                                <div
                                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${plant.name.toLowerCase().includes('road') ||
                                    plant.name.toLowerCase().includes('bitumen') ||
                                    plant.name.toLowerCase().includes('tar')
                                    ? 'bg-blue-500'
                                    : plant.name.toLowerCase().includes('rock') ||
                                      plant.name.toLowerCase().includes('gabion') ||
                                      plant.name.toLowerCase().includes('mesh')
                                      ? 'bg-gray-500'
                                      : plant.name.toLowerCase().includes('chem') ||
                                        plant.name.toLowerCase().includes('concrete') ||
                                        plant.name.toLowerCase().includes('construction')
                                        ? 'bg-yellow-500'
                                        : 'bg-egyptian-blue'
                                    }`}
                                >
                                  {getPlantIcon(plant.name)}
                                </div>
                              </div>
                              <h3 className="font-display uppercase font-bold text-lg sm:text-xl text-egyptian-blue mb-1 sm:mb-2 group-hover:text-violet-blue">
                                {plant.name}
                              </h3>
                              <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">{plant.description}</p>
                              <Badge variant="outline" className="mb-2 sm:mb-4">
                                {plant.totalProductCount} Products Available
                              </Badge>
                            </div>
                            <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                              {plant.topNatures.map((nature) => (
                                <div key={nature._id} className="flex justify-between items-center text-xs sm:text-sm">
                                  <span className="text-gray-700">{nature.name}</span>
                                  <Badge variant="outline" className="text-xs">{nature.productCount}</Badge>
                                </div>
                              ))}
                            </div>
                            <Button variant="enterprise" size="sm" className="w-full" asChild>
                              <Link to={`/products`}>
                                Explore {plant.name}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  );
                })()
              )}
            </Container>
          </section>
        </LazyLoad>

        {/* Trust Section */}
        <section className="py-8 sm:py-16 bg-gradient-trust px-4">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-4xl text-egyptian-blue mb-4 sm:mb-6">
                  Trusted by India's Leading Infrastructure Projects
                </h2>
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 sm:mr-3" />
                    <span className="text-sm sm:text-base">Delhi Metro Phase 4 - Track Infrastructure</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 sm:mr-3" />
                    <span className="text-sm sm:text-base">Mumbai-Pune Expressway - Maintenance & Repairs</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 sm:mr-3" />
                    <span className="text-sm sm:text-base">Chennai Port Connectivity - New Construction</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 sm:mr-3" />
                    <span className="text-sm sm:text-base">Bangalore IT Parks - Structural Waterproofing</span>
                  </div>
                </div>
                <Button variant="action" size="lg" asChild className="w-auto min-w-[160px] px-3 py-2 sm:min-w-[200px] sm:px-4 sm:py-2">
                  <Link to="/about">Learn Our Story</Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                <Card className="shadow-card text-center p-4 sm:p-6">
                  <div className="text-2xl sm:text-3xl font-bold text-egyptian-blue">1</div>
                  <div className="text-gray-600 text-sm sm:text-base">Manufacturing Plant</div>
                </Card>
                <Card className="shadow-card text-center p-4 sm:p-6">
                  <div className="text-2xl sm:text-3xl font-bold text-egyptian-blue">5+</div>
                  <div className="text-gray-600 text-sm sm:text-base">Years Experience</div>
                </Card>
                <Card className="shadow-card text-center p-4 sm:p-6">
                  <div className="text-2xl sm:text-3xl font-bold text-egyptian-blue">Comprehensive</div>
                  <div className="text-gray-600 text-sm sm:text-base">Portfolio</div>
                </Card>
                <Card className="shadow-card text-center p-4 sm:p-6">
                  <div className="text-2xl sm:text-3xl font-bold text-egyptian-blue">Pan-India</div>
                  <div className="text-gray-600 text-sm sm:text-base">Supply Capability</div>
                </Card>
              </div>
            </div>
          </Container>
        </section>

        {/* Flagship Products */}
        <LazyLoad height={200} offset={100}>
          <section className="py-8 sm:py-16 bg-white px-4">
            <Container>
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="font-display font-bold text-2xl sm:text-4xl text-egyptian-blue mb-2 sm:mb-4">
                  Flagship Products
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">Industry-leading solutions for critical applications</p>
              </div>
              {flagshipLoading ? (
                <LoadingSpinner />
              ) : flagshipError ? (
                <ErrorFallback error={flagshipError.message} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                  {flagshipProducts?.map((product, index) => (
                    <Card
                      key={product._id || product.id || index}
                      className="shadow-card hover:shadow-xl transition-shadow duration-300"
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="h-32 sm:h-40 w-full bg-gradient-to-br from-platinum to-white rounded-lg mb-3 sm:mb-4 flex items-center justify-center overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={`${product.images.find(img => img.isPrimary)?.url || product.images[0].url}?format=webp&quality=80`}
                              alt={product.images.find(img => img.isPrimary)?.alt || `Image of ${product.name}`}
                              className="h-full w-full object-cover rounded-lg"
                              loading="lazy"
                            />
                          ) : (
                            <div className="text-4xl text-egyptian-blue/30">📦</div>
                          )}
                        </div>
                        <Badge variant="secondary" className="mb-1 sm:mb-2">
                          {product.category || 'Product'}
                        </Badge>
                        <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">{product.name}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4">{product.description || product.shortDescription}</p>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                          <Badge variant="outline" className="text-amber border-amber text-xs">
                            {product.certification || 'Certified'}
                          </Badge>
                          <Button variant="enterprise" size="sm" asChild className="w-full sm:w-auto">
                            <Link to={`/product/${product._id || product.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </Container>
          </section>
        </LazyLoad>

        {/* Floating CTA */}
        <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 px-4">
          <Button variant="action" size="sm" className="shadow-xl" onClick={() => setIsModalOpen(true)}>
            <Phone className="h-4 w-4 mr-2" />
            Quick Quote
          </Button>
        </div>

        {/* Final CTA */}
        <section className="py-8 sm:py-16 bg-gradient-hero text-white px-4">
          <Container>
            <div className="text-center">
              <h2 className="font-display font-bold text-xl sm:text-3xl md:text-4xl mb-4 sm:mb-6">
                Ready to Power Your Next Infrastructure Project?
              </h2>
              <p className="text-base sm:text-xl mb-6 sm:mb-8 leading-relaxed">
                Join our list of successful partnerships. Get expert consultation, technical specifications, and competitive pricing tailored to your requirements.
              </p>
              {/* Final CTA Button Group */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center">
                <Button variant="action" size="xl" asChild>
                  <Link to="/contact">Get Expert Consultation</Link>
                </Button>
                <Button variant="trust" size="xl" asChild>
                  <Link to="/products">Browse Product Catalog</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </div>
      <QuoteModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />

    </>
  );
};

export default Index;
