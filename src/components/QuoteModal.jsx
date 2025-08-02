import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";
import { createQuote } from "../services/quote";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const QuoteModal = ({ isOpen, setIsOpen }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    city: "",
    selectedProducts: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const products = ["Bitumen", "Gabion", "Construct"];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleProductChange = (product) => {
    setFormData((prev) => {
      const selectedProducts = prev.selectedProducts.includes(product)
        ? prev.selectedProducts.filter((p) => p !== product)
        : [...prev.selectedProducts, product];
      return { ...prev, selectedProducts };
    });
    setErrors((prev) => ({ ...prev, selectedProducts: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName || formData.customerName.length < 3) {
      newErrors.customerName =
        "Full name is required and must be at least 3 characters";
    }
    if (
      !formData.customerEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)
    ) {
      newErrors.customerEmail = "A valid email address is required";
    }
    if (
      !formData.customerPhone ||
      !/^\+91\d{10}$/.test(formData.customerPhone)
    ) {
      newErrors.customerPhone =
        "Phone number must be in the format +91 followed by 10 digits";
    }
    if (!formData.city || formData.city.length < 3) {
      newErrors.city = "City is required and must be at least 3 characters";
    }
    if (formData.selectedProducts.length === 0) {
      newErrors.selectedProducts = "At least one product must be selected";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setSuccess("");
    setError("");
    setShowSuccess(false);

    try {
      const payload = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        city: formData.city,
        selectedProducts: formData.selectedProducts,
      };
      await createQuote(payload);
      setSuccess(
        "Quote request submitted successfully! Our team will respond within 24 hours."
      );
      setShowSuccess(true);

      // Prepare WhatsApp message
      const message = `New Quote Request:\n\nName: ${
        formData.customerName
      }\nEmail: ${formData.customerEmail}\nPhone: ${
        formData.customerPhone
      }\nCity: ${formData.city}\nProducts: ${formData.selectedProducts.join(
        ", "
      )}`;
      const whatsappUrl = `https://wa.me/9528355555?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");

      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        city: "",
        selectedProducts: [],
      });
      setTimeout(() => setIsOpen(false), 3000); // Close modal after success
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "Failed to submit quote request");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-egyptian-blue text-h2 font-display">
            Request a Quote
          </DialogTitle>
        </DialogHeader>
        <Card className="border-none shadow-none">
          <CardContent className="p-6 space-y-6 bg-gray-50 rounded-b-lg">
            {showSuccess && (
              <div
                className="flex items-center p-4 bg-green-100 border border-green-400 rounded-lg text-green-800 shadow-md transition-opacity duration-500 ease-in-out"
                style={{ opacity: showSuccess ? 1 : 0 }}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">{success}</span>
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="customerName" className="text-sm font-medium">
                  Full Name *
                </Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  disabled={loading}
                  className="w-full"
                />
                {errors.customerName && (
                  <p className="text-red-600 text-sm">{errors.customerName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail" className="text-sm font-medium">
                  Email Address *
                </Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  placeholder="your.email@company.com"
                  disabled={loading}
                  className="w-full"
                />
                {errors.customerEmail && (
                  <p className="text-red-600 text-sm">{errors.customerEmail}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone" className="text-sm font-medium">
                  Phone Number *
                </Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  placeholder="+91 9528355555"
                  disabled={loading}
                  className="w-full"
                />
                {errors.customerPhone && (
                  <p className="text-red-600 text-sm">{errors.customerPhone}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">
                  City/Site Location *
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City, State"
                  disabled={loading}
                  className="w-full"
                />
                {errors.city && (
                  <p className="text-red-600 text-sm">{errors.city}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Project Details & Requirements *
                </Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {products.map((product) => (
                    <Badge
                      key={product}
                      variant="outline"
                      className={`cursor-pointer ${
                        formData.selectedProducts.includes(product)
                          ? "bg-egyptian-blue text-white"
                          : "hover:bg-egyptian-blue hover:text-white"
                      }`}
                      onClick={() => handleProductChange(product)}
                      disabled={loading}
                    >
                      {product}
                    </Badge>
                  ))}
                </div>
                {errors.selectedProducts && (
                  <p className="text-red-600 text-sm">
                    {errors.selectedProducts}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="cta"
                  size="xl"
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Quote Request"}
                </Button>
              </DialogFooter>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteModal;
