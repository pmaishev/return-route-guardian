import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReturnItem as ReturnItemType, Decision } from "@/types";
import { 
  ArrowLeft, 
  Trash2, 
  Package, 
  AlertCircle, 
  Check,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ReturnItemProps {
  item: ReturnItemType;
  onDecisionMade: (itemId: string, decision: Decision) => void;
}

export const ReturnItem = ({ item, onDecisionMade }: ReturnItemProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [notes, setNotes] = useState("");

  const statusColor = {
    in_transit: "bg-yellow-100 text-yellow-800 border-yellow-200",
    received: "bg-blue-100 text-blue-800 border-blue-200",
    processed: "bg-green-100 text-green-800 border-green-200",
  };

  const conditionColor = {
    unknown: "bg-gray-100 text-gray-800 border-gray-200",
    intactGoods: "bg-green-100 text-green-800 border-green-200",
    semiDefective: "bg-yellow-100 text-yellow-800 border-yellow-200",
    defective: "bg-red-100 text-red-800 border-red-200",
    wrongVersion: "bg-blue-100 text-blue-800 border-blue-200"
  };

  const formatCondition = (condition: string): string => {
    switch (condition) {
      case "intactGoods":
        return "INTACT GOODS";
      case "semiDefective":
        return "SEMI DEFECTIVE";
      case "wrongVersion":
        return "WRONG VERSION";
      default:
        return condition.toUpperCase();
    }
  };

  const handleDecisionConfirm = () => {
    if (selectedDecision) {
      onDecisionMade(item.id, selectedDecision);
      toast.success(`Item ${item.productName} has been processed with decision: ${formatDecision(selectedDecision)}`);
      setDialogOpen(false);
      setSelectedDecision(null);
      setNotes("");
    }
  };

  const formatDecision = (decision: Decision): string => {
    switch (decision) {
      case "return_to_inventory":
        return "Return to inventory";
      case "dispose":
        return "Dispose";
      case "donate":
        return "Donate";
      default:
        return decision;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{item.productName}</CardTitle>
            <CardDescription>SKU: {item.sku} • Order: {item.orderId}</CardDescription>
          </div>
          <Badge className={statusColor[item.status]}>
            {item.status.replace("_", " ").toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3 rounded-md overflow-hidden border">
            <AspectRatio ratio={1 / 1}>
              {item.productImage ? (
                <img 
                  src={item.productImage} 
                  alt={item.productName}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <ImageIcon className="h-8 w-8 text-muted-foreground opacity-50" />
                  <span className="sr-only">No image available</span>
                </div>
              )}
            </AspectRatio>
          </div>
          <div className="w-full md:w-2/3">
            <div className="grid grid-cols-2 gap-4 my-2">
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{item.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Return Date</p>
                <p className="font-medium">{item.returnDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reason for Return</p>
                <p className="font-medium">{item.returnReason}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Condition</p>
                <Badge variant="outline" className={conditionColor[item.condition]}>
                  {formatCondition(item.condition)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2 border-t">
        {item.status !== "processed" && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-custom-blue hover:bg-custom-blue-dark">Make Decision</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Process Return Item</DialogTitle>
                <DialogDescription>
                  Select what to do with this returned item
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Button 
                    variant={selectedDecision === "return_to_inventory" ? "default" : "outline"} 
                    className="flex justify-start items-center gap-2 h-auto py-3"
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
                    className="flex justify-start items-center gap-2 h-auto py-3"
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
                    className="flex justify-start items-center gap-2 h-auto py-3"
                    onClick={() => setSelectedDecision("donate")}
                  >
                    <ArrowLeft className="h-5 w-5 text-custom-green" />
                    <div className="text-left">
                      <div className="font-medium">Donate Item</div>
                      <div className="text-xs text-muted-foreground">Item will be donated to charity</div>
                    </div>
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">Additional Notes</label>
                  <Textarea 
                    id="notes" 
                    placeholder="Add any additional processing notes here..." 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={handleDecisionConfirm} 
                  disabled={!selectedDecision}
                >
                  Confirm Decision
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
};
