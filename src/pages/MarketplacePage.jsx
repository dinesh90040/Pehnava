import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Search, Filter, MapPin, Star, Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

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
  const [gender, setGender] = useState('women');
  const [occasion, setOccasion] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const genderParam = params.get('gender') || 'women';
    setGender(genderParam);
  }, [location.search]);

  const handleFeatureClick = (feature) => {
    toast({
      title: `🚧 ${feature} Coming Soon!`,
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const products = {
    women: [
      { id: 1, name: "Royal Silk Saree", price: "₹25,000", imageUrl: "https://images.unsplash.com/photo-1635865165118-917ed9e20936", occasion: "Wedding" },
      { id: 2, name: "Bridal Lehenga Set", price: "₹85,000", imageUrl: "https://images.unsplash.com/photo-1635865165118-917ed9e20936", occasion: "Wedding" },
      { id: 3, name: "Festive Anarkali Suit", price: "₹15,000", imageUrl: "https://images.unsplash.com/photo-1635865165118-917ed9e20936", occasion: "Festive" },
      { id: 4, name: "Designer Party Kurti", price: "₹3,500", imageUrl: "https://5.imimg.com/data5/HQ/AS/MY-37917758/reyon-double-layered-party-wear-kurti-1000x1000.jpg", occasion: "Party" },
      { id: 5, name: "Casual Cotton Saree", price: "₹2,500", imageUrl: "https://www.yuvistyle.com/cdn/shop/files/77c93dd6-db9b-492d-9180-f4cac2ea5f12_800x.jpg?v=1717243587", occasion: "Casual" },
    ],
    men: [
      { id: 6, name: "Embroidered Sherwani", price: "₹30,000", image: "A man wearing a grand embroidered sherwani", occasion: "Wedding" },
      { id: 7, name: "Silk Kurta Set", price: "₹8,000", image: "A man in an elegant silk kurta for a festive event", occasion: "Festive" },
      { id: 8, name: "Indo-Western Suit", price: "₹18,000", image: "A man in a stylish Indo-Western suit for a ceremony", occasion: "Ceremony" },
      { id: 9, name: "Linen Kurta", price: "₹4,000", image: "A man wearing a comfortable linen kurta for a casual day", occasion: "Casual" },
    ],
    kids: [
      { id: 10, name: "Boys Sherwani Set", price: "₹5,000", image: "A young boy in a cute sherwani for a wedding", occasion: "Wedding" },
      { id: 11, name: "Girls Lehenga Choli", price: "₹6,500", image: "A little girl twirling in a festive lehenga choli", occasion: "Festive" },
      { id: 12, name: "Birthday Princess Gown", price: "₹4,500", image: "A girl in a beautiful gown for her birthday party", occasion: "Birthday" },
      { id: 13, name: "Casual Kurta Pajama", price: "₹2,000", image: "A boy in a comfortable kurta pajama set for casual wear", occasion: "Casual" },
    ]
  };

  const filteredProducts = (products[gender] || []).filter(product => {
    const matchesOccasion = occasion === 'All' || product.occasion === occasion;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOccasion && matchesSearch;
  });

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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <OccasionFilter gender={gender} onFilterChange={setOccasion} />
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="royal-card rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => handleFeatureClick(product.name)}
                >
                  <div className="relative aspect-[4/5] bg-gradient-to-br from-amber-100 to-rose-100">
                    <img 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      src={product.imageUrl} />
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="sm" variant="ghost" className="bg-white/90 hover:bg-white text-gray-700 rounded-full p-2" onClick={(e) => { e.stopPropagation(); handleFeatureClick('Wishlist'); }}>
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="bg-white/90 hover:bg-white text-gray-700 rounded-full p-2" onClick={(e) => { e.stopPropagation(); handleFeatureClick('Quick Add to Cart'); }}>
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold font-playfair text-gray-800 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{product.occasion}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-amber-600">{product.price}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-amber-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">4.9</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-gray-500">No products found for this selection.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default MarketplacePage;