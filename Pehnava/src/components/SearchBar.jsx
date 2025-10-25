import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Filter,
  Mic,
  Camera,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

const SearchBar = ({
  onSearch,
  onFilterClick,
  placeholder = "Search for products, brands and more",
  showFilters = true,
  showVoiceSearch = true,
  showImageSearch = true,
  recentSearches = [],
  trendingSearches = [],
  suggestions = [],
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Handle search submission
  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setShowSuggestions(false);
      setIsFocused(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedSuggestion(-1);
    setShowSuggestions(value.length > 0 || recentSearches.length > 0);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedSuggestion >= 0 && suggestions.length > 0) {
        const selectedQuery = suggestions[selectedSuggestion];
        setQuery(selectedQuery);
        handleSearch(selectedQuery);
      } else {
        handleSearch();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestion((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestion((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setIsFocused(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  // Handle recent search click
  const handleRecentSearchClick = (search) => {
    setQuery(search);
    handleSearch(search);
  };

  // Handle trending search click
  const handleTrendingSearchClick = (search) => {
    setQuery(search);
    handleSearch(search);
  };

  // Clear search
  const clearSearch = () => {
    setQuery("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Voice search
  const startVoiceSearch = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        handleSearch(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Voice search is not supported in this browser");
    }
  };

  // Image search
  const handleImageSearch = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Here you would typically send the image to your backend for processing
        // For now, we'll just show a placeholder
        console.log("Image search:", file);
        // You could implement image-to-text conversion or reverse image search here
      }
    };
    input.click();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={suggestionsRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search className="h-5 w-5" />
        </div>

        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          placeholder={placeholder}
          className="pl-10 pr-20 h-12 text-base"
        />

        {/* Action Buttons */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {showVoiceSearch && (
            <Button
              variant="ghost"
              size="sm"
              onClick={startVoiceSearch}
              disabled={isListening}
              className={`h-8 w-8 p-0 hover:bg-gray-100 ${
                isListening ? "bg-red-100 text-red-600" : ""
              }`}
            >
              <Mic className="h-4 w-4" />
            </Button>
          )}

          {showImageSearch && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleImageSearch}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <Camera className="h-4 w-4" />
            </Button>
          )}

          {showFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onFilterClick}
              className="h-8 px-3 text-sm"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (isFocused || query) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                {/* Search Suggestions */}
                {query && suggestions.length > 0 && (
                  <div className="p-3 border-b border-gray-100">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Suggestions
                    </div>
                    <div className="space-y-1">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-50 flex items-center ${
                            selectedSuggestion === index
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-700"
                          }`}
                        >
                          <Search className="h-4 w-4 mr-2 text-gray-400" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Searches */}
                {!query && recentSearches.length > 0 && (
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Recent Searches
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-500 hover:text-gray-700"
                        onClick={() => {
                          // Clear recent searches - you'd implement this
                          console.log("Clear recent searches");
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleRecentSearchClick(search)}
                          className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-50 flex items-center text-gray-700"
                        >
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches */}
                {!query && trendingSearches.length > 0 && (
                  <div className="p-3">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Trending Searches
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((search, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 transition-colors"
                          onClick={() => handleTrendingSearchClick(search)}
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {search}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {query && suggestions.length === 0 && (
                  <div className="p-6 text-center">
                    <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">
                      No suggestions found for "{query}"
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
