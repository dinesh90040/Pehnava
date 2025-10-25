import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/contexts/CartContext';
import allProducts from '@/data/products.json';
import { useProductsMongo } from '@/hooks/useProductsMongo';

const OccasionFilter = ({ gender, onFilterChange }) => {
  const occasions = {
    women: ['Wedding', 'Festive', 'Party', 'Casual'],
    men: ['Wedding', 'Festive', 'Ceremony', 'Casual'],
    kids: ['Wedding', 'Festive', 'Birthday', 'Casual'],
  };

  const [selectedOccasion, setSelectedOccasion] = useState('All');

  const handleSelect = (occasion) => {
    setSelectedOccasion(occasion);
    onFilterChange(occasion);
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Button
        onClick={() => handleSelect('All')}
        variant={selectedOccasion === 'All' ? "default" : "outline"}
        className={selectedOccasion === 'All' ? "bg-gradient-to-r from-amber-600 to-rose-600 text-white" : "border-amber-600 text-amber-700 hover:bg-amber-50"}
      >
        All
      </Button>
      {(occasions[gender] || []).map(occasion => (
        <Button
          key={occasion}
          onClick={() => handleSelect(occasion)}
          variant={selectedOccasion === occasion ? "default" : "outline"}
          className={selectedOccasion === occasion ? "bg-gradient-to-r from-amber-600 to-rose-600 text-white" : "border-amber-600 text-amber-700 hover:bg-amber-50"}
        >
          {occasion}
        </Button>
      ))}
    </div>
  );
};

const MarketplacePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [gender, setGender] = useState('women');
  const [occasion, setOccasion] = useState('All');
  const { toast } = useToast();
  const { addToCart } = useCart();
  // Filters and pagination
  const [brand, setBrand] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceBuckets, setPriceBuckets] = useState([]); // array of keys
  const [sort, setSort] = useState('');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const genderParam = params.get('gender') || 'women';
    const occParam = params.get('occasion') || 'All';
    const brandParam = params.get('brand') || '';
    const brandsParam = params.get('brands') || '';
    const minParam = params.get('priceMin') || '';
    const maxParam = params.get('priceMax') || '';
    const catsParam = params.get('categories') || '';
    const bucketsParam = params.get('priceBuckets') || '';
    const sortParam = params.get('sort') || '';
    setGender(genderParam);
    setOccasion(occParam);
    setBrand(brandParam);
    setPriceMin(minParam);
    setPriceMax(maxParam);
    setSelectedBrands(brandsParam ? brandsParam.split(',').filter(Boolean) : []);
    setSelectedCategories(catsParam ? catsParam.split(',').filter(Boolean) : []);
    setPriceBuckets(bucketsParam ? bucketsParam.split(',').filter(Boolean) : []);
    setSort(sortParam);
  }, [location.search]);

  // Fetch brand list from backend (filtered by gender)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/brands?gender=${encodeURIComponent(gender)}`);
        if (res.ok) {
          const data = await res.json();
          setBrands(Array.isArray(data) ? data : []);
        }
      } catch {
        setBrands([]);
      }
    })();
  }, [gender]);

  // Fetch categories list from backend (filtered by gender)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/categories?gender=${encodeURIComponent(gender)}`);
        if (res.ok) {
          const data = await res.json();
          setCategories(Array.isArray(data) ? data : []);
        }
      } catch {
        setCategories([]);
      }
    })();
  }, [gender]);

  // Reset pagination when filters change
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, [gender, occasion, brand, priceMin, priceMax, selectedBrands.join(','), selectedCategories.join(','), priceBuckets.join(','), sort]);

  // Persist filters to URL for shareable links
  const persistToUrl = useCallback(() => {
    const params = new URLSearchParams();
    params.set('gender', gender);
    if (occasion && occasion !== 'All') params.set('occasion', occasion);
    if (brand) params.set('brand', brand);
    if (selectedBrands.length) params.set('brands', selectedBrands.join(','));
    if (selectedCategories.length) params.set('categories', selectedCategories.join(','));
    if (priceMin) params.set('priceMin', String(priceMin));
    if (priceMax) params.set('priceMax', String(priceMax));
    if (priceBuckets.length) params.set('priceBuckets', priceBuckets.join(','));
    if (sort) params.set('sort', sort);
    navigate({ pathname: '/marketplace', search: `?${params.toString()}` }, { replace: true });
  }, [brand, gender, navigate, occasion, priceMax, priceMin, selectedBrands, selectedCategories, priceBuckets, sort]);

  const fetchPage = useCallback(async () => {
    if (loading || !hasMore) return;
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('gender', gender);
      params.set('page', String(page));
      params.set('pageSize', String(pageSize));
      if (brand) params.set('brand', brand);
      if (selectedBrands.length) params.set('brands', selectedBrands.join(','));
      if (selectedCategories.length) params.set('categories', selectedCategories.join(','));
      if (sort) params.set('sort', sort);
      if (priceMin) params.set('priceMin', String(priceMin));
      if (priceMax) params.set('priceMax', String(priceMax));
      const res = await fetch(`/api/products?${params.toString()}`);
      let data = [];
      if (res.ok) {
        data = await res.json();
      }
      // Map to lightweight shape for this page
      const mapped = (data || []).map(p => ({
        id: p.productId || p.id || p.slug || Math.random().toString(36).slice(2),
        name: p.name,
        category: p.subcategory || p.category || 'Ethnic Wear',
        image: (Array.isArray(p.images) && p.images[0]) || p.thumbnail || '/images/placeholder.png',
        price: p.price || 0,
        brand: p.brand || '',
      }));
      // If backend empty, fallback to local JSON for initial page only
      const incoming = mapped.length === 0 && page === 1 ? allProducts : mapped;
      // Apply client-side occasion filter
      const occasionMapping = {
        'Wedding': ['Wedding Wear', 'Bridal Wear'],
        'Festive': ['Festive Wear'],
        'Party': ['Party Wear'],
        'Casual': ['Casual Wear'],
        'Ceremony': ['Traditional Wear', 'Formal Wear', 'Contemporary Wear']
      };
      const filtered = incoming.filter(prod => {
        if (occasion === 'All') return true;
        const cats = occasionMapping[occasion] || [];
        return cats.includes(prod.category);
      });
      setItems(prev => [...prev, ...filtered]);
      setHasMore(incoming.length >= pageSize);
    } catch (e) {
      // On error, fallback to local JSON for first page
      if (page === 1) {
        setItems(allProducts);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  }, [brand, gender, hasMore, loading, occasion, page, pageSize]);

  // Initial and subsequent page fetch
  useEffect(() => {
    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Infinite scroll observer
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(p => p + 1);
      }
    }, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loading]);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const getGenderSpecificProductIds = (gender) => {
    if (gender === 'men') {
      // Assumed product IDs for men
      return [102, 104, 108, 109, 112];
    }
    if (gender === 'women') {
      // Assumed all other products are for women
      const menIds = [102, 104, 108, 109, 112];
      return allProducts.map(p => p.id).filter(id => !menIds.includes(id));
    }
    // Kids always render using provided dataset ids
    if (gender === 'kids') return [201, 202, 203];
    return [];
  };

  const genderProductIds = getGenderSpecificProductIds(gender);

  const filteredProducts = allProducts.filter(product => {
    const matchesGender = genderProductIds.includes(product.id);

    const occasionMapping = {
      'Wedding': ['Wedding Wear', 'Bridal Wear'],
      'Festive': ['Festive Wear'],
      'Party': ['Party Wear'],
      'Casual': ['Casual Wear'],
      'Ceremony': ['Traditional Wear', 'Formal Wear', 'Contemporary Wear']
    };
    
    const matchesOccasion = occasion === 'All' || (occasionMapping[occasion] && occasionMapping[occasion].includes(product.category));
    
    return matchesGender && matchesOccasion;
  });

  // displayedProducts prefer backend (items) then fallback to local filtered
  const displayedProducts = items.length ? items : filteredProducts;

  return (
    <>
      <Helmet>
        <title>Marketplace - {gender.charAt(0).toUpperCase() + gender.slice(1)}'s Collection | Pehenava</title>
        <meta name="description" content={`Discover premium ethnic wear for ${gender}. Shop for all occasions at Pehenava marketplace.`} />
      </Helmet>

      <div className="pt-24 min-h-screen">
        <section className="bg-gradient-to-r from-amber-50 to-rose-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-playfair font-bold gradient-text mb-6">
                {gender.charAt(0).toUpperCase() + gender.slice(1)}'s Collection
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover exquisite ethnic wear for every occasion.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-8 bg-white/50 sticky top-24 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <OccasionFilter gender={gender} onFilterChange={setOccasion} />
            <div className="flex flex-wrap gap-4 items-start">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Brand</label>
                <div className="max-h-40 overflow-auto border rounded p-2 w-60">
                  <label className="flex items-center gap-2 mb-1">
                    <input type="checkbox" checked={brand === '' && selectedBrands.length === 0} onChange={()=>{ setBrand(''); setSelectedBrands([]); }} />
                    <span>All</span>
                  </label>
                  {brands.map(b => (
                    <label key={b} className="flex items-center gap-2 mb-1">
                      <input type="checkbox" checked={selectedBrands.includes(b)} onChange={(e)=>{
                        setBrand('');
                        setSelectedBrands(prev => e.target.checked ? [...prev, b] : prev.filter(x=>x!==b));
                      }} />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                <input type="number" value={priceMin} onChange={e=>setPriceMin(e.target.value)} className="border rounded px-3 py-2 w-32" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                <input type="number" value={priceMax} onChange={e=>setPriceMax(e.target.value)} className="border rounded px-3 py-2 w-32" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Price Ranges</label>
                <div className="border rounded p-2 w-60">
                  {[
                    { key: '0-3000', label: 'Under ₹3,000', min: 0, max: 3000 },
                    { key: '3000-10000', label: '₹3,000 - ₹10,000', min: 3000, max: 10000 },
                    { key: '10000-25000', label: '₹10,000 - ₹25,000', min: 10000, max: 25000 },
                    { key: '25000+', label: 'Over ₹25,000', min: 25000, max: null },
                  ].map(r => (
                    <label key={r.key} className="flex items-center gap-2 mb-1">
                      <input type="checkbox" checked={priceBuckets.includes(r.key)} onChange={(e)=>{
                        setPriceBuckets(prev => e.target.checked ? [...prev, r.key] : prev.filter(x=>x!==r.key));
                        // Derive min/max from selected buckets
                        setTimeout(()=>{
                          const selected = (e.target.checked ? [...priceBuckets, r.key] : priceBuckets.filter(x=>x!==r.key));
                          const ranges = selected.map(k=>{
                            if (k==='0-3000') return {min:0,max:3000};
                            if (k==='3000-10000') return {min:3000,max:10000};
                            if (k==='10000-25000') return {min:10000,max:25000};
                            if (k==='25000+') return {min:25000,max:null};
                            return {};
                          });
                          const mins = ranges.map(x=>x.min).filter(x=>x!=null);
                          const maxs = ranges.map(x=>x.max).filter(x=>x!=null);
                          setPriceMin(mins.length? Math.min(...mins): '');
                          setPriceMax(maxs.length? Math.max(...maxs): '');
                        },0);
                      }} />
                      <span>{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Categories</label>
                <div className="max-h-40 overflow-auto border rounded p-2 w-60">
                  <label className="flex items-center gap-2 mb-1">
                    <input type="checkbox" checked={selectedCategories.length===0} onChange={()=> setSelectedCategories([])} />
                    <span>All</span>
                  </label>
                  {categories.map(c => (
                    <label key={c} className="flex items-center gap-2 mb-1">
                      <input type="checkbox" checked={selectedCategories.includes(c)} onChange={(e)=>{
                        setSelectedCategories(prev => e.target.checked ? [...prev, c] : prev.filter(x=>x!==c));
                      }} />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Sort</label>
                <select value={sort} onChange={e=>setSort(e.target.value)} className="border rounded px-3 py-2">
                  <option value="">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Rating</option>
                </select>
              </div>
              <Button variant="outline" onClick={()=>{ persistToUrl(); setItems([]); setPage(1); setHasMore(true); }}>Apply</Button>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="royal-card rounded-2xl overflow-hidden cursor-pointer group"
                >
                  <div className="relative aspect-[4/5] bg-gradient-to-br from-amber-100 to-rose-100">
                    <img 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      src={product.image} />
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="sm" variant="ghost" className="bg-white/90 hover:bg-white text-gray-700 rounded-full p-2" onClick={(e) => { e.stopPropagation(); toast({ title: 'Coming Soon!' }) }}>
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="bg-white/90 hover:bg-white text-gray-700 rounded-full p-2" onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}>
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold font-playfair text-gray-800 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-amber-600">₹{product.price}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-amber-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">4.9</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {displayedProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-gray-500">No products found for this selection.</p>
                 <p className="text-md text-gray-400">I've populated the store with a variety of kurtas, but the current product data doesn't include items for kids. I can add them if you provide the details!</p>
              </div>
            )}
            <div ref={sentinelRef} className="h-10"></div>
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-64 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default MarketplacePage;
