export interface Quote {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  city: string;
  selectedProducts: ("Bitumen" | "Gabion" | "Construct")[];
  status: "New" | "In Progress" | "Resolved" | "Closed";
  replies: { message: string; repliedAt: string; _id?: string }[];
  createdAt: string;
  updatedAt: string;
}

export async function createQuote(quoteData: Omit<Quote, "_id" | "createdAt" | "updatedAt" | "replies" | "status">): Promise<Quote> {
  const token = localStorage.getItem("authToken"); // Assuming token is stored here
  const res = await fetch(
    `${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"}/api/v1/quotes/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ ...quoteData, status: "New" }),
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Failed to create quote");
  const data = await res.json();
  return data.data;
}