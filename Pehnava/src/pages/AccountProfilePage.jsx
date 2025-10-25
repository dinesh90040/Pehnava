import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Save,
  Edit,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const AccountProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    dateOfBirth: "1990-05-15",
    gender: "Male",
    address: {
      street: "123 MG Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India",
    },
    preferences: {
      newsletter: true,
      smsNotifications: false,
      emailNotifications: true,
      orderUpdates: true,
      promotionalOffers: true,
    },
  });

  const [editData, setEditData] = useState({ ...profileData });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setEditData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setEditData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setProfileData({ ...editData });
      setIsEditing(false);
      setIsLoading(false);
      toast({
        title: "Profile Updated! ✅",
        description: "Your profile has been successfully updated.",
      });
    }, 1500);
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const handleImageUpload = () => {
    toast({
      title: "Image Upload",
      description: "Profile picture upload feature coming soon!",
    });
  };

  return (
    <>
      <Helmet>
        <title>Profile Settings | Pehenava</title>
        <meta name="description" content="Manage your profile settings" />
      </Helmet>

      <div className="pt-24 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate("/account")}
              className="flex items-center text-gray-600 hover:text-amber-600 transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Account
            </button>
            <div>
              <h1 className="text-3xl font-playfair font-bold text-gray-800">
                Profile Settings
              </h1>
              <p className="text-gray-600">
                Manage your personal information and preferences
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 bg-gradient-to-br from-amber-400 to-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-16 w-16 text-white" />
                    </div>
                    <button
                      onClick={handleImageUpload}
                      className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                    >
                      <Camera className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>

                  <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    {isEditing
                      ? editData.firstName + " " + editData.lastName
                      : profileData.firstName + " " + profileData.lastName}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {isEditing ? editData.email : profileData.email}
                  </p>

                  <Button
                    onClick={handleImageUpload}
                    variant="outline"
                    className="w-full border-amber-600 text-amber-600 hover:bg-amber-50"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Personal Information
                  </h3>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="border-amber-600 text-amber-600 hover:bg-amber-50"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="border-gray-300 text-gray-600 hover:bg-gray-50"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  )}
                </div>

                <form className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="firstName"
                          value={
                            isEditing
                              ? editData.firstName
                              : profileData.firstName
                          }
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="lastName"
                          value={
                            isEditing ? editData.lastName : profileData.lastName
                          }
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={isEditing ? editData.email : profileData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={isEditing ? editData.phone : profileData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Date of Birth and Gender */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={
                            isEditing
                              ? editData.dateOfBirth
                              : profileData.dateOfBirth
                          }
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={isEditing ? editData.gender : profileData.gender}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">
                          Prefer not to say
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-amber-600" />
                      Address Information
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          name="address.street"
                          value={
                            isEditing
                              ? editData.address.street
                              : profileData.address.street
                          }
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            name="address.city"
                            value={
                              isEditing
                                ? editData.address.city
                                : profileData.address.city
                            }
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            name="address.state"
                            value={
                              isEditing
                                ? editData.address.state
                                : profileData.address.state
                            }
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pincode
                          </label>
                          <input
                            type="text"
                            name="address.pincode"
                            value={
                              isEditing
                                ? editData.address.pincode
                                : profileData.address.pincode
                            }
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      Notification Preferences
                    </h4>

                    <div className="space-y-4">
                      {Object.entries(
                        isEditing
                          ? editData.preferences
                          : profileData.preferences
                      ).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <h5 className="font-medium text-gray-800 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {key === "newsletter" &&
                                "Receive our newsletter with latest updates"}
                              {key === "smsNotifications" &&
                                "Get SMS notifications for important updates"}
                              {key === "emailNotifications" &&
                                "Receive email notifications"}
                              {key === "orderUpdates" &&
                                "Get updates about your orders"}
                              {key === "promotionalOffers" &&
                                "Receive promotional offers and discounts"}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name={`preferences.${key}`}
                              checked={value}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600 disabled:opacity-50"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountProfilePage;
