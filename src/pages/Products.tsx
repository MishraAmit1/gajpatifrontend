import { useEffect, useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Download,
  Building2,
  Shield,
  Beaker,
  ArrowRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchPlantsWithStats, type PlantWithStats } from "../services/plantStats";

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Product interface
interface Product {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  shortDescription?: string;
  category?: string;
  certification?: string;
  images?: { url: string; alt: string; isPrimary?: boolean }[];
  brochure?: { url: string; title: string };
  plantId?: { _id?: string; name?: string; certifications?: string[] };
  natureId?: { _id?: string; name?: string };
  plants?: string[];
  plantNames?: string[];
  plantAvailability?: { state: string }[];
}

// Spinner component
export const Spinner = function Spinner({
  size = 8,
  border = 2,
  className = "",
}) {
  return (
    <div className={`flex justify-center items-center py-6 ${className}`}>
      <div
        className={`animate-spin rounded-full`}
        style={{
          height: `${size * 4}px`,
          width: `${size * 4}px`,
          borderTop: `${border}px solid #2563eb`,
          borderBottom: `${border}px solid #2563eb`,
          borderLeft: `${border}px solid transparent`,
          borderRight: `${border}px solid transparent`,
          opacity: 0.8,
        }}
      />
    </div>
  );
};

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryIdFromQuery = searchParams.get("categoryId");
  const plantIdFromQuery = searchParams.get("plantId");
  const natureIdFromQuery = searchParams.get("natureId");

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Fetch plant data
  const { data: plants, isLoading: plantsLoading, error: plantsError } = useQuery({
    queryKey: ['plants'],
    queryFn: fetchPlantsWithStats,
    staleTime: 5 * 60 * 1000,
  });

  function capitalizeWords(str: string) {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Define static category configurations
  const categoryConfigs = {
    bitumen: {
      icon: Building2,
      gradient: "bg-gradient-to-br from-egyptian-blue to-violet-blue",
      bgImage: "https://www.constructionworld.in/assets/uploads/s_ae40e2939eb212f9b98fc628c69fbf5a.jpg",
    },
    gabion: {
      icon: Shield,
      gradient: "bg-gradient-to-br from-egyptian-blue to-violet-blue",
      bgImage: "https://cdn.mos.cms.futurecdn.net/hFHLgTVFX6VJpwPDUzrEtL.jpg",
    },
    construct: {
      icon: Beaker,
      gradient: "bg-gradient-to-br from-egyptian-blue to-violet-blue",
      bgImage: "https://backgroundimages.withfloats.com/actual/5bd1af4f3f02cc0001c0f035.jpg",
    },
  };

  // Define the desired category order
  const categoryOrder = ['bitumen', 'gabion', 'construct'];

  // Dynamically create productCategories from plant data
  const productCategories = useMemo(() => {
    if (!plants) return [];
    const categories = plants.map((plant) => {
      const nameLower = plant.name.toLowerCase();
      let categoryId = 'other';
      let config = {
        icon: Building2,
        gradient: "bg-gradient-to-br from-egyptian-blue to-violet-blue",
        bgImage: "https://via.placeholder.com/1200x300",
      };

      if (nameLower.includes('bitumen')) {
        categoryId = 'bitumen';
        config = categoryConfigs.bitumen;
      } else if (nameLower.includes('gabion')) {
        categoryId = 'gabion';
        config = categoryConfigs.gabion;
      } else if (nameLower.includes('construction') || nameLower.includes('chemical')) {
        categoryId = 'construct';
        config = categoryConfigs.construct;
      }

      return {
        id: categoryId,
        name: plant.name,
        tagline: plant.description || "Explore our range of products",
        icon: config.icon,
        gradient: config.gradient,
        bgImage: config.bgImage,
        plantId: plant._id,
      };
    });

    return categories.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a.id);
      const indexB = categoryOrder.indexOf(b.id);
      return (indexA === -1 ? categoryOrder.length : indexA) - (indexB === -1 ? categoryOrder.length : indexB);
    });
  }, [plants]);

  const currentCategory = productCategories.find(
    (cat) => cat.id === categoryIdFromQuery
  );

  // Helper to check if search term is meaningful
  function isValidSearchTerm(term: string) {
    return /[a-zA-Z0-9]/.test(term);
  }

  // Reset page/products when filter/search changes
  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
  }, [categoryIdFromQuery, natureIdFromQuery, debouncedSearch]);

  // Fetch products when plantId, natureId, search, or page changes
  useEffect(() => {
    if (!plantIdFromQuery || !currentCategory || !natureIdFromQuery) return;

    setLoading(true);
    setError(null);
    let url = `${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"
      }/api/v1/products/search?plantId=${plantIdFromQuery}&page=${page}&limit=${PAGE_SIZE}`;

    if (natureIdFromQuery) {
      url += `&natureId=${natureIdFromQuery}`;
    }
    if (debouncedSearch.trim() !== "" && isValidSearchTerm(debouncedSearch)) {
      url += `&search=${encodeURIComponent(debouncedSearch)}`;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        const newProducts = data.data?.products || [];
        setTotal(data.data?.total || 0);
        if (page === 1) {
          setProducts(newProducts);
        } else {
          setProducts((prev) => [...prev, ...newProducts]);
        }
        setHasMore(page * PAGE_SIZE < (data.data?.total || 0));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoryIdFromQuery, plantIdFromQuery, natureIdFromQuery, debouncedSearch, page, currentCategory]);

  // Infinite scroll: observe sentinel
  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      { root: null, rootMargin: "0px", threshold: 1.0 }
    );
    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);
    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [hasMore, loading]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-egyptian-blue to-violet-blue text-white py-12 sm:py-16 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-hero mb-3 sm:mb-4">
              Industrial Chemical Solutions
            </h1>
            <p className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl sm:max-w-3xl mx-auto">
              Comprehensive range of IS/ASTM certified chemical products for
              infrastructure development across India
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {!categoryIdFromQuery && !natureIdFromQuery ? (
          <section className="py-8 sm:py-10 bg-gradient-to-b from-background to-slate-50">
            <div className="container-industrial">
              <div className="text-center mb-10 sm:mb-12">
                <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-eerie-black mb-3 sm:mb-4">
                  Our Product Categories
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-xl sm:max-w-2xl mx-auto leading-relaxed">
                  Discover our comprehensive range of industrial-grade solutions
                  designed for modern infrastructure needs
                </p>
              </div>
              {plantsLoading ? (
                <div className="text-center py-8 sm:py-12">
                  <Spinner size={8} border={3} />
                </div>
              ) : plantsError ? (
                <div className="text-center py-8 sm:py-12">
                  <p className="text-red-500 text-sm sm:text-base">{plantsError.message}</p>
                  <Button variant="outline" onClick={() => window.location.reload()} className="mt-3 sm:mt-4 text-sm sm:text-base">
                    Retry
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {productCategories.map((category, index) => (
                    <Link
                      to={`/nature/${category.id}`}
                      key={category.name}
                      className="block group"
                      onClick={() => console.log(`Navigating to /nature/${category.id}`)}
                    >
                      <div
                        className="card-industrial p-6 sm:p-8 text-center hover-lift fade-in hover-lift rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="relative mb-4 sm:mb-6 overflow-hidden rounded-lg">
                          <img
                            src={category.bgImage}
                            alt={category.name}
                            className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 p-2 sm:p-3 bg-white rounded-lg shadow-md">
                            <category.icon className="w-6 h-6 sm:w-8 sm:h-8 text-egyptian-blue" />
                          </div>
                        </div>
                        <h3 className="font-display font-semibold text-lg sm:text-xl lg:text-2xl text-eerie-black mb-2 sm:mb-3 group-hover:text-egyptian-blue transition-colors">
                          {capitalizeWords(category.name || "Category")}
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 text-justify">
                          {category.tagline}
                        </p>
                        <div className="flex items-center justify-center text-egyptian-blue text-sm sm:text-base font-medium group-hover:text-violet-blue transition-colors">
                          <span>Explore Product Types</span>
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className="py-8 sm:py-10">
            <div className="relative overflow-hidden mb-4 sm:mb-6 rounded-xl shadow-lg transform transition-all duration-500 ease-in-out hover:scale-[1.01] h-[160px] sm:h-[200px] lg:h-[240px]">
              <div className="absolute inset-0 opacity-50">
                <img
                  src={currentCategory?.bgImage || "https://via.placeholder.com/1200x300"}
                  alt={currentCategory?.name + " background" || "Category background"}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="relative z-10 p-4 sm:p-6 lg:p-8 text-white h-full flex items-center">
                <div className="max-w-xl sm:max-w-2xl">
                  <h3 className="font-display font-bold text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3 leading-tight">
                    {currentCategory?.name || "Category"}™
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 opacity-90 leading-relaxed">
                    {currentCategory?.tagline || "Explore our range of products"}
                  </p>
                  <Button
                    variant="secondary"
                    className="bg-amber text-eerie-black hover:bg-amber/90 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 w-auto min-w-[140px] sm:min-w-[160px]"
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Download Category Brochure
                  </Button>
                </div>
              </div>
            </div>

            {/* Filters Section */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search products by name, description, or specifications..."
                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-200 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-egyptian-blue focus:border-egyptian-blue transition-all duration-300 placeholder-gray-400 bg-gray-50 hover:bg-white focus:bg-white shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search products"
                      />
                      <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                  </div>
                  {searchTerm && (
                    <div className="pt-3 sm:pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                          Active Filters
                        </span>
                        <button
                          onClick={() => setSearchTerm("")}
                          className="text-xs sm:text-sm font-medium text-egyptian-blue hover:text-violet-blue transition-colors px-2 sm:px-3 py-1 rounded-md hover:bg-blue-50"
                          aria-label="Clear all filters"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        <Badge
                          variant="secondary"
                          className="text-xs bg-blue-100 text-egyptian-blue hover:bg-blue-200 transition-colors cursor-pointer px-2 sm:px-3 py-1"
                          onClick={() => setSearchTerm("")}
                        >
                          Search: "{searchTerm}"
                          <span className="ml-1 font-bold">×</span>
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Results Header */}
            <div className="mb-4 sm:mb-6 bg-gray-50 rounded-md px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                {loading ? "Loading..." : `Showing ${products.length} of ${total} products`}
              </p>
            </div>

            {/* Products Grid */}
            {error && <div className="text-center text-red-500 text-sm sm:text-base py-8 sm:py-12">{error}</div>}
            {loading && page === 1 ? (
              <div className="text-center py-8 sm:py-12">
                <Spinner size={8} border={3} />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <Card
                      key={product._id || product.id}
                      className="shadow-card hover:shadow-xl transition-shadow duration-300"
                    >
                      <CardContent className="p-0">
                        <div className="h-40 sm:h-48 bg-gradient-to-br from-platinum to-white border-b border-gray-200 flex items-center justify-center">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={
                                product.images.find((img) => img.isPrimary)?.url ||
                                product.images[0].url
                              }
                              alt={
                                product.images.find((img) => img.isPrimary)?.alt ||
                                product.images[0].alt ||
                                product.name
                              }
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-5xl sm:text-6xl text-egyptian-blue/20 font-bold">
                              {product.name?.charAt(0) || "P"}
                            </div>
                          )}
                        </div>
                        <div className="p-4 sm:p-6">
                          <div className="flex items-start justify-between mb-2 sm:mb-3">
                            <Badge variant="secondary" className="text-xs sm:text-sm">
                              {product.plantId?.name || "Plant"}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs sm:text-sm text-amber border-amber"
                            >
                              {product.certification ||
                                product.plantId?.certifications?.[0] || "Certified"}
                            </Badge>
                          </div>
                          <h3 className="font-display font-semibold text-base sm:text-lg lg:text-lg text-eerie-black mb-2 group-hover:text-egyptian-blue transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                            {product.description || product.shortDescription}
                          </p>
                          <div className="mb-3 sm:mb-4">
                            <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Available at:</p>
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              {product.plantAvailability && product.plantAvailability.length > 0 ? (
                                product.plantAvailability.map((pa: any, idx: number) => (
                                  <Badge
                                    key={pa.state || idx}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {pa.state}
                                  </Badge>
                                ))
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  N/A
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 sm:gap-3">
                            <Button
                              asChild
                              variant="enterprise"
                              size="sm"
                              className="w-auto min-w-[120px] sm:min-w-[140px] px-3 sm:px-4 py-2"
                            >
                              <Link to={`/product/${product._id || product.id}`}>
                                View Details
                              </Link>
                            </Button>
                            {product.brochure?.url && (
                              <Button asChild variant="download" size="sm" className="px-3 sm:px-4 py-2">
                                <a
                                  href={product.brochure.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {hasMore && !loading && (
                    <div ref={sentinelRef} style={{ height: 1 }} />
                  )}
                  {loading && page > 1 && (
                    <div className="col-span-full flex justify-center py-6 sm:py-8 transition-opacity duration-300">
                      <Spinner size={8} border={3} />
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        )}
      </div>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-egyptian-blue to-violet-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-h2 mb-4 sm:mb-6">
            Need Custom Solutions?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 leading-relaxed max-w-xl sm:max-w-2xl mx-auto">
            Our technical team can develop specialized formulations tailored to
            your specific project requirements.
          </p>
          <div className="flex flex-col gap-3 sm:gap-4 justify-start sm:justify-center">
            <Button variant="action" size="lg" className="w-auto min-w-[160px] px-3 sm:min-w-[200px] sm:px-4 py-2">
              Request Custom Quote
            </Button>
            <Button variant="trust" size="lg" className="w-auto min-w-[160px] px-3 sm:min-w-[200px] sm:px-4 py-2">
              Speak with Technical Expert
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;