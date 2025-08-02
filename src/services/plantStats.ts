export interface PlantNatureProduct {
  plantId: string;
  plantName: string;
  natureId: string;
  natureName: string;
  productCount: number;
}

export interface PlantWithStats {
  _id: string;
  name: string;
  description: string;
  totalProductCount: number;
  topNatures: {
    _id: string;
    name: string;
    productCount: number;
  }[];
}

export async function fetchPlantNatureProducts(token: string): Promise<PlantNatureProduct[]> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"}/api/v1/plant-nature-products`,
    {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch plant-nature-products");
  const data = await res.json();
  return data.data;
}

export async function fetchPlantsWithStats(): Promise<PlantWithStats[]> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"}/api/v1/plants-with-stats`,
    {
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch plants with stats");
  const data = await res.json();
  return data.data;
} 