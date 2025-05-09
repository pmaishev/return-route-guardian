
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ReturnItem as ReturnItemComponent } from "@/components/ReturnItem";
import { ReturnItem, Decision } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Returns = () => {
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // In a real app, this would be an API call
    const savedItems = localStorage.getItem("returnItems");
    if (savedItems) {
      setReturnItems(JSON.parse(savedItems));
    }
  }, []);

  const handleDecision = (itemId: string, decision: Decision) => {
    const updatedItems = returnItems.map(item => 
      item.id === itemId ? { ...item, status: "processed" as const } : item
    );
    
    setReturnItems(updatedItems);
    localStorage.setItem("returnItems", JSON.stringify(updatedItems));
  };

  const filteredItems = returnItems.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.productName.toLowerCase().includes(searchLower) ||
      item.sku.toLowerCase().includes(searchLower) ||
      item.orderId.toLowerCase().includes(searchLower) ||
      item.customerName.toLowerCase().includes(searchLower)
    );
  });

  const inTransitItems = filteredItems.filter(item => item.status === "in_transit");
  const receivedItems = filteredItems.filter(item => item.status === "received");
  const processedItems = filteredItems.filter(item => item.status === "processed");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-bold mb-2 sm:mb-0">Returns Management</h1>
          <Input 
            placeholder="Search returns..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-xs"
          />
        </div>
        
        <div className="mb-6 flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            In Transit: {inTransitItems.length}
          </Badge>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Received: {receivedItems.length}
          </Badge>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Processed: {processedItems.length}
          </Badge>
        </div>
        
        <Tabs defaultValue="in_transit">
          <TabsList className="mb-6">
            <TabsTrigger value="in_transit">
              In Transit ({inTransitItems.length})
            </TabsTrigger>
            <TabsTrigger value="received">
              Received ({receivedItems.length})
            </TabsTrigger>
            <TabsTrigger value="processed">
              Processed ({processedItems.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="in_transit">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inTransitItems.length > 0 ? (
                inTransitItems.map(item => (
                  <ReturnItemComponent 
                    key={item.id} 
                    item={item} 
                    onDecisionMade={handleDecision} 
                  />
                ))
              ) : (
                <div className="text-center p-8 col-span-1 md:col-span-2 bg-white border rounded-lg">
                  <p className="text-muted-foreground">No items in transit</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="received">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {receivedItems.length > 0 ? (
                receivedItems.map(item => (
                  <ReturnItemComponent 
                    key={item.id} 
                    item={item} 
                    onDecisionMade={handleDecision} 
                  />
                ))
              ) : (
                <div className="text-center p-8 col-span-1 md:col-span-2 bg-white border rounded-lg">
                  <p className="text-muted-foreground">No received items</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="processed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {processedItems.length > 0 ? (
                processedItems.map(item => (
                  <ReturnItemComponent 
                    key={item.id} 
                    item={item} 
                    onDecisionMade={handleDecision} 
                  />
                ))
              ) : (
                <div className="text-center p-8 col-span-1 md:col-span-2 bg-white border rounded-lg">
                  <p className="text-muted-foreground">No processed items</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Returns;
