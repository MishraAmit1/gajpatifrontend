import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Download } from "lucide-react";
interface Product {
  _id: string;
  name: string;
  shortDescription: string;
  images?: { url: string; alt: string; isPrimary?: boolean }[];
  brochure?: { url: string; title: string };
  plantId: { name: string; certifications: string[] };
  plantAvailability?: { state: string }[];
}

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const natureId = searchParams.get("nature");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!natureId) {
      setError("No nature selected.");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"}/api/v1/products/by-nature?natureId=${natureId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then(data => setProducts(data.data?.products || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [natureId]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="font-display font-bold text-h1 text-egyptian-blue mb-8">
        Products
      </h2>
      {products.length === 0 ? (
        <div className="text-center text-gray-500">No products found for this nature.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
           <Card key={product._id} className="shadow-card hover:shadow-xl transition-shadow duration-300">
           <CardContent className="p-0">
             {/* Product Image */}
             <div className="w-full h-48 bg-gradient-to-br from-platinum to-white border-b border-gray-200 overflow-hidden flex items-center justify-center">
               {product.images && product.images.length > 0 ? (
                 <img
                   src={product.images.find(img => img.isPrimary)?.url || product.images[0].url}
                   alt={product.images.find(img => img.isPrimary)?.alt || product.images[0].alt}
                   className="w-full h-full object-cover"
                 />
               ) : (
                 <div className="text-6xl text-egyptian-blue/20 font-bold">
                   {product.name.charAt(0)}
                 </div>
               )}
             </div>
             {/* Product Info */}
             <div className="p-6">
               <div className="flex items-start justify-between mb-3">
                 <Badge variant="secondary" className="text-xs">
                   {product.plantId?.name || "Plant"}
                 </Badge>
                 <Badge variant="outline" className="text-xs text-amber border-amber">
                   {product.plantId?.certifications?.[0] || "Certification"}
                 </Badge>
               </div>
               <h3 className="font-semibold text-lg text-eerie-black mb-2">
                 {product.name}
               </h3>
               <p className="text-gray-600 text-sm mb-2 leading-relaxed">
                 {product.shortDescription}
               </p>
               {/* Plant Availability */}
               <div className="mb-4">
                 <p className="text-xs text-gray-500 mb-2">Available at:</p>
                 <div className="flex flex-wrap gap-1">
                   {product.plantAvailability && product.plantAvailability.length > 0 ? (
                     product.plantAvailability.map((pa, idx) => (
                       <Badge key={pa.state || idx} variant="outline" className="text-xs">
                         {pa.state}
                       </Badge>
                     ))
                   ) : (
                     <Badge variant="outline" className="text-xs">N/A</Badge>
                   )}
                 </div>
               </div>
               {/* Actions */}
               <div className="flex gap-2">
                 <Button 
                   asChild 
                   variant="enterprise" 
                   size="sm" 
                   className="flex-1"
                 >
                   <Link to={`/product/${product._id}`}>
                     View Details
                   </Link>
                 </Button>
                 {product.brochure?.url && (
                   <Button asChild variant="download" size="sm">
                     <a href={product.brochure.url} target="_blank" rel="noopener noreferrer">
                       <Download className="h-4 w-4" />
                     </a>
                   </Button>
                 )}
               </div>
             </div>
           </CardContent>
         </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;