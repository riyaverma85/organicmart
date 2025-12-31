import { useParams, useNavigate } from "react-router-dom";
import "../css/blogdetail.css"

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Same blog data as in Blog.jsx
  const blogPosts = [
    {
      title: "10 Benefits of Eating Organic Food",
      fullContent: `Eating organic food has multiple benefits: 
- Improves immunity
- Reduces chemical intake
- Supports local farmers
- Enhances taste and freshness
- Better for the environment.`,
    },
    {
      title: "How to Grow Your Own Organic Garden",
      fullContent: `Steps to start your organic garden:
1. Choose a location with sunlight
2. Prepare nutrient-rich soil
3. Select seeds/plants
4. Use organic fertilizers
5. Avoid chemicals and pesticides
6. Water regularly and monitor growth.`,
    },
    {
      title: "Why Choose Eco-Friendly Packaging",
      fullContent: `Eco-friendly packaging benefits:
- Reduces plastic waste
- Supports sustainable practices
- Protects the environment
- Improves brand image
- Safer for consumers`,
    },
  ];

  const blog = blogPosts[id];

  if (!blog) return <p>Blog not found!</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1>{blog.title}</h1>
      <p style={{ whiteSpace: "pre-line", marginTop: "1rem" }}>
        {blog.fullContent}
      </p>
      <button 
        style={{ marginTop: "2rem", padding: "0.5rem 1rem", cursor: "pointer" }}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
    </div>
  );
};

export default BlogDetail;
