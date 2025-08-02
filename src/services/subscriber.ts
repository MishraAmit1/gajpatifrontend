interface SubscriberData {
  email: string;
}

export async function subscribe(data: SubscriberData): Promise<void> {
  const url = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/v1/subscribers`;
  
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to subscribe");
  }
}

export async function unsubscribe(id: string): Promise<void> { // Updated to use ID
  const url = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/v1/subscribers/${id}`;
  
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to unsubscribe");
  }
}