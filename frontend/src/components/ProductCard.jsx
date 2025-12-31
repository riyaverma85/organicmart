
import "../css/products.css"
const ProductCard = ({ product, onAdd }) => {
  return (
    <div className="product-card">
      <img src={product.image || "/placeholder.jpg"} alt={product.name} className="product-img" />
      <div className="product-body">
        <h4>{product.name}</h4>
        <p className="price">₹{product.price}</p>
        <p className="desc">{product.description?.slice(0, 80)}</p>
        <div className="product-actions">
          <button className="add-btn" onClick={() => onAdd(product)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
