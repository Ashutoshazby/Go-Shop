import { Heart, ShoppingBag, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fallbackImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80';

export const ProductCard = ({ product, onCart, onWishlist }) => (
  <motion.article
    layout
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -6 }}
    className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition dark:border-slate-800 dark:bg-slate-900"
  >
    <Link to={`/products/${product.slug || product._id}`} className="block">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          src={product.images?.[0]?.url || fallbackImage}
          alt={product.images?.[0]?.alt || product.name}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = fallbackImage;
          }}
        />
        {product.compareAtPrice && (
          <span className="absolute left-3 top-3 rounded-md bg-primary px-2 py-1 text-xs font-bold text-white">Sale</span>
        )}
      </div>
    </Link>
    <div className="p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wide text-accent">{product.category}</p>
        <span className="inline-flex items-center gap-1 text-xs text-amber-500">
          <Star size={14} fill="currentColor" /> {Number(product.rating || 0).toFixed(1)}
        </span>
      </div>
      <Link to={`/products/${product.slug || product._id}`} className="mt-2 block font-bold hover:text-accent">
        {product.name}
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <span className="font-black">Rs. {product.price?.toLocaleString('en-IN')}</span>
          {product.compareAtPrice && <span className="ml-2 text-sm text-slate-400 line-through">Rs. {product.compareAtPrice.toLocaleString('en-IN')}</span>}
        </div>
        <div className="flex gap-2">
          <button aria-label="Add to wishlist" onClick={() => onWishlist?.(product)} className="rounded-md border border-slate-200 p-2 hover:border-accent dark:border-slate-700">
            <Heart size={17} />
          </button>
          <button aria-label="Add to cart" onClick={() => onCart?.(product)} className="rounded-md bg-primary p-2 text-white hover:bg-accent hover:text-primary">
            <ShoppingBag size={17} />
          </button>
        </div>
      </div>
    </div>
  </motion.article>
);
