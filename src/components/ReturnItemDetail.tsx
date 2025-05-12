
import { ReturnItem, Decision } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Package, ArrowLeft, Trash2 } from "lucide-react";
import { SheetClose } from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ReturnItemDetailProps {
  item: ReturnItem;
  onDecisionMade: (decision: Decision) => void;
  onClose: () => void;
}

const ReturnItemDetail = ({ item, onDecisionMade, onClose }: ReturnItemDetailProps) => {
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [notes, setNotes] = useState("");

  const conditionColor = {
    new: "bg-green-100 text-green-800 border-green-200",
    used: "bg-blue-100 text-blue-800 border-blue-200",
    damaged: "bg-red-100 text-red-800 border-red-200",
  };

  const statusColor = {
    in_transit: "bg-yellow-100 text-yellow-800 border-yellow-200",
    received: "bg-blue-100 text-blue-800 border-blue-200",
    processed: "bg-green-100 text-green-800 border-green-200",
  };

  const handleSubmit = () => {
    if (selectedDecision) {
      onDecisionMade(selectedDecision);
    }
  };

  return (
    <div className="pt-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-semibold">{item.productName}</h3>
          <div className="text-muted-foreground text-sm">SKU: {item.sku}</div>
          <div className="text-muted-foreground text-sm">Order: {item.orderId}</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className={statusColor[item.status]}>
              {item.status.replace("_", " ").toUpperCase()}
            </Badge>
            <Badge variant="outline" className={conditionColor[item.condition]}>
              {item.condition.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Customer</p>
            <p className="font-medium">{item.customerName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Return Date</p>
            <p className="font-medium">{item.returnDate}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Reason for Return</p>
            <p className="font-medium">{item.returnReason}</p>
          </div>
        </div>

        {item.status !== "processed" && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Make a Decision</h4>
            
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  variant={selectedDecision === "return_to_inventory" ? "default" : "outline"} 
                  className="justify-start items-center gap-2 h-auto py-3"
                  onClick={() => setSelectedDecision("return_to_inventory")}
                >
                  <Package className="h-5 w-5 text-custom-blue" />
                  <div className="text-left">
                    <div className="font-medium">Return to Inventory</div>
                    <div className="text-xs text-muted-foreground">Item can be resold</div>
                  </div>
                </Button>
                
                <Button 
                  variant={selectedDecision === "dispose" ? "default" : "outline"} 
                  className="justify-start items-center gap-2 h-auto py-3"
                  onClick={() => setSelectedDecision("dispose")}
                >
                  <Trash2 className="h-5 w-5 text-custom-red" />
                  <div className="text-left">
                    <div className="font-medium">Dispose Item</div>
                    <div className="text-xs text-muted-foreground">Item cannot be resold or donated</div>
                  </div>
                </Button>
                
                <Button 
                  variant={selectedDecision === "donate" ? "default" : "outline"} 
                  className="justify-start items-center gap-2 h-auto py-3"
                  onClick={() => setSelectedDecision("donate")}
                >
                  <ArrowLeft className="h-5 w-5 text-custom-green" />
                  <div className="text-left">
                    <div className="font-medium">Donate Item</div>
                    <div className="text-xs text-muted-foreground">Item will be donated to charity</div>
                  </div>
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Notes</label>
              <Textarea 
                placeholder="Add processing notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <SheetClose asChild>
                <Button variant="outline" onClick={onClose}>Cancel</Button>
              </SheetClose>
              <Button 
                onClick={handleSubmit} 
                disabled={!selectedDecision}
              >
                Confirm Decision
              </Button>
            </div>
          </div>
        )}
        
        {item.status === "processed" && (
          <div className="rounded-md bg-muted/50 p-4">
            <p className="text-sm font-medium">This item has already been processed.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnItemDetail;
