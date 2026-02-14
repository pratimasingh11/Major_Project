// app/news/page.tsx


import NewsGrid from "./NewsGrid";

//====================
// 1. Type Definitions
//====================
type NewsItem = {
  title: string;        // News headline
  summary: string;      // Short summary of the news
  source: string;       // Source of the news (e.g., "Reuters")
  url: string;          // Link to full article
  image?: string;       // Optional image URL
  publishedAt?: string; // Optional publish date
};

//====================
// 2. Fetch News Data
//====================
async function getNews(): Promise<NewsItem[]> {
  try {
    // Fetch news from backend API
    const res = await fetch("http://localhost:8000/api/news", { cache: "no-store" });

    // Throw error if request failed
    if (!res.ok) throw new Error("Failed to fetch news");

    // Return JSON response
    return res.json();
  } catch (err) {
    console.error("Error fetching news:", err);
    return []; // Return empty array on error
  }
}

//====================
// 3. Main Component
//====================
export default async function NewsPage() {
  // Fetch news data before rendering (Server-side rendering / async component)
  const news = await getNews();

  return (
    <div style={{ padding: "24px" }}>
      {/* Page Title */}
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>Latest News</h1>

      {/* News Grid */}
      <NewsGrid news={news} />
    </div>
  );
}
