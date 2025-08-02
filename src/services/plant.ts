export interface PlantProduct {
  name: string;
  status: string;
  quantity: string;
}

export interface Plant {
  _id: string;
  name: string;
  slug: string;
  description: string;
  capacity: string;
  location: string;
  established: string;
  machinery: string[];
  certifications: string[];
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  products: PlantProduct[];
}

export async function fetchPlantsWithProducts(): Promise<Plant[]> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"}/api/v1/plants/with-products`,
    {
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch plants with products");
  const data = await res.json();
  return data.data;
} 