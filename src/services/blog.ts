export interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  description: string;
  content: string;
  category: string;
  author: string;
  readTime: string;
  featured: boolean;
  tags: string[];
  image: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  createdAt: string;
  updatedAt: string;
}

export async function fetchBlogs(
  category?: string,
  featured?: boolean,
  limit?: number,
  excludeSlug?: string
): Promise<Blog[]> {
  let url = `${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"}/api/v1/blogs`;
  
  const params = new URLSearchParams();
  if (category && category !== 'All') {
    params.append('category', category);
  }
  if (featured !== undefined) {
    params.append('featured', featured.toString());
  }
  if (limit) {
    params.append('limit', limit.toString());
  }
  if (excludeSlug) {
    params.append('excludeSlug', excludeSlug);
  }
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const res = await fetch(url, {
    credentials: "include",
  });
  
  if (!res.ok) throw new Error("Failed to fetch blogs");
  const data = await res.json();
  return data.data || [];
}

export async function fetchBlogById(id: string): Promise<Blog> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"}/api/v1/blogs/${id}`,
    {
      credentials: "include",
    }
  );
  
  if (!res.ok) throw new Error("Failed to fetch blog");
  const data = await res.json();
  return data.data;
}

export async function fetchBlogBySlug(slug: string): Promise<Blog> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"}/api/v1/blogs/slug/${slug}`,
    {
      credentials: "include",
    }
  );
  
  if (!res.ok) throw new Error("Failed to fetch blog");
  const data = await res.json();
  return data.data;
} 