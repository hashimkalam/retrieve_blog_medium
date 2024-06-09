interface BlogPost {
  title: string;
  date: string;
  link: string;
  imageUrl?: string; // Corrected prop name
}

const BlogCard: React.FC<BlogPost> = ({ title, date, link, imageUrl }) => {
  console.log("image url -> ", imageUrl);
  return (
    <div className="bg-black/50 p-5">
      {imageUrl ? (
        <img src={imageUrl} alt={title} />
      ) : (
        <div className="fallback-image">No Image Available</div>
      )}
      <h1 className="text-white">{title}</h1>
      <p className="text-white">{date}</p>
      {link && (
        <a href={link} className="text-blue-500">
          Read more
        </a>
      )}
    </div>
  );
};

export default BlogCard;
