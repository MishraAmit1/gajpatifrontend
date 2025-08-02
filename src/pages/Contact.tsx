import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import LazyLoad from 'react-lazyload';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, MapPin, Phone, Mail, Clock, Shield, FileText, MessageSquare, Factory } from 'lucide-react';
import { createInquiry } from '../services/inquiry';
import { PopupButton } from 'react-calendly';
import { Link } from 'react-router-dom';

const Container = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const locations = [
  { name: 'Delhi Plant', lat: 28.4595, lng: 77.0266, location: 'Gurgaon, Haryana', phone: '+91 95283 55555' },
  { name: 'Mumbai Plant', lat: 19.0760, lng: 72.8777, location: 'Bhiwandi, Maharashtra', phone: '+91 95283 55555' },
  { name: 'Chennai Plant', lat: 12.9165, lng: 79.6566, location: 'Sriperumbudur, Tamil Nadu', phone: '+91 98765 43212' },
  { name: 'Pune Plant', lat: 18.5204, lng: 73.8567, location: 'Ranjangaon, Maharashtra', phone: '+91 98765 43213' },
  { name: 'Kolkata Center', lat: 22.5726, lng: 88.3639, location: 'Salt Lake, West Bengal', phone: '+91 98765 43214' },
];

const InteractiveMap = () => (
  <section className="py-0">
    <div className="w-full h-96">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14964.487569207819!2d72.92556826738284!3d20.33658255030062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0cfa73a797947%3A0xaa1cef7299a3ed78!2sCaP%20Multispeciality%20Dental%20Clinic%20%2C%20Vapi!5e0!3m2!1sen!2sin!4v1752569371144!5m2!1sen!2sin"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        title="Gajpati Industries Manufacturing Locations"
        aria-label="Map showing Gajpati Industries manufacturing locations across India"
      ></iframe>
    </div>
  </section>
);

const Contact = () => {
  const products = useMemo(() => ['Bitumen', 'Gabion', 'Construct'], []);
  const purposes = useMemo(() => ['Tender', 'Site Use', 'Resale', 'Other'], []);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    companyName: '',
    designation: '',
    city: '',
    purpose: '',
    selectedProducts: [],
    description: '',
    consent: false,
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: createInquiry,
    onSuccess: (data, variables) => {
      setShowSuccess(true);
      const message = `New Inquiry Submission:\n\nName: ${variables.customerName}\nEmail: ${variables.customerEmail}\nPhone: ${variables.customerPhone}\nCompany: ${variables.companyName}\nCity: ${variables.city}\nPurpose: ${variables.purpose}\nProducts: ${variables.selectedProducts.join(', ')}\nDescription: ${variables.description || 'N/A'}`;
      const whatsappUrl = `https://wa.me/9528355555?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        companyName: '',
        designation: '',
        city: '',
        purpose: '',
        selectedProducts: [],
        description: '',
        consent: false,
      });
      setTimeout(() => setShowSuccess(false), 5000);
    },
    onError: (err) => {
      setErrors({ submit: err.message || 'Failed to submit inquiry. Please try again.' });
    },
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: '' }));
  };

  const handleProductChange = (product) => {
    setFormData((prev) => {
      const selectedProducts = prev.selectedProducts.includes(product)
        ? prev.selectedProducts.filter((p) => p !== product)
        : [...prev.selectedProducts, product];
      return { ...prev, selectedProducts };
    });
    setErrors((prev) => ({ ...prev, selectedProducts: '' }));
  };

  const handleConsentChange = (checked) => {
    setFormData((prev) => ({ ...prev, consent: checked }));
    setErrors((prev) => ({ ...prev, consent: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName || formData.customerName.length < 3) {
      newErrors.customerName = 'Full name is required and must be at least 3 characters';
    }
    if (!formData.customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'A valid email address is required';
    }
    if (!formData.customerPhone || !/^\+?\d{10,12}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Phone number must be 10-12 digits, optionally starting with +';
    }
    if (!formData.companyName || formData.companyName.length < 3) {
      newErrors.companyName = 'Company name is required and must be at least 3 characters';
    }
    if (!formData.city || formData.city.length < 3) {
      newErrors.city = 'City is required and must be at least 3 characters';
    }
    if (!formData.purpose) {
      newErrors.purpose = 'Purpose of request is required';
    }
    if (formData.selectedProducts.length === 0) {
      newErrors.selectedProducts = 'At least one product must be selected';
    }
    if (!formData.consent) {
      newErrors.consent = 'You must consent to data processing';
    }
    if (formData.description.length > 0 && (formData.description.length < 3 || formData.description.length > 1000)) {
      newErrors.description = 'Description must be between 3 and 1000 characters';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Gajpati Industries - Get in Touch</title>
        <meta
          name="description"
          content="Connect with Gajpati Industries for project consultations, product specifications, and customized chemical solutions. Submit your inquiry or contact our experts today."
        />
        <meta
          name="keywords"
          content="contact Gajpati Industries, infrastructure chemicals, project inquiry, technical support, manufacturing locations"
        />
        <meta property="og:title" content="Contact Us | Gajpati Industries - Get in Touch" />
        <meta
          property="og:description"
          content="Connect with Gajpati Industries for project consultations, product specifications, and customized chemical solutions. Submit your inquiry or contact our experts today."
        />
        <meta property="og:image" content="https://yourdomain.com/images/contact-og.jpg" />
        <meta property="og:url" content="https://yourdomain.com/contact" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us | Gajpati Industries - Get in Touch" />
        <meta
          name="twitter:description"
          content="Connect with Gajpati Industries for project consultations, product specifications, and customized chemical solutions. Submit your inquiry or contact our experts today."
        />
        <meta name="twitter:image" content="https://yourdomain.com/images/contact-og.jpg" />
        <link rel="canonical" href="https://yourdomain.com/contact" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': 'Gajpati Industries Pvt. Ltd.',
            'url': 'https://yourdomain.com',
            'contactPoint': [
              {
                '@type': 'ContactPoint',
                'telephone': '+91 95283 55555',
                'contactType': 'Sales Hotline',
                'availableLanguage': ['English', 'Hindi'],
                'areaServed': 'IN',
              },
              {
                '@type': 'ContactPoint',
                'telephone': '+91 95283 55555',
                'contactType': 'Technical Support',
                'availableLanguage': ['English', 'Hindi'],
                'areaServed': 'IN',
              },
              {
                '@type': 'ContactPoint',
                'email': 'sales@gajpatiindustries.com',
                'contactType': 'Sales',
                'areaServed': 'IN',
              },
            ],
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': 'Near Power Grid, SIDCO IGC Phase III',
              'addressLocality': 'Samba',
              'addressRegion': 'Jammu',
              'postalCode': '184121',
              'addressCountry': 'IN',
            },
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://yourdomain.com' },
              { '@type': 'ListItem', 'position': 2, 'name': 'Contact', 'item': 'https://yourdomain.com/contact' },
            ],
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-background">
        <section className="bg-gradient-hero text-white py-16" aria-labelledby="contact-heading">
          <Container>
            <div className="text-center">
              <h1 id="contact-heading" className="font-display font-bold text-3xl sm:text-4xl lg:text-hero mb-3 sm:mb-4">
                Get in Touch
              </h1>
              <p className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl sm:max-w-3xl mx-auto">
                Connect with our technical experts for project consultations, product specifications,
                and customized chemical solutions
              </p>
            </div>
          </Container>
        </section>
        <section className="py-16 bg-white">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-egyptian-blue text-h2 font-display" id="inquiry-form-title">
                      Project Inquiry Form
                    </CardTitle>
                    <p className="text-gray-600">
                      Share your project details and our experts will respond within 24 hours
                    </p>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6 bg-gray-50 rounded-b-lg">
                    {showSuccess && (
                      <div
                        className="flex items-center p-4 bg-green-100 border border-green-400 rounded-lg text-green-800 shadow-md transition-opacity duration-500 ease-in-out"
                        style={{ opacity: showSuccess ? 1 : 0 }}
                      >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="text-sm font-medium">
                          Inquiry submitted successfully! Our team will respond within 24 hours.
                        </span>
                      </div>
                    )}
                    {errors.submit && (
                      <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{errors.submit}</AlertDescription>
                      </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6" aria-labelledby="inquiry-form-title">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <Label htmlFor="customerName" className="text-sm font-medium">
                            Full Name <span aria-hidden="true">*</span>
                          </Label>
                          <Input
                            id="customerName"
                            value={formData.customerName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            disabled={mutation.isLoading}
                            className="w-full"
                            aria-required="true"
                            aria-invalid={!!errors.customerName}
                            aria-describedby={errors.customerName ? 'customerName-error' : undefined}
                          />
                          {errors.customerName && (
                            <p id="customerName-error" className="text-red-600 text-sm">
                              {errors.customerName}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="designation" className="text-sm font-medium">
                            Designation
                          </Label>
                          <Input
                            id="designation"
                            value={formData.designation}
                            onChange={handleInputChange}
                            placeholder="e.g., Project Manager, Civil Engineer"
                            disabled={mutation.isLoading}
                            className="w-full"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <Label htmlFor="customerEmail" className="text-sm font-medium">
                            Email Address <span aria-hidden="true">*</span>
                          </Label>
                          <Input
                            id="customerEmail"
                            type="email"
                            value={formData.customerEmail}
                            onChange={handleInputChange}
                            placeholder="your.email@company.com"
                            disabled={mutation.isLoading}
                            className="w-full"
                            aria-required="true"
                            aria-invalid={!!errors.customerEmail}
                            aria-describedby={errors.customerEmail ? 'customerEmail-error' : undefined}
                          />
                          {errors.customerEmail && (
                            <p id="customerEmail-error" className="text-red-600 text-sm">
                              {errors.customerEmail}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customerPhone" className="text-sm font-medium">
                            Phone Number <span aria-hidden="true">*</span>
                          </Label>
                          <Input
                            id="customerPhone"
                            value={formData.customerPhone}
                            onChange={handleInputChange}
                            placeholder="e.g., +91 9528355555"
                            disabled={mutation.isLoading}
                            className="w-full"
                            aria-required="true"
                            aria-invalid={!!errors.customerPhone}
                            aria-describedby={errors.customerPhone ? 'customerPhone-error' : undefined}
                          />
                          {errors.customerPhone && (
                            <p id="customerPhone-error" className="text-red-600 text-sm">
                              {errors.customerPhone}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <Label htmlFor="companyName" className="text-sm font-medium">
                            Company/Organization <span aria-hidden="true">*</span>
                          </Label>
                          <Input
                            id="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            placeholder="Your company name"
                            disabled={mutation.isLoading}
                            className="w-full"
                            aria-required="true"
                            aria-invalid={!!errors.companyName}
                            aria-describedby={errors.companyName ? 'companyName-error' : undefined}
                          />
                          {errors.companyName && (
                            <p id="companyName-error" className="text-red-600 text-sm">
                              {errors.companyName}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-sm font-medium">
                            City/Site Location <span aria-hidden="true">*</span>
                          </Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="City, State"
                            disabled={mutation.isLoading}
                            className="w-full"
                            aria-required="true"
                            aria-invalid={!!errors.city}
                            aria-describedby={errors.city ? 'city-error' : undefined}
                          />
                          {errors.city && (
                            <p id="city-error" className="text-red-600 text-sm">{errors.city}</p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="purpose" className="text-sm font-medium">
                          Purpose of Request <span aria-hidden="true">*</span>
                        </Label>
                        <Select
                          value={formData.purpose}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, purpose: value }))}
                          disabled={mutation.isLoading}
                          aria-required="true"
                          aria-invalid={!!errors.purpose}
                          aria-describedby={errors.purpose ? 'purpose-error' : undefined}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select purpose" />
                          </SelectTrigger>
                          <SelectContent>
                            {purposes.map((p) => (
                              <SelectItem key={p} value={p}>
                                {p}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.purpose && (
                          <p id="purpose-error" className="text-red-600 text-sm">{errors.purpose}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Project Details & Requirements <span aria-hidden="true">*</span>
                        </Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {products.map((product) => (
                            <Badge
                              key={product}
                              variant="outline"
                              className={`cursor-pointer ${formData.selectedProducts.includes(product) ? 'bg-egyptian-blue text-white' : 'hover:bg-egyptian-blue hover:text-white'}`}
                              onClick={() => handleProductChange(product)}
                              disabled={mutation.isLoading}
                              aria-label={`Select ${product}`}
                            >
                              {product}
                            </Badge>
                          ))}
                        </div>
                        {errors.selectedProducts && (
                          <p id="selectedProducts-error" className="text-red-600 text-sm">
                            {errors.selectedProducts}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                          Description (Optional)
                        </Label>
                        <textarea
                          id="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Provide additional details about your inquiry (e.g., project scope, timeline, or specific requirements)"
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-egyptian-blue focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                          rows={4}
                          disabled={mutation.isLoading}
                          aria-describedby={errors.description ? 'description-error' : undefined}
                        />
                        {errors.description && (
                          <p id="description-error" className="text-red-600 text-sm">{errors.description}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="consent"
                            checked={formData.consent}
                            onCheckedChange={handleConsentChange}
                            disabled={mutation.isLoading}
                            aria-required="true"
                            aria-invalid={!!errors.consent}
                            aria-describedby={errors.consent ? 'consent-error' : undefined}
                          />
                          <Label htmlFor="consent" className="text-sm">
                            I consent to the processing of my personal data for this inquiry{' '}
                            <span aria-hidden="true">*</span>
                          </Label>
                        </div>
                        {errors.consent && (
                          <p id="consent-error" className="text-red-600 text-sm">{errors.consent}</p>
                        )}
                      </div>
                      <div className="space-y-4">
                        <Button
                          variant="cta"
                          size="xl"
                          type="submit"
                          className="w-full"
                          disabled={mutation.isLoading}
                          aria-label="Submit inquiry form"
                        >
                          {mutation.isLoading ? 'Submitting...' : 'Submit Inquiry'}
                        </Button>
                        <div className="text-center text-sm text-gray-600">
                          <span className="flex items-center justify-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Typical response time: 4-6 hours during business days
                          </span>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-egyptian-blue flex items-center">
                      <Phone className="h-5 w-5 mr-2" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Phone className="h-5 w-5 text-amber mt-0.5" />
                        <div>
                          <div className="font-semibold">Sales Hotline</div>
                          <div className="text-gray-600">+91 95283 55555</div>
                          <div className="text-sm text-gray-500">Mon-Sat, 9 AM - 7 PM</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-amber mt-0.5" />
                        <div>
                          <div className="font-semibold">Email</div>
                          <div className="text-gray-600">sales@gajpatiindustries.com</div>
                          <div className="text-sm text-gray-500">Response within 4 hours</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <MessageSquare className="h-5 w-5 text-amber mt-0.5" />
                        <div>
                          <div className="font-semibold">WhatsApp Business</div>
                          <div className="text-gray-600">+91 95283 55555</div>
                          <div className="text-sm text-gray-500">Quick queries & updates</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-egyptian-blue flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Technical Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="font-semibold mb-1">Technical Helpline</div>
                      <div className="text-gray-600">+91 95283 55555</div>
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold mb-1">Email</div>
                      <div className="text-gray-600">technical@gajpatiindustries.com</div>
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold mb-1">Available</div>
                      <div className="text-gray-600">Mon-Fri, 9 AM - 6 PM</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-egyptian-blue flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Head Office
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="font-semibold">Gajpati Industries Pvt. Ltd.</div>
                      <div className="text-gray-600">
                        Near Power Grid, SIDCO IGC Phase III
                        <br />
                        Samba, Jammu, J&K 184121, India
                      </div>
                      <div className="pt-4 space-y-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <Shield className="h-3 w-3 mr-1" />
                          ISO 9001:2015 Certified
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Shield className="h-3 w-3 mr-1" />
                          NDA Available on Request
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="space-y-3">
                  <PopupButton
                    url="https://calendly.com/amsmisho/30min"
                    rootElement={document.getElementById('root')!}
                    text="Schedule Plant Visit"
                    className="w-full rounded-md bg-amber text-white py-3 px-4 text-sm font-medium hover:bg-amber-dark focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2"
                  />
                  <Button variant="enterprise" size="lg" asChild className="w-full">
                    <Link to="/request-samples">Request Product Samples</Link>
                  </Button>
                  <Button variant="trust" size="lg" asChild className="w-full">
                    <a href="/downloads/company-profile.pdf" download>
                      Download Company Profile
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>
        <LazyLoad height={200} offset={100}>
          <section className="py-16 bg-platinum/20">
            <Container>
              <div className="text-center mb-12">
                <h2 className="font-display font-bold text-h2 text-egyptian-blue mb-4">
                  Manufacturing Locations
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our strategically located plants ensure quick delivery across India
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map((plant, index) => (
                  <Card key={index} className="shadow-card">
                    <CardContent className="p-6 text-center">
                      <Factory className="h-12 w-12 text-egyptian-blue mx-auto mb-4" />
                      <h3 className="font-semibold text-lg mb-2">{plant.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{plant.location}</p>
                      <p className="text-gray-600 text-sm">{plant.phone}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Container>
          </section>
        </LazyLoad>
        <section className="py-0">
          <InteractiveMap />
        </section>
      </div>
    </>
  );
};

export default Contact;