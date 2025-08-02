import { useEffect, useState, useRef } from "react";
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

// Product categories data
const productCategories = [
  {
    id: "bitumen",
    name: "Bitumen Solutions",
    tagline:
      "Comprehensive range of CRMB, PMB, VG & PG grades for road construction and infrastructure projects.",
    icon: Building2,
    gradient: "bg-gradient-hero",
    bgImage:
      "https://www.constructionworld.in/assets/uploads/s_ae40e2939eb212f9b98fc628c69fbf5a.jpg",
    plantId: "68808208cf8dba209c5a0b1d",
  },
  {
    id: "gabion",
    name: "Gabion Structures",
    tagline:
      "Advanced epoxy adhesives, sealants, admixtures, curing compounds and waterproofing solutions.",
    icon: Shield,
    gradient: "bg-gradient-hero",
    bgImage: "https://cdn.mos.cms.futurecdn.net/hFHLgTVFX6VJpwPDUzrEtL.jpg",
    plantId: "68808208cf8dba209c5a0b1e",
  },
  {
    id: "construct",
    name: "Construction Chemicals",
    tagline:
      "Engineered gabion mesh, boxes and rockfall netting systems for erosion control and stabilization.",
    icon: Beaker,
    gradient: "bg-gradient-hero",
    bgImage:
      "https://backgroundimages.withfloats.com/actual/5bd1af4f3f02cc0001c0f035.jpg",
    plantId: "68808208cf8dba209c5a0b1f",
  },
];

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
      <section className="bg-gradient-hero text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-display font-bold text-hero mb-4">
              Industrial Chemical Solutions
            </h1>
            <p className="text-xl leading-relaxed max-w-3xl mx-auto">
              Comprehensive range of IS/ASTM certified chemical products for
              infrastructure development across India
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!categoryIdFromQuery && !natureIdFromQuery ? (
          <section className="py-10 bg-gradient-to-b from-background to-slate-50">
            <div className="container-industrial">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-heading font-bold mb-4 text-foreground">
                  Our Product Categories
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Discover our comprehensive range of industrial-grade solutions
                  designed for modern infrastructure needs
                </p>
              </div>
              <div className="grid-industrial">
                {productCategories.map((category, index) => (
                  <Link
                    to={`/nature/${category.id}`}
                    key={category.name}
                    className="block group"
                    onClick={() => console.log(`Navigating to /nature/${category.id}`)}
                  >
                    <div
                      className="card-industrial p-8 text-center hover-lift fade-in hover-lift rounded-lg border border-gray-200"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="relative mb-6 overflow-hidden rounded-lg">
                        <img
                          src={category.bgImage}
                          alt={category.name}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
                        <div className="absolute top-4 left-4 p-3 bg-white rounded-lg shadow-md">
                          <category.icon className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-heading font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {category.tagline}
                      </p>
                      <div className="flex items-center text-primary font-medium group-hover:text-primary-dark transition-colors">
                        <span>Explore Product Types</span>
                        <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="py-10">
            <div className="relative overflow-hidden mb-6 transform transition-all duration-500 ease-in-out hover:scale-[1.01] bg-black h-[180px] sm:h-[200px] md:h-[240px]">
              <div className="absolute inset-0 opacity-50">
                <img
                  src={currentCategory?.bgImage || "https://via.placeholder.com/1200x300"}
                  alt={currentCategory?.name + " background" || "Category background"}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="relative z-10 p-4 sm:p-6 md:p-12 text-white h-full flex items-center">
                <div className="max-w-2xl">
                  <h3 className="text-base sm:text-lg md:text-3xl font-bold mb-3 md:mb-4 leading-tight">
                    {currentCategory?.name || "Category"}™
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg mb-4 md:mb-6 opacity-90">
                    {currentCategory?.tagline || "Explore our range of products"}
                  </p>
                  <Button
                    variant="secondary"
                    className="bg-amber text-deep-gray hover:bg-amber/90 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Download Category Brochure
                  </Button>
                </div>
              </div>
            </div>

            {/* Filters Section */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search products by name, description, or specifications..."
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 bg-gray-50 hover:bg-white focus:bg-white shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search products"
                      />
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {searchTerm && (
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          Active Filters
                        </span>
                        <button
                          onClick={() => setSearchTerm("")}
                          className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors px-3 py-1 rounded-md hover:bg-blue-50"
                          aria-label="Clear all filters"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="secondary"
                          className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors cursor-pointer px-3 py-1"
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
            <div className="mb-6 bg-gray-50 rounded-md px-4 py-2 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">
                {loading ? "Loading..." : `Showing ${products.length} of ${total} products`}
              </p>
            </div>

            {/* Products Grid */}
            {error && <div className="text-center text-red-500 py-12">{error}</div>}
            {loading && page === 1 ? (
              <div className="text-center py-12">
                <Spinner />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <Card
                      key={product._id || product.id}
                      className="shadow-card hover:shadow-xl transition-shadow duration-300"
                    >
                      <CardContent className="p-0">
                        <div className="h-48 bg-gradient-to-br from-platinum to-white border-b border-gray-200 flex items-center justify-center">
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
                            <div className="text-6xl text-egyptian-blue/20 font-bold">
                              {product.name?.charAt(0) || "P"}
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <Badge variant="secondary" className="text-xs">
                              {product.plantId?.name || "Plant"}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs text-amber border-amber"
                            >
                              {product.certification ||
                                product.plantId?.certifications?.[0] ||
                                "Certification"}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg text-eerie-black mb-2">
                            {product.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                            {product.description || product.shortDescription}
                          </p>
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">Available at:</p>
                            <div className="flex flex-wrap gap-1">
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
                          <div className="flex gap-2">
                            <Button
                              asChild
                              variant="enterprise"
                              size="sm"
                              className="flex-1"
                            >
                              <Link to={`/product/${product._id || product.id}`}>
                                View Details
                              </Link>
                            </Button>
                            {product.brochure?.url && (
                              <Button asChild variant="download" size="sm">
                                <a
                                  href={product.brochure.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Download className="h-4 w-4" />
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
                    <div className="col-span-full flex justify-center py-8 transition-opacity duration-300">
                      <Spinner size={10} border={4} />
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        )}
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-h2 mb-6">
            Need Custom Solutions?
          </h2>
          <p className="text-xl mb-8 leading-relaxed">
            Our technical team can develop specialized formulations tailored to
            your specific project requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="action" size="xl">
              Request Custom Quote
            </Button>
            <Button variant="trust" size="xl">
              Speak with Technical Expert
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;