export interface Inquiry {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName: string;
  city: string;
  purpose: 'Tender' | 'Site Use' | 'Resale' | 'Other';
  consent: boolean;
  selectedProducts: ('Bitumen' | 'Gabion' | 'Construct')[];
  description?: string; // Optional field for description
  status: 'New' | 'In Progress' | 'Resolved' | 'Closed';
  replies: { message: string; repliedAt: string; _id?: string }[];
  createdAt: string;
  updatedAt: string;
}

export async function fetchInquiries(status?: string): Promise<Inquiry[]> {
  let url = `${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"}/api/v1/inquires`;

  const params = new URLSearchParams();
  if (status && status !== 'all') {
    params.append('status', status);
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const token = localStorage.getItem("authToken"); // Assuming token is stored here
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch inquiries");
  const data = await res.json();
  return data.data || [];
}

export async function fetchInquiryById(id: string): Promise<Inquiry> {
  const token = localStorage.getItem("authToken"); // Assuming token is stored here
  const res = await fetch(
    `${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"}/api/v1/inquires/${id}`,
    {
      credentials: "include",
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch inquiry");
  const data = await res.json();
  return data.data;
}

export async function createInquiry(inquiryData: Omit<Inquiry, '_id' | 'createdAt' | 'updatedAt' | 'replies' | 'status'>): Promise<Inquiry> {
  const token = localStorage.getItem("authToken"); // Assuming token is stored here
  const res = await fetch(
    `${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"}/api/v1/inquires/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ ...inquiryData, status: "New" }),
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Failed to create inquiry");
  const data = await res.json();
  return data.data;
}