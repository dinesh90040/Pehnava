
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Camera, Upload, Star, Users, Award, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ModelApplicationPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    height: '',
    experience: '',
    location: '',
    portfolio: '',
    availability: '',
    specialization: [],
    bust: '',
    waist: '',
    hips: '',
    instagram: '',
    facebook: '',
    photos: []
  });

  const [errors, setErrors] = useState({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validation
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number format';
    
    // Age validation
    const age = parseInt(formData.age);
    if (!age) newErrors.age = 'Age is required';
    if (age < 18 || age > 50) newErrors.age = 'Age must be between 18 and 50';

    // Height validation
    const height = parseInt(formData.height);
    if (!height) newErrors.height = 'Height is required';
    if (height < 150 || height > 200) newErrors.height = 'Height must be between 150cm and 200cm';

    // Measurements validation (optional but must be numbers if provided)
    if (formData.bust && !/^\d+$/.test(formData.bust)) newErrors.bust = 'Bust measurement must be a number';
    if (formData.waist && !/^\d+$/.test(formData.waist)) newErrors.waist = 'Waist measurement must be a number';
    if (formData.hips && !/^\d+$/.test(formData.hips)) newErrors.hips = 'Hips measurement must be a number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecializationChange = (specialization) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.includes(specialization)
        ? prev.specialization.filter(s => s !== specialization)
        : [...prev.specialization, specialization]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real application, you would send this data to your backend
      console.log('Form data:', formData);
      
      toast({
        title: "Application Submitted Successfully!",
        description: "Thank you for applying! We will review your application and contact you soon.",
        variant: "success"
      });

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        height: '',
        experience: '',
        location: '',
        portfolio: '',
        availability: '',
        specialization: [],
        bust: '',
        waist: '',
        hips: '',
        instagram: '',
        facebook: '',
        photos: []
      });
    } else {
      toast({
        title: "Please check your form",
        description: "Some fields need your attention",
        variant: "destructive"
      });
    }
  };

  const handleFeatureClick = (feature) => {
    toast({
      title: `🚧 ${feature} Coming Soon!`,
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const specializations = [
    'Traditional Sarees',
    'Bridal Wear',
    'Festive Outfits',
    'Contemporary Ethnic',
    'Jewelry Modeling',
    'Plus Size Modeling'
  ];

  const benefits = [
    {
      icon: Star,
      title: "Premium Rates",
      description: "Competitive compensation for all modeling assignments"
    },
    {
      icon: Camera,
      title: "Professional Shoots",
      description: "Work with top photographers and creative teams"
    },
    {
      icon: Users,
      title: "Community",
      description: "Join a supportive community of fashion models"
    },
    {
      icon: Award,
      title: "Recognition",
      description: "Build your portfolio with prestigious brand collaborations"
    }
  ];

  const currentModels = [
    {
      name: "Priya Sharma",
      specialization: "Bridal Wear",
      experience: "3 years",
      image: "Professional model in traditional bridal lehenga"
    },
    {
      name: "Ananya Patel",
      specialization: "Contemporary Ethnic",
      experience: "2 years",
      image: "Model in modern ethnic wear with traditional elements"
    },
    {
      name: "Kavya Reddy",
      specialization: "Traditional Sarees",
      experience: "4 years",
      image: "Elegant model in traditional silk saree"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Apply as Model - Join Pehenava Fashion Community</title>
        <meta name="description" content="Join Pehenava's exclusive modeling community. Apply to showcase premium ethnic wear and work with top designers and photographers." />
      </Helmet>

      <div className="pt-20 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-rose-50 via-amber-50 to-purple-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-6xl font-playfair font-bold gradient-text mb-6">
                Become a Pehenava Model
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Join our exclusive community of fashion models and showcase the finest ethnic wear collections. Be part of the future of fashion.
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Professional Portfolio</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Premium Compensation</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Flexible Schedule</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-playfair font-bold gradient-text mb-6">
                Why Join Pehenava?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the benefits of working with India's premier ethnic fashion platform.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="royal-card p-8 rounded-2xl text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 flex items-center justify-center">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold font-playfair mb-4 text-gray-800">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Current Models */}
        <section className="py-20 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-playfair font-bold gradient-text mb-6">
                Meet Our Models
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join our talented community of models who represent the best of ethnic fashion.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {currentModels.map((model, index) => (
                <motion.div
                  key={model.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="royal-card rounded-2xl overflow-hidden"
                >
                  <div className="aspect-[4/5] bg-gradient-to-br from-rose-100 to-amber-100">
                    <img  
                      alt={model.name}
                      className="w-full h-full object-cover"
                     src="https://images.unsplash.com/photo-1484978856769-8516cf266385" />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-semibold font-playfair mb-2 text-gray-800">
                      {model.name}
                    </h3>
                    <p className="text-amber-600 font-medium mb-1">{model.specialization}</p>
                    <p className="text-gray-500 text-sm">{model.experience} experience</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-playfair font-bold gradient-text mb-6">
                Apply Now
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Fill out the application form below and take the first step towards joining our modeling community.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="royal-card p-8 rounded-2xl"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                      min="18"
                      max="50"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="Enter your age"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (in cm) *
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      required
                      min="150"
                      max="200"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="Enter your height"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="City, State"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modeling Experience
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select your experience level</option>
                    <option value="beginner">Beginner (0-1 years)</option>
                    <option value="intermediate">Intermediate (1-3 years)</option>
                    <option value="experienced">Experienced (3+ years)</option>
                    <option value="professional">Professional (5+ years)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Specialization (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {specializations.map((spec) => (
                      <label key={spec} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.specialization.includes(spec)}
                          onChange={() => handleSpecializationChange(spec)}
                          className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="text-sm text-gray-700">{spec}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="https://your-portfolio.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bust (cm)
                    </label>
                    <input
                      type="number"
                      name="bust"
                      value={formData.bust}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="Enter measurement"
                    />
                    {errors.bust && <p className="text-red-500 text-xs mt-1">{errors.bust}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waist (cm)
                    </label>
                    <input
                      type="number"
                      name="waist"
                      value={formData.waist}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="Enter measurement"
                    />
                    {errors.waist && <p className="text-red-500 text-xs mt-1">{errors.waist}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hips (cm)
                    </label>
                    <input
                      type="number"
                      name="hips"
                      value={formData.hips}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="Enter measurement"
                    />
                    {errors.hips && <p className="text-red-500 text-xs mt-1">{errors.hips}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram Profile (Optional)
                    </label>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="@yourusername"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook Profile (Optional)
                    </label>
                    <input
                      type="text"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="facebook.com/yourusername"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <textarea
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Tell us about your availability for shoots (weekdays, weekends, specific times, etc.)"
                  />
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Upload your photos</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Please upload 3-5 recent photos including headshots and full-body shots
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="photo-upload"
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        if (files.length > 5) {
                          toast({
                            title: "Too many files",
                            description: "Please select a maximum of 5 photos",
                            variant: "destructive"
                          });
                          return;
                        }
                        setFormData(prev => ({
                          ...prev,
                          photos: files
                        }));
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => document.getElementById('photo-upload').click()}
                      variant="outline"
                      className="border-amber-600 text-amber-700 hover:bg-amber-50"
                    >
                      Choose Files
                    </Button>
                  </div>
                  
                  {formData.photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {Array.from(formData.photos).map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Upload preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                photos: prev.photos.filter((_, i) => i !== index)
                              }));
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    Submit Application
                  </Button>
                  <p className="text-sm text-gray-500 mt-4">
                    We'll review your application and get back to you within 3-5 business days.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ModelApplicationPage;
