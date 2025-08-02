import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Filter, Grid, List, ArrowRight, Download, Mail, Building2, Shield, Beaker } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "./Products";

// --- Interfaces ---
interface Nature {
    _id: string;
    name: string;
    image?: { url: string; alt: string }[];
    description: string;
    technicalOverview: string;
    keyFeatures: string[];
    applications: string[];
    plantId: { _id: string; name: string };
}

interface ProductCategory {
    id: string;
    name: string;
    tagline: string;
    bgImage: string;
    plantId: string;
    filters: {
        title: string;
        options: string[];
    }[];
    description?: string;
    icon?: any;
}

// --- Dummy Data ---
const productCategories: ProductCategory[] = [
    {
        id: "bitumen",
        name: "Bitumen Solutions",
        tagline: "Trusted Bitumen Technologies for Every Road",
        bgImage: "https://www.constructionworld.in/assets/uploads/s_ae40e2939eb212f9b98fc628c69fbf5a.jpg",
        description: "High-performance bitumen products for road construction, waterproofing and industrial applications.",
        icon: Building2,
        plantId: "68808208cf8dba209c5a0b1d",
        filters: [
            {
                title: "Grade Type",
                options: ["CRMB", "PMB", "VG", "PG"],
            },
            {
                title: "Application",
                options: ["Road Construction", "Waterproofing", "Industrial"],
            },
            {
                title: "Packaging",
                options: ["50kg Drums", "200kg Drums", "Bulk"],
            },
        ],
    },
    {
        id: "gabion",
        name: "Gabion Structures",
        tagline: "Advanced epoxy adhesives, sealants, admixtures, curing compounds and waterproofing solutions.",
        bgImage: "https://cdn.mos.cms.futurecdn.net/hFHLgTVFX6VJpwPDUzrEtL.jpg",
        description: "High-performance epoxy adhesives, sealants, admixtures and waterproofing solutions for construction.",
        icon: Shield,
        plantId: "68808208cf8dba209c5a0b1e",
        filters: [
            {
                title: "Product Type",
                options: ["Epoxy Adhesives", "Sealants", "Admixtures", "Gabion Structures"],
            },
            {
                title: "Application",
                options: ["Building Construction", "Waterproofing", "Repair"],
            },
            {
                title: "Packaging",
                options: ["5L Cans", "20L Drums", "200L Drums"],
            },
        ],
    },
    {
        id: "construct",
        name: "Construction Chemicals",
        tagline: "Engineered gabion mesh, boxes and rockfall netting systems for erosion control and stabilization.",
        bgImage: "https://backgroundimages.withfloats.com/actual/5bd1af4f3f02cc0001c0f035.jpg",
        description: "Engineered gabion mesh, boxes and rockfall netting systems for erosion control and stabilization.",
        icon: Beaker,
        plantId: "68808208cf8dba209c5a0b1f",
        filters: [
            {
                title: "Product Type",
                options: ["Gabion Mesh", "Gabion Boxes", "Rockfall Netting"],
            },
            {
                title: "Application",
                options: ["Erosion Control", "Slope Stabilization", "Retaining Walls"],
            },
            {
                title: "Size",
                options: ["1m x 1m", "2m x 1m", "3m x 1m"],
            },
        ],
    },
];

const FilterSidebar = ({
    mobile = false,
    categoryId,
    selectedFilters,
    onFilterChange,
}: {
    mobile?: boolean;
    categoryId: string;
    selectedFilters: { [filterTitle: string]: string[] };
    onFilterChange: (filterTitle: string, option: string) => void;
}) => {
    const currentCategory = productCategories.find((cat) => cat.id === categoryId);
    const filters = currentCategory?.filters || [
        {
            title: "Grade Type",
            options: [],
        },
    ];

    const FilterContent = () => (
        <div className="space-y-6">
            <h3 className="font-heading font-semibold text-lg">Filters</h3>
            {filters.map((filter) => (
                <div key={filter.title} className="space-y-3">
                    <h4 className="font-medium text-foreground">{filter.title}</h4>
                    <div className="space-y-2">
                        {filter.options.map((option) => (
                            <label
                                key={option}
                                className="flex items-center space-x-2 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    className="rounded border-border focus-industrial"
                                    checked={selectedFilters[filter.title]?.includes(option) || false}
                                    onChange={() => onFilterChange(filter.title, option)}
                                />
                                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    {option}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    if (mobile) {
        return (
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="md:hidden">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <SheetHeader>
                        <SheetTitle>Product Filters</SheetTitle>
                        <SheetDescription>
                            Filter products by specifications and features
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                        <FilterContent />
                    </div>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <div className="hidden md:block w-64 bg-card rounded-xl p-6 h-fit sticky top-6">
            <FilterContent />
        </div>
    );
};

// --- SubcategoryCard Component ---
const SubcategoryCard = ({
    title,
    description,
    productCount,
    image,
    link,
    keyFeatures = [],
    applications = [],
    specs,
}: {
    title: string;
    description: string;
    productCount: number;
    image: any;
    link: string;
    keyFeatures?: string[];
    applications?: string[];
    specs: string[];
}) => {
    return (
        <Link to={link} className="block group">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 flex flex-col h-full">
                {/* Image */}
                <div className="relative mb-4 overflow-hidden rounded-lg aspect-[4/3]">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-3 line-clamp-3">
                    {description}
                </p>

                {/* Key Features */}
                {applications.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {applications.slice(0, 3).map((feature, idx) => (
                            <span
                                key={idx}
                                className="bg-primary/10 text-primary text-xs px-2 py-1 rounded font-medium"
                            >
                                {feature}
                            </span>
                        ))}
                        {applications.length > 3 && (
                            <span className="text-xs text-zinc-400">+{applications.length - 3} more</span>
                        )}
                    </div>
                )}
                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="text-xs text-zinc-400">
                        {productCount} product{productCount !== 1 ? "s" : ""}
                    </span>
                    <div className="flex items-center text-primary font-medium text-sm group-hover:text-primary-dark transition-colors">
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </div>
        </Link>
    );
};

// --- Main NatureProducts Component ---
export const NatureProducts = () => {
    const { id } = useParams<{ id: string }>();
    const [natures, setNatures] = useState<Nature[]>([]);
    const [natureProductCounts, setNatureProductCounts] = useState<{ [key: string]: number }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // --- Filter State for Frontend Filtering ---
    const [selectedFilters, setSelectedFilters] = useState<{ [filterTitle: string]: string[] }>({});

    const handleFilterChange = (filterTitle: string, option: string) => {
        setSelectedFilters((prev) => {
            const options = prev[filterTitle] || [];
            return {
                ...prev,
                [filterTitle]: options.includes(option)
                    ? options.filter((o) => o !== option)
                    : [...options, option],
            };
        });
    };

    const currentCategory = productCategories.find((cat) => cat.id === id);

    // Fetch natures when id changes
    useEffect(() => {
        if (!id) {
            setError("No category ID provided in URL");
            setLoading(false);
            return;
        }

        if (!currentCategory) {
            setError(`Category "${id}" not found. Please select a valid category.`);
            setLoading(false);
            return;
        }
        setLoading(true);
        fetch(
            `${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"
            }/api/v1/natures/search?plantId=${currentCategory.plantId}`
        )
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch natures");
                return res.json();
            })
            .then((data) => {
                const naturesData = data.data?.natures || [];
                setNatures(naturesData);

                const fetchNatureCounts = async () => {
                    const counts: { [key: string]: number } = {};
                    for (const nature of naturesData) {
                        try {
                            const response = await fetch(
                                `${import.meta.env.VITE_API_URL ||
                                "https://gajpati-backend.onrender.com"
                                }/api/v1/products/search?plantId=${currentCategory.plantId
                                }&natureId=${nature._id}&limit=1`
                            );
                            const result = await response.json();
                            counts[nature._id] = result.data?.total || 0;
                        } catch (err) {
                            counts[nature._id] = 0;
                        }
                    }
                    setNatureProductCounts(counts);
                };

                fetchNatureCounts();
            })
            .catch((err) => {
                setNatures([]);
                setNatureProductCounts({});
                setError("Failed to load product types. Please try again later.");
            })
            .finally(() => setLoading(false));
    }, [id, currentCategory]);

    // --- Filtering Logic ---
    const filteredNatures = natures.filter((nature) => {
        return Object.entries(selectedFilters).every(([filterTitle, options]) => {
            if (options.length === 0) return true;

            // Case-insensitive
            if (filterTitle === "Application") {
                const applications = (nature.applications || []).map((a) => a.toLowerCase());
                return options.some((opt) => applications.includes(opt.toLowerCase()));
            }
            if (filterTitle === "Grade Type") {
                return options.some((opt) => nature.name.toLowerCase() === opt.toLowerCase());
            }
            if (filterTitle === "Product Type") {
                return options.some((opt) => nature.name.toLowerCase() === opt.toLowerCase());
            }
            return true;
        });
    });
    if (!currentCategory) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container-industrial py-8 text-center text-red-500">
                    Category not found
                    <div className="mt-4">
                        <Button asChild variant="action">
                            <Link to="/products">Return to Products</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-background">
                {/* Breadcrumb */}
                <nav className="container py-4 bg-white border-b border-gray-200">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
                        <span>&gt;</span>
                        <Link to="/products" className="hover:text-gray-900 transition-colors">Products</Link>
                        <span>&gt;</span>
                        <span className="text-gray-900 font-medium">{currentCategory.name}™</span>
                    </div>
                </nav>
                {/* Hero Section */}
                <section
                    className="relative flex items-center justify-center min-h-[60vh] bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${currentCategory.bgImage})`,
                    }}
                >
                    {/* Blue Overlay */}
                    <div className="absolute inset-0 bg-blue-900/70"></div>
                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto px-4 py-16">
                        {/* Icon */}
                        <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mb-6">
                            <span className="text-3xl text-white">
                                {currentCategory.icon && <currentCategory.icon />}
                            </span>
                        </div>
                        {/* Heading */}
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                            {currentCategory.name}™
                        </h1>
                        {/* Tagline */}
                        <p className="text-2xl text-white/90 mb-4">
                            {currentCategory.tagline}
                        </p>
                        {/* Description */}
                        <p className="text-lg text-white/80 mb-8">
                            {currentCategory.description || "Explore our range of products in this category. Each product is designed to meet the highest standards of quality and performance."}
                        </p>
                        {/* Button */}
                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" variant="secondary" className="bg-amber text-deep-gray hover:bg-amber/90">
                                <Download className="h-5 w-5 mr-2" />
                                Download Technical Data Sheet
                            </Button>

                            <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-deep-gray">
                                <Mail className="h-5 w-5 mr-2" />
                                Request Quote
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40">
                    <div className="container-industrial">
                        {/* Controls */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 mb-8">
                                <FilterSidebar
                                    mobile={true}
                                    categoryId={id}
                                    selectedFilters={selectedFilters}
                                    onFilterChange={handleFilterChange}
                                />
                                <span className="text-sm text-muted-foreground">
                                    {filteredNatures.length} subcategories
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant={viewMode === "grid" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("grid")}
                                >
                                    <Grid className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "list" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex gap-8">
                            <FilterSidebar
                                categoryId={id}
                                selectedFilters={selectedFilters}
                                onFilterChange={handleFilterChange}
                            />
                            <div className="flex-1">
                                {loading ? (
                                    <div className="text-center py-12">
                                        <Spinner />
                                    </div>
                                ) : error ? (
                                    <div className="text-center text-red-500 py-12">
                                        {error}
                                        <div className="mt-4">
                                            <Button asChild variant="action">
                                                <Link to="/products">Return to Products</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className={
                                            viewMode === "grid" ? "grid-industrial" : "space-y-4"
                                        }
                                    >
                                        {filteredNatures.length > 0 ? (
                                            filteredNatures.map((nature, index) => (
                                                <div
                                                    key={nature._id}
                                                    className="fade-in"
                                                    style={{ animationDelay: `${index * 100}ms` }}
                                                >
                                                    <SubcategoryCard
                                                        title={nature.name}
                                                        description={
                                                            nature.description || "Explore products in this category"
                                                        }
                                                        productCount={natureProductCounts[nature._id] || 0}
                                                        image={nature.image}
                                                        link={`/nature/${nature._id}/products?categoryId=${id}`}
                                                        specs={
                                                            nature.technicalOverview
                                                                ? nature.technicalOverview
                                                                    .split(",")
                                                                    .map((spec) => spec.trim())
                                                                : ["No specifications available"]
                                                        }
                                                        keyFeatures={nature.keyFeatures || []}
                                                        applications={nature.applications || []}
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-600">No product types available.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NatureProducts;