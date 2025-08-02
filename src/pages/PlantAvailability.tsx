import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { MapPin, Factory, Truck, Phone, Clock } from "lucide-react";
import { fetchPlantsWithProducts } from "../services/plant";
import type { Plant } from "../services/plant";

const PlantAvailability = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchPlantsWithProducts()
      .then((data) => {
        setPlants(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load data");
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock": return "bg-green-100 text-green-800 border-green-200";
      case "Limited": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Out of Stock": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredPlants = selectedPlant === "all"
    ? plants
    : plants.filter((plant) => plant._id === selectedPlant);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-display font-bold text-hero mb-4">
              Plant Availability & Distribution
            </h1>
            <p className="text-xl leading-relaxed max-w-3xl mx-auto">
              Real-time inventory status across our 5 manufacturing facilities 
              ensuring prompt delivery for your project requirements
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <Factory className="h-8 w-8 text-egyptian-blue mx-auto" />
              <div className="text-2xl font-bold text-egyptian-blue">{plants.length}</div>
              <div className="text-sm text-gray-600">Warehouses</div>
            </div>
            <div className="space-y-2">
              <MapPin className="h-8 w-8 text-egyptian-blue mx-auto" />
              <div className="text-2xl font-bold text-egyptian-blue">--</div>
              <div className="text-sm text-gray-600">MT/Month Capacity</div>
            </div>
            <div className="space-y-2">
              <Truck className="h-8 w-8 text-egyptian-blue mx-auto" />
              <div className="text-2xl font-bold text-egyptian-blue">72</div>
              <div className="text-sm text-gray-600">Hours Avg Delivery</div>
            </div>
            <div className="space-y-2">
              <Clock className="h-8 w-8 text-egyptian-blue mx-auto" />
              <div className="text-2xl font-bold text-egyptian-blue">24/7</div>
              <div className="text-sm text-gray-600">Order Processing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Plant Filter */}
      <section className="py-6 bg-platinum/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant={selectedPlant === "all" ? "enterprise" : "outline"}
              onClick={() => setSelectedPlant("all")}
            >
              All Plants
            </Button>
            {plants.map((plant) => (
              <Button
                key={plant._id}
                variant={selectedPlant === plant._id ? "enterprise" : "outline"}
                onClick={() => setSelectedPlant(plant._id)}
              >
                {plant.name.split(" ")[1]}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Loading/Error State */}
      {loading && (
        <div className="text-center py-12 text-lg text-gray-500">Loading plant data...</div>
      )}
      {error && (
        <div className="text-center py-12 text-lg text-red-500">{error}</div>
      )}
      {/* Plant Details */}
      {!loading && !error && (
        <section className="py-12 bg-platinum/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {filteredPlants.map((plant) => (
                <Card key={plant._id} className="shadow-card">
                  <CardHeader className="bg-gradient-to-r from-egyptian-blue to-violet-blue text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <CardTitle className="text-xl mb-2">{plant.name} Plant</CardTitle>
                        <div className="flex items-center text-white/90 text-sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          {plant.location}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 text-right">
                        <div className="text-white/90 text-sm">Capacity</div>
                        <div className="text-xl font-bold">{plant.capacity}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* Plant Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div>
                        <h4 className="font-semibold text-egyptian-blue mb-2">Plant Details</h4>
                        <div className="space-y-1 text-sm">
                          {/* <div><span className="text-gray-600">Region:</span> {plant.region}</div> */}
                          <div><span className="text-gray-600">Established:</span> {new Date(plant.established).getFullYear()}</div>
                          {/* <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1 text-gray-400" />
                            {plant.contact}
                          </div> */}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <h4 className="font-semibold text-egyptian-blue mb-2">Certifications</h4>
                        <div className="flex flex-wrap gap-2">
                          {plant.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Product Availability Table */}
                    <div>
                      <h4 className="font-semibold text-egyptian-blue mb-4">Current Inventory Status</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="text-left p-3 border-b font-semibold text-sm">Product</th>
                              <th className="text-center p-3 border-b font-semibold text-sm">Status</th>
                              <th className="text-center p-3 border-b font-semibold text-sm">Available Quantity</th>
                              <th className="text-center p-3 border-b font-semibold text-sm">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {plant.products.map((product, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="p-3 border-b">
                                  <div className="font-medium text-sm">{product.name}</div>
                                </td>
                                <td className="p-3 border-b text-center">
                                  <Badge className={`text-xs ${getStatusColor(product.status)}`}>
                                    {product.status}
                                  </Badge>
                                </td>
                                <td className="p-3 border-b text-center text-sm font-medium">
                                  {product.quantity}
                                </td>
                                <td className="p-3 border-b text-center">
                                  <Button
                                    size="sm"
                                    variant={product.status === "In Stock" ? "enterprise" : "outline"}
                                    disabled={product.status === "Out of Stock"}
                                  >
                                    {product.status === "Out of Stock" ? "Notify" : "Order"}
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick Order CTA */}
      <section className="py-16 bg-gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-h2 mb-6">
            Need Immediate Supply?
          </h2>
          <p className="text-xl mb-8 leading-relaxed">
            Our logistics team can arrange express delivery from the nearest plant 
            to your project site within 24-48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="action" size="xl">
              Emergency Order Hotline
            </Button>
            <Button variant="trust" size="xl">
              Check Delivery Timeline
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlantAvailability;