"use client";

import React, { useEffect, useState } from "react";

interface BlogPost {
  title: string;
  date: string;
  link: string;
}

const Home: React.FC = () => {
  const [projects, setProjects] = useState<BlogPost[]>([]);

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

          return {
            title,
            date,
            link,
          };
        });

        setProjects(blogProjects); // set the fetched blog posts
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <div className="bg-black/50 min-h-screen">
      <h2 className="text-[96px] font-bold uppercase">blog</h2>
      {/* Now you can use the projects state to render the fetched blog posts */}
      <ul>
        {projects.map((project, index) => (
          <li key={index}>
            <a href={project.link}>{project.title}</a> - {project.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
