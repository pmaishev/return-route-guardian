
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ReturnItem, Decision } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Package, ArrowLeft, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import ReturnItemDetail from "@/components/ReturnItemDetail";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Returns = () => {
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkDecision, setBulkDecision] = useState<Decision | "">("");
  const [detailItem, setDetailItem] = useState<ReturnItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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

  const handleBulkDecision = () => {
    if (!bulkDecision) {
      toast.error("Please select a decision first");
      return;
    }
    
    if (selectedItems.length === 0) {
      toast.error("No items selected");
      return;
    }

    const updatedItems = returnItems.map(item => 
      selectedItems.includes(item.id) ? { ...item, status: "processed" as const } : item
    );
    
    setReturnItems(updatedItems);
    localStorage.setItem("returnItems", JSON.stringify(updatedItems));
    toast.success(`Decision applied to ${selectedItems.length} items`);
    setSelectedItems([]);
    setBulkDecision("");
  };

  const handleRowClick = (item: ReturnItem) => {
    setDetailItem(item);
    setIsDetailOpen(true);
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleSelectAll = (items: ReturnItem[]) => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item.id));
    }
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

  const renderTable = (items: ReturnItem[]) => (
    <>
      {items.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={items.length > 0 && selectedItems.length === items.length}
                    onCheckedChange={() => toggleSelectAll(items)}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Return Reason</TableHead>
                <TableHead>Condition</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow 
                  key={item.id} 
                  className={selectedItems.includes(item.id) ? "bg-muted/50" : ""}
                  onDoubleClick={() => handleRowClick(item)}
                >
                  <TableCell>
                    <Checkbox 
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => toggleItemSelection(item.id)}
                      aria-label={`Select ${item.productName}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.orderId}</TableCell>
                  <TableCell>{item.customerName}</TableCell>
                  <TableCell>{item.returnDate}</TableCell>
                  <TableCell>{item.returnReason}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      item.condition === "new" ? "bg-green-100 text-green-800 border-green-200" :
                      item.condition === "used" ? "bg-blue-100 text-blue-800 border-blue-200" :
                      "bg-red-100 text-red-800 border-red-200"
                    }>
                      {item.condition.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center p-8 bg-white border rounded-lg">
          <p className="text-muted-foreground">No items found</p>
        </div>
      )}
    </>
  );

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
        
        {(inTransitItems.length > 0 || receivedItems.length > 0) && (
          <div className="mb-6 p-4 bg-white rounded-md border shadow-sm">
            <div className="text-sm font-medium mb-2">Bulk Actions</div>
            <div className="flex flex-wrap items-center gap-4">
              <Select value={bulkDecision} onValueChange={(value: Decision) => setBulkDecision(value)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select decision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="return_to_inventory">Return to Inventory</SelectItem>
                  <SelectItem value="dispose">Dispose</SelectItem>
                  <SelectItem value="donate">Donate</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleBulkDecision}>Apply to Selected ({selectedItems.length})</Button>
            </div>
          </div>
        )}
        
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
            {renderTable(inTransitItems)}
          </TabsContent>
          
          <TabsContent value="received">
            {renderTable(receivedItems)}
          </TabsContent>
          
          <TabsContent value="processed">
            {renderTable(processedItems)}
          </TabsContent>
        </Tabs>
      </div>

      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="w-full max-w-md overflow-auto">
          <SheetHeader>
            <SheetTitle>Return Details</SheetTitle>
            <SheetDescription>
              View return item details and make a decision
            </SheetDescription>
          </SheetHeader>
          {detailItem && (
            <ReturnItemDetail 
              item={detailItem} 
              onDecisionMade={(decision) => {
                handleDecision(detailItem.id, decision);
                setIsDetailOpen(false);
                toast.success(`Decision recorded: ${decision.replace("_", " ")}`);
              }}
              onClose={() => setIsDetailOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Returns;
