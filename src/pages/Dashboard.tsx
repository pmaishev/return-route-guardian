
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReturnItem } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);

  useEffect(() => {
    // In a real app, this would be an API call
    const savedItems = localStorage.getItem("returnItems");
    if (savedItems) {
      setReturnItems(JSON.parse(savedItems));
    } else {
      // Initialize with mock data if nothing exists
      const mockData = getMockData();
      localStorage.setItem("returnItems", JSON.stringify(mockData));
      setReturnItems(mockData);
    }
  }, []);

  const countByStatus = {
    in_transit: returnItems.filter(item => item.status === "in_transit").length,
    received: returnItems.filter(item => item.status === "received").length,
    processed: returnItems.filter(item => item.status === "processed").length,
  };

  const countByCondition = {
    unknown: returnItems.filter(item => item.condition === "unknown").length,
    intactGoods: returnItems.filter(item => item.condition === "intactGoods").length,
    semiDefective: returnItems.filter(item => item.condition === "semiDefective").length,
    defective: returnItems.filter(item => item.condition === "defective").length,
    wrongVersion: returnItems.filter(item => item.condition === "wrongVersion").length,
  };

  const statusData = [
    { name: 'In Transit', value: countByStatus.in_transit },
    { name: 'Received', value: countByStatus.received },
    { name: 'Processed', value: countByStatus.processed },
  ];

  const conditionData = [
    { name: 'Unknown', value: countByCondition.unknown },
    { name: 'Intact Goods', value: countByCondition.intactGoods },
    { name: 'Semi Defective', value: countByCondition.semiDefective },
    { name: 'Defective', value: countByCondition.defective },
    { name: 'Wrong Version', value: countByCondition.wrongVersion },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{returnItems.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Pending Decisions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {countByStatus.in_transit + countByStatus.received}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Processed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{countByStatus.processed}</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Returns by Status</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statusData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Returns by Condition</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={conditionData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

function getMockData(): ReturnItem[] {
  return [
    {
      id: "1",
      productName: "Wireless Earbuds",
      sku: "WE-1234",
      orderId: "ORD-5678",
      customerName: "John Smith",
      returnReason: "Defective product",
      returnDate: "2023-05-01",
      status: "in_transit",
      condition: "defective"
    },
    {
      id: "2",
      productName: "Smart Watch",
      sku: "SW-5678",
      orderId: "ORD-9012",
      customerName: "Emily Johnson",
      returnReason: "Wrong item received",
      returnDate: "2023-05-03",
      status: "received",
      condition: "intactGoods"
    },
    {
      id: "3",
      productName: "Bluetooth Speaker",
      sku: "BS-9012",
      orderId: "ORD-3456",
      customerName: "Michael Brown",
      returnReason: "Changed mind",
      returnDate: "2023-05-05",
      status: "processed",
      condition: "semiDefective"
    },
    {
      id: "4",
      productName: "Laptop Stand",
      sku: "LS-3456",
      orderId: "ORD-7890",
      customerName: "Sarah Wilson",
      returnReason: "No longer needed",
      returnDate: "2023-05-07",
      status: "in_transit",
      condition: "intactGoods"
    },
    {
      id: "5",
      productName: "Phone Case",
      sku: "PC-7890",
      orderId: "ORD-1234",
      customerName: "David Lee",
      returnReason: "Not as described",
      returnDate: "2023-05-09",
      status: "received",
      condition: "semiDefective"
    },
    {
      id: "6",
      productName: "USB-C Cable",
      sku: "UC-2345",
      orderId: "ORD-6789",
      customerName: "Jennifer Taylor",
      returnReason: "Defective product",
      returnDate: "2023-05-11",
      status: "processed",
      condition: "defective"
    },
    {
      id: "7",
      productName: "Wireless Mouse",
      sku: "WM-6789",
      orderId: "ORD-0123",
      customerName: "Robert Garcia",
      returnReason: "Wrong color",
      returnDate: "2023-05-13",
      status: "in_transit",
      condition: "intactGoods"
    }
  ];
}

export default Dashboard;
