import { useState, useMemo } from "react";
import { Asset, AssetFormData } from "@/types/asset";
import Header from "@/components/Header";
import StatsCards from "@/components/StatsCards";
import AssetCard from "@/components/AssetCard";
import AssetForm from "@/components/AssetForm";
import AssetDetail from "@/components/AssetDetail";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "1",
      name: "Dev Workstation 01",
      type: "desktop",
      status: "active",
      serialNumber: "DW001-2024",
      manufacturer: "Dell",
      model: "OptiPlex 7090",
      purchaseDate: "2024-01-15",
      warrantyExpiry: "2027-01-15",
      location: "Office Floor 2",
      assignedTo: "John Smith",
      specifications: {
        cpu: "Intel Core i7-11700K",
        ram: "32GB DDR4",
        storage: "1TB NVMe SSD",
        graphics: "NVIDIA GTX 1660 Ti",
        operatingSystem: "Windows 11 Pro",
        network: "Gigabit Ethernet"
      },
      notes: "Primary development workstation with dual monitor setup.",
      lastUpdated: "2024-01-15T10:00:00Z"
    },
    {
      id: "2",
      name: "MacBook Pro 16",
      type: "laptop",
      status: "active",
      serialNumber: "MBP16-2024-001",
      manufacturer: "Apple",
      model: "MacBook Pro 16-inch",
      purchaseDate: "2024-02-10",
      warrantyExpiry: "2025-02-10",
      location: "Remote Work",
      assignedTo: "Sarah Johnson",
      specifications: {
        cpu: "Apple M3 Pro",
        ram: "16GB Unified Memory",
        storage: "512GB SSD",
        operatingSystem: "macOS Sonoma",
        network: "Wi-Fi 6E, Bluetooth 5.3"
      },
      notes: "Mobile development machine for remote work.",
      lastUpdated: "2024-02-10T14:30:00Z"
    },
    {
      id: "3",
      name: "File Server 01",
      type: "server",
      status: "maintenance",
      serialNumber: "FS001-2023",
      manufacturer: "HPE",
      model: "ProLiant ML350 Gen10",
      purchaseDate: "2023-06-20",
      warrantyExpiry: "2026-06-20",
      location: "Server Room A",
      specifications: {
        cpu: "Intel Xeon Silver 4214R",
        ram: "64GB DDR4 ECC",
        storage: "4x 2TB RAID 10",
        network: "Dual Gigabit Ethernet"
      },
      notes: "Main file server undergoing scheduled maintenance.",
      lastUpdated: "2024-01-20T09:15:00Z"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || asset.status === statusFilter;
      const matchesType = typeFilter === "all" || asset.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [assets, searchTerm, statusFilter, typeFilter]);

  const handleAddAsset = () => {
    setEditingAsset(null);
    setIsFormOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setIsFormOpen(true);
    setIsDetailOpen(false);
  };

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDetailOpen(true);
  };

  const handleSaveAsset = (assetData: AssetFormData) => {
    if (editingAsset) {
      // Update existing asset
      setAssets(prev => prev.map(asset => 
        asset.id === editingAsset.id 
          ? { ...assetData, id: editingAsset.id, lastUpdated: new Date().toISOString() }
          : asset
      ));
      toast({
        title: "Asset updated",
        description: `${assetData.name} has been updated successfully.`,
      });
    } else {
      // Add new asset
      const newAsset: Asset = {
        ...assetData,
        id: Date.now().toString(),
        lastUpdated: new Date().toISOString()
      };
      setAssets(prev => [newAsset, ...prev]);
      toast({
        title: "Asset added",
        description: `${assetData.name} has been added successfully.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onAddAsset={handleAddAsset}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <main className="container mx-auto px-6 py-8">
        <StatsCards assets={assets} />
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="desktop">Desktop</SelectItem>
              <SelectItem value="laptop">Laptop</SelectItem>
              <SelectItem value="server">Server</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredAssets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">No assets found</p>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all" 
                ? "Try adjusting your filters or search terms"
                : "Get started by adding your first asset"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map(asset => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onEdit={handleEditAsset}
                onView={handleViewAsset}
              />
            ))}
          </div>
        )}
      </main>

      <AssetForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveAsset}
        asset={editingAsset}
      />

      <AssetDetail
        asset={selectedAsset}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={handleEditAsset}
      />
    </div>
  );
};

export default Index;
