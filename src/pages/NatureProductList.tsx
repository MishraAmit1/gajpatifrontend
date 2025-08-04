import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, NavLink, useSearchParams } from "react-router-dom"; // Added useSearchParams
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, MapPin, Beaker, ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Spinner } from "./Products";
import QuoteModal from "../components/QuoteModal";

// Define productCategories here or import it if it's in a separate file
const productCategories = [
    {
        id: "bitumen",
        name: "Bitumen Solutions",
        tagline:
            "Comprehensive range of CRMB, PMB, VG & PG grades for road construction and infrastructure projects.",
        bgImage:
            "https://www.shutterstock.com/image-photo/construction-site-laying-new-asphalt-600nw-1679316820.jpg",
        linkPdf: "https://gajpati.in/wp-content/uploads/2023/10/Bitumen-Product-Catalogue.pdf",

        plantId: "68808208cf8dba209c5a0b1d",
    },
    {
        id: "gabion",
        name: "Gabion Structures",
        tagline:
            "Advanced epoxy adhesives, sealants, admixtures, curing compounds and waterproofing solutions.",
        bgImage: "https://cdn.mos.cms.futurecdn.net/hFHLgTVFX6VJpwPDUzrEtL.jpg",
        linkPdf: "https://gajpati.in/wp-content/uploads/2023/10/Gabion-Product-Catalogue.pdf",
        plantId: "68808208cf8dba209c5a0b1e",
    },
    {
        id: "construct",
        name: "Construct Chemicals",
        tagline:
            "Engineered gabion mesh, boxes and rockfall netting systems for erosion control and stabilization.",
        bgImage:
            "https://backgroundimages.withfloats.com/actual/5bd1af4f3f02cc0001c0f035.jpg",
        linkPdf: "https://gajpati.in/wp-content/uploads/2023/10/Construct-Product-Catalogue.pdf",
        plantId: "68808208cf8dba209c5a0b1f",
    },
];

interface Product {
    _id?: string;
    id?: string;
    name: string;
    abbreviation?: string;
    slug?: string;
    description?: string;
    shortDescription?: string;
    category?: string;
    certification?: string;
    images?: { _id?: string; url: string; alt: string; isPrimary?: boolean }[];
    brochure?: { url: string; title: string };
    tds?: { url: string; title: string };
    plantId?: { _id?: string; name?: string; certifications?: string[] } | null;
    natureId?: { _id?: string; name?: string; slug?: string };
    plants?: string[];
    plantNames?: string[];
    plantAvailability?: { state: string; _id?: { $oid: string } }[];
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    technicalSpecifications?: { key: string; value: string; _id?: { $oid: string } }[];
    applications?: string[];
    isActive?: boolean;
}

interface Nature {
    _id?: string;
    name?: string;
    description?: string;

}

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <div className="text-red-500 text-center py-4">Something went wrong. Please try again.</div>;
        }
        return this.props.children;
    }
}

const NatureProductList = () => {
    const { natureId } = useParams<{ natureId: string }>();
    const [searchParams] = useSearchParams(); // Added to get categoryId
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [nature, setNature] = useState<Nature>({ name: "Nature", description: "" });
    const [currentCategory, setCurrentCategory] = useState<any>(null); // To store the category
    const PAGE_SIZE = 10;
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    // Get categoryId from URL and set currentCategory
    useEffect(() => {
        const categoryId = searchParams.get("categoryId");
        if (categoryId) {
            const foundCategory = productCategories.find((cat) => cat.id === categoryId);
            setCurrentCategory(foundCategory || null);
        }
    }, [searchParams]);

    if (!natureId) {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-red-500 py-12">
                        Error: No nature ID provided in the URL.
                        <div className="mt-4">
                            <Button asChild variant="action">
                                <Link to="/products">Return to Products</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Fetch nature details
    useEffect(() => {
        fetch(
            `${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"
            }/api/v1/natures/${natureId}`
        )
            .then((res) => {
                if (!res.ok) throw new Error(`Failed to fetch nature: ${res.statusText}`);
                return res.json();
            })
            .then((data) => {
                setNature({ name: data.data?.name || "Nature", description: data.data?.description || "" });
            })
            .catch((err) => {
                setError(err.message);
            });
    }, [natureId]);

    // Fetch products
    useEffect(() => {
        setLoading(true);
        setError(null);
        const url = `${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"
            }/api/v1/products/search?natureId=${natureId}&page=${page}&limit=${PAGE_SIZE}`;

        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);
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
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [natureId, page]);

    // Infinite scroll
    useEffect(() => {
        if (!hasMore || loading) return;
        const observer = new IntersectionObserver(
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
            {/* Navigation Bar */}
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-card border-b border-border">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Link to="/" className="hover:text-foreground transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link to="/products" className="hover:text-foreground transition-colors">
                        Products
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link
                        to={`/nature/${searchParams.get("categoryId")}`}
                        className="hover:text-foreground transition-colors"
                    >
                        {currentCategory?.name || "Category"}
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-foreground font-medium">
                        {nature.name}
                    </span>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="relative rounded-lg overflow-hidden mb-8">
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center"
                        style={{
                            backgroundImage: `url('${currentCategory?.bgImage || "https://cdn.mos.cms.futurecdn.net/hFHLgTVFX6VJpwPDUzrEtL.jpg"}')`,
                        }}
                        aria-hidden="true"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow opacity-90" />

                    {/* Content */}
                    <div className="relative z-10 p-6 md:p-12 text-white">
                        <div className="max-w-3xl">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                                    IS Certified
                                </Badge>
                                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                                    Construction
                                </Badge>
                                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                                    Eco-Safe
                                </Badge>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                {nature.name}
                            </h1>
                            <p className="text-lg md:text-xl mb-6 text-white/90 leading-relaxed">
                                {nature.description || "Explore our range of products under this category."}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to={currentCategory?.linkPdf || "#"} target="_blank" className="flex items-center">
                                    <Button variant="secondary" size="lg" className="bg-accent hover:bg-accent/90">
                                        Download Complete Catalog
                                    </Button>
                                </Link>
                                <Button onClick={() => setIsModalOpen(true)} variant="outline" size="lg" className="border-white text-black hover:bg-white hover:text-primary">
                                    Technical Support
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Header */}
                <div className="mb-6 bg-gray-50 rounded-md px-4 py-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-600">
                        {loading ? "Loading..." : `Showing ${products.length} of ${total} products`}
                    </p>
                </div>

                {/* Products Accordion */}
                {error && (
                    <div className="text-center text-red-500 py-12">
                        {error}
                        <div className="mt-4">
                            <Button asChild variant="action">
                                <Link to="/products">Return to Products</Link>
                            </Button>
                        </div>
                    </div>
                )}
                {loading && page === 1 ? (
                    <div className="text-center py-12">
                        <Spinner />
                    </div>
                ) : products.length === 0 && !loading ? (
                    <div className="text-center text-gray-600 py-12">
                        No products found for this category.
                    </div>
                ) : (
                    <div className="mb-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-foreground mb-2">Product Range</h2>
                            <p className="text-muted-foreground">
                                Choose from our comprehensive range of products designed for specific applications
                            </p>
                        </div>
                        <ErrorBoundary>
                            <Accordion type="single" collapsible className="space-y-4">
                                {products.map((product) => (
                                    <AccordionItem
                                        key={product._id || product.id}
                                        value={product._id || product.id || `product-${Math.random().toString(36).substring(2)}`}
                                        className="border rounded-lg bg-card shadow-sm"
                                    >
                                        <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 rounded-t-lg">
                                            <div className="flex items-center justify-between w-full mr-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="text-left">
                                                        <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {product.shortDescription}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="bg-primary/10 text-primary">
                                                        {product.certification || "IS Certified"}
                                                    </Badge>
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-secondary/20 text-secondary"
                                                    >
                                                        {product.natureId?.name || "Construction"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6 pb-6">
                                            <div className="grid md:grid-cols-3 gap-10 mt-4">
                                                {/* Specifications */}
                                                <div className="space-y-4 min-h-[120px]">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Beaker className="h-5 w-5 text-primary" />
                                                        <h4 className="font-semibold text-foreground">Specifications</h4>
                                                    </div>
                                                    <div className="space-y-2 text-sm">
                                                        {product.technicalSpecifications && product.technicalSpecifications.length > 0 ? (
                                                            product.technicalSpecifications.map((spec, index) => (
                                                                <div key={spec._id?.$oid || index} className="flex justify-between py-1 border-b border-border">
                                                                    <span className="text-muted-foreground">{spec.key || `Spec ${index + 1}`}</span>
                                                                    <span className="font-medium">{spec.value}</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm text-muted-foreground">No specifications available</p>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Applications */}
                                                <div className="space-y-4 min-h-[120px]">
                                                    <h4 className="font-semibold text-foreground">Applications</h4>
                                                    <ul className="space-y-2 text-sm">
                                                        {product.applications && product.applications.length > 0 ? (
                                                            product.applications.map((app, index) => (
                                                                <li key={index} className="flex items-start gap-2">
                                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                                    <span className="text-muted-foreground">{app}</span>
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <li className="text-sm text-muted-foreground">No applications listed</li>
                                                        )}
                                                    </ul>
                                                </div>
                                                {/* Plant Availability */}
                                                <div className="space-y-4 min-h-[120px]">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <MapPin className="h-4 w-4 text-primary" />
                                                        <h5 className="font-medium text-foreground">Plant Availability</h5>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {product.plantAvailability && product.plantAvailability.length > 0 ? (
                                                            product.plantAvailability.map((pa, index) => (
                                                                <Badge
                                                                    key={pa._id?.$oid || `plant-${index}`}
                                                                    variant="outline"
                                                                    className="bg-green-50 text-green-700 border-green-200"
                                                                >
                                                                    {pa.state || "Unknown"}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <Badge variant="outline" className="text-xs">
                                                                N/A
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Action Buttons */}
                                            <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-border">
                                                {product.tds?.url && (
                                                    <Button asChild variant="default" size="sm" className="bg-primary hover:bg-primary/90">
                                                        <a href={product.tds.url} target="_blank" rel="noopener noreferrer">
                                                            <Download className="h-4 w-4 mr-2" />
                                                            Download TDS
                                                        </a>
                                                    </Button>
                                                )}
                                                <Button asChild variant="outline" size="sm">
                                                    <Link to={`/product/${product.slug || product.id}`}>View Details</Link>
                                                </Button>
                                                <Button variant="ghost" size="sm" className="text-primary">
                                                    Technical Support
                                                </Button>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                                {hasMore && !loading && <div ref={sentinelRef} style={{ height: 1 }} />}
                                {loading && page > 1 && (
                                    <div className="col-span-full flex justify-center py-8 transition-opacity duration-300">
                                        <Spinner size={10} border={4} />
                                    </div>
                                )}
                            </Accordion>
                        </ErrorBoundary>
                    </div>
                )}
            </div>
            <QuoteModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />

        </div>
    );
};

export default NatureProductList;