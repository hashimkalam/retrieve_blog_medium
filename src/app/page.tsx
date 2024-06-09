"use client";

import React, { useEffect, useState } from "react";
import BlogCard from "../../components/BlogCard";

interface BlogPost {
  title: string;
  date: string;
  link: string;
  imageUrls: string[]; // Changed from imageUrl to imageUrls
}

const Home: React.FC = () => {
  const [projects, setProjects] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const CORS_PROXY = "https://api.allorigins.win/get?url=";
        const url = `${CORS_PROXY}https://medium.com/feed/@hashiimkalam`;

        const response = await fetch(url);
        const result = await response.json();

        const parser = new DOMParser();
        const xml = parser.parseFromString(result.contents, "text/xml");
        const items = xml.querySelectorAll("item");

        const blogProjects: BlogPost[] = Array.from(items).map((item) => {
          const title = item.querySelector("title")?.textContent || "No title";
          const date = new Date(
            item.querySelector("pubDate")?.textContent || Date.now()
          ).toLocaleDateString();
          const link = item.querySelector("link")?.textContent || "#";
          const description =
            item.querySelector("description")?.textContent || "";
          const content = item.querySelector("content")?.textContent || "";

          // Function to extract all image URLs from HTML string
          const extractImageUrls = (html: string): string[] => {
            const imageUrls: string[] = [];
            const imgRegex = /<img.*?src=['"](.*?)['"]/g;
            let match;
            while ((match = imgRegex.exec(html)) !== null) {
              imageUrls.push(match[1]);
            }
            return imageUrls;
          };

          // Extract image URLs from both description and content
          const descriptionImageUrls = extractImageUrls(description);
          const contentImageUrls = extractImageUrls(content);
          const allImageUrls = [...descriptionImageUrls, ...contentImageUrls];

          return {
            title,
            date,
            link,
            imageUrls: allImageUrls,
          };
        });

        setProjects(blogProjects);
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setError("Error fetching blog posts. Please try again later.");
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <div className="bg-black/50 min-h-screen">
      <h2 className="text-[96px] font-bold uppercase">blog</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="flex flex-wrap">
        {projects.map((project, index) => (
          <BlogCard key={index} {...project} />
        ))}
      </div>
    </div>
  );
};

export default Home;
