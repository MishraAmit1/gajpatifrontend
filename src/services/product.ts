export interface Product {
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
  natureId?: { _id: string; name: string };
  plants?: string[];
  plantNames?: string[];
  plantAvailability?: { state: string }[];
}

export async function fetchProducts(limit = 3): Promise<Product[]> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"}/api/v1/products/allProducts?page=1&limit=${limit}`,
    {
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return data.data?.products || [];
} 