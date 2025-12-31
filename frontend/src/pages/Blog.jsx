import "../css/blog.css";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const navigate = useNavigate();

  // Static blog posts
  const blogPosts = [
    {
      title: "10 Benefits of Eating Organic Food",
      image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
      desc: "Discover how organic food helps improve your health, immunity, and overall lifestyle naturally.",
      fullContent: `Eating organic food has multiple benefits: 
- Improves immunity
- Reduces chemical intake
- Supports local farmers
- Enhances taste and freshness
- Better for the environment.`,
      slug: "benefits-of-eating-organic-food",
    },
    {
      title: "How to Grow Your Own Organic Garden",
      image: "https://images.unsplash.com/photo-1492496913980-501348b61469",
      desc: "Learn the basics of starting your own organic garden — from soil prep to eco-friendly pest control.",
      fullContent: `Steps to start your organic garden:
1. Choose a location with sunlight
2. Prepare nutrient-rich soil
3. Select seeds/plants
4. Use organic fertilizers
5. Avoid chemicals and pesticides
6. Water regularly and monitor growth.`,
      slug: "grow-your-own-organic-garden",
    },
    {
      title: "Why Choose Eco-Friendly Packaging",
      image: "https://media.istockphoto.com/id/537432292/photo/young-soybean-plants-growing-in-cultivated-field.jpg?s=612x612&w=0&k=20&c=i8O8R6yQ4hKzX1Ah6SJZmphvwPgnyj-f9X47NDYQOQc=",
      desc: "Reduce your carbon footprint with sustainable packaging and support a greener planet.",
      fullContent: `Eco-friendly packaging benefits:
- Reduces plastic waste
- Supports sustainable practices
- Protects the environment
- Improves brand image
- Safer for consumers`,
      slug: "eco-friendly-packaging",
    },
  ];

  const handleReadMore = (index) => {
    navigate(`/blog/${index}`);
  };

  return (
    <section className="blog-section">
      <h2 className="blog-title">🌿 Our Organic Blog</h2>
      <p className="blog-subtitle">
        Stay updated with the latest trends, tips, and stories from the organic world.
      </p>

      <div className="blog-container">
        {blogPosts.map((post, index) => (
          <div className="blog-card" key={index}>
            <img src={post.image} alt={post.title} />
            <div className="blog-content">
              <h3>{post.title}</h3>
              <p>{post.desc}</p>
              <button
                className="read-more"
                onClick={() => handleReadMore(index)}
              >
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blog;
