import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Edit,
  Trash2,
  ArrowLeft,
  Filter,
  SortAsc,
  Image as ImageIcon,
  Send,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Rating } from "@/components/ui/rating";
import { LoadingSpinner, LoadingSkeleton } from "@/components/ui/loading";
import { useToast } from "@/components/ui/use-toast";

const ReviewPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: "",
    comment: "",
    images: [],
  });

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
      fetchReviews();
    }
  }, [productId, filter, sort, page]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/id/${productId}`
      );
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        rating: filter !== "all" ? filter : "",
        sort,
      });

      const response = await fetch(
        `http://localhost:5000/api/reviews/product/${productId}?${params}`
      );
      if (response.ok) {
        const data = await response.json();
        if (page === 1) {
          setReviews(data.reviews);
        } else {
          setReviews((prev) => [...prev, ...data.reviews]);
        }
        setHasMore(data.pagination.page < data.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Error",
        description: "Failed to fetch reviews. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (reviewForm.rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating for your review.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "user-001", // TODO: Get from auth context
          productId,
          orderId: "ORD-123456", // TODO: Get from order context
          rating: reviewForm.rating,
          title: reviewForm.title,
          comment: reviewForm.comment,
          images: reviewForm.images,
        }),
      });

      if (response.ok) {
        toast({
          title: "Review Submitted",
          description: "Your review has been submitted successfully.",
        });
        setReviewForm({ rating: 0, title: "", comment: "", images: [] });
        setShowReviewForm(false);
        fetchReviews(); // Refresh reviews
      } else {
        throw new Error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId, isHelpful) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/reviews/${reviewId}/helpful`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: "user-001", // TODO: Get from auth context
            isHelpful,
          }),
        }
      );

      if (response.ok) {
        // Update local state
        setReviews((prev) =>
          prev.map((review) =>
            review.reviewId === reviewId
              ? {
                  ...review,
                  isHelpful: review.isHelpful + (isHelpful ? 1 : -1),
                }
              : review
          )
        );
      }
    } catch (error) {
      console.error("Error updating helpful status:", error);
    }
  };

  const handleReport = async (reviewId, reason) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/reviews/${reviewId}/report`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason }),
        }
      );

      if (response.ok) {
        toast({
          title: "Review Reported",
          description: "Thank you for your feedback. We'll review this report.",
        });
      }
    } catch (error) {
      console.error("Error reporting review:", error);
    }
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Product Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                The product you're looking for doesn't exist.
              </p>
              <Button onClick={() => navigate("/marketplace")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Marketplace
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const ratingDistribution = getRatingDistribution();
  const averageRating = getAverageRating();

  return (
    <>
      <Helmet>
        <title>Reviews for {product.name} - Pehenava</title>
        <meta
          name="description"
          content={`Read reviews and ratings for ${product.name}`}
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(`/product/${productId}`)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Product
            </Button>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Product Reviews
                </h1>
                <p className="text-gray-600 mt-1">{product.name}</p>
              </div>

              <Button
                onClick={() => setShowReviewForm(true)}
                className="mt-4 lg:mt-0"
              >
                Write a Review
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Rating Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Rating Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {averageRating.toFixed(1)}
                    </div>
                    <Rating
                      rating={averageRating}
                      size="lg"
                      showValue={false}
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      Based on {reviews.length} reviews
                    </p>
                  </div>

                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-sm w-8">{rating}</span>
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{
                              width: `${
                                reviews.length > 0
                                  ? (ratingDistribution[rating] /
                                      reviews.length) *
                                    100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">
                          {ratingDistribution[rating]}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reviews */}
            <div className="lg:col-span-3">
              {/* Filters and Sort */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filter by Rating
                      </label>
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="all">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sort by
                      </label>
                      <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="highest">Highest Rating</option>
                        <option value="lowest">Lowest Rating</option>
                        <option value="helpful">Most Helpful</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.reviewId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                              <span className="text-pink-600 font-medium">
                                {review.user?.name?.charAt(0) || "U"}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {review.user?.name || "Anonymous"}
                              </p>
                              <div className="flex items-center gap-2">
                                <Rating rating={review.rating} size="sm" />
                                <span className="text-sm text-gray-500">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </span>
                                {review.isVerified && (
                                  <Badge variant="success" className="text-xs">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleHelpful(review.reviewId, true)
                              }
                            >
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              {review.isHelpful}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleReport(
                                  review.reviewId,
                                  "Inappropriate content"
                                )
                              }
                            >
                              <Flag className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {review.title && (
                          <h3 className="font-medium text-gray-900 mb-2">
                            {review.title}
                          </h3>
                        )}

                        <p className="text-gray-700 mb-4">{review.comment}</p>

                        {review.images && review.images.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                            {review.images.map((image, imgIndex) => (
                              <img
                                key={imgIndex}
                                src={image}
                                alt={`Review image ${imgIndex + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        )}

                        {review.response && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              Seller Response
                            </p>
                            <p className="text-sm text-gray-700">
                              {review.response.comment}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(
                                review.response.respondedAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {loading && page > 1 && (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <LoadingSkeleton key={index} lines={4} />
                    ))}
                  </div>
                )}

                {!loading && reviews.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-gray-600">
                        No reviews found for this product.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {hasMore && !loading && (
                  <div className="text-center">
                    <Button
                      variant="outline"
                      onClick={() => setPage((prev) => prev + 1)}
                    >
                      Load More Reviews
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Write a Review
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowReviewForm(false)}
                >
                  ×
                </Button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                  </label>
                  <Rating
                    rating={reviewForm.rating}
                    onRatingChange={(rating) =>
                      setReviewForm((prev) => ({ ...prev, rating }))
                    }
                    interactive={true}
                    size="lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Title
                  </label>
                  <Input
                    value={reviewForm.title}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Summarize your experience"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    placeholder="Tell others about your experience with this product"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting || reviewForm.rating === 0}
                  >
                    {submitting ? (
                      <LoadingSpinner size="sm" className="mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Submit Review
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ReviewPage;
