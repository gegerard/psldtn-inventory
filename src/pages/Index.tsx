import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Download, Zap, FileSpreadsheet, LogOut } from "lucide-react";
import Header from "@/components/Header";
import StatsCards from "@/components/StatsCards";
import AssetCard from "@/components/AssetCard";
import AssetForm from "@/components/AssetForm";
import AssetDetail from "@/components/AssetDetail";
import ExportDialog from "@/components/ExportDialog";
import { useAssets } from "@/hooks/useAssets";
import { useAuth } from "@/hooks/useAuth";
import { AssetFormData, LegacyAsset } from "@/types/asset";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<LegacyAsset | null>(null);
  const [editingAsset, setEditingAsset] = useState<LegacyAsset | null>(null);

  const { user, loading: authLoading, signOut } = useAuth();
  const { assets, loading, error, addAsset, updateAsset, deleteAsset } = useAssets();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Filter and sort assets based on search, filter and sort criteria
  const filteredAssets = useMemo(() => {
    const filtered = assets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || asset.status === statusFilter;
      const matchesType = typeFilter === "all" || asset.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    // Sort assets based on selected criteria
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "type":
          return a.type.localeCompare(b.type);
        case "status":
          return a.status.localeCompare(b.status);
        case "location":
          return a.location.localeCompare(b.location);
        case "division":
          return (a.division || "").localeCompare(b.division || "");
        case "manufacturer":
          return a.manufacturer.localeCompare(b.manufacturer);
        case "purchaseDate":
          return new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime();
        default:
          return 0;
      }
    });
  }, [assets, searchTerm, statusFilter, typeFilter, sortBy]);

  const handleAddAsset = () => {
    setEditingAsset(null);
    setIsFormOpen(true);
  };

  const handleEditAsset = (asset: LegacyAsset) => {
    setEditingAsset(asset);
    setIsFormOpen(true);
    setIsDetailOpen(false);
  };

  const handleViewAsset = (asset: LegacyAsset) => {
    setSelectedAsset(asset);
    setIsDetailOpen(true);
  };

  const handleSaveAsset = async (assetData: AssetFormData) => {
    if (!user) return;
    
    if (editingAsset) {
      await updateAsset(editingAsset.id, assetData);
    } else {
      await addAsset(assetData, user.id);
    }
    setIsFormOpen(false);
    setEditingAsset(null);
  };

  const handleExportExcel = () => {
    const csvContent = generateCSV(assets);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `assets-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportGoogleSheets = () => {
    setIsExportDialogOpen(true);
  };

  const handleZapierExport = async (webhookUrl: string) => {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          assets: assets,
          timestamp: new Date().toISOString(),
          triggered_from: window.location.origin,
        }),
      });
    } catch (error) {
      // Handle error silently for webhook calls
    }
  };

  const generateCSV = (assets: LegacyAsset[]) => {
    const headers = [
      'Name', 'Type', 'Status', 'Serial Number', 'Manufacturer', 'Model',
      'Purchase Date', 'Warranty Expiry', 'Location', 'Assigned To', 'Division',
      'CPU', 'RAM', 'Primary Storage', 'Secondary Storage', 'Additional Storage',
      'Graphics', 'Operating System', 'Network', 'Notes'
    ];
    
    const rows = assets.map(asset => [
      asset.name,
      asset.type,
      asset.status,
      asset.serialNumber,
      asset.manufacturer,
      asset.model,
      asset.purchaseDate,
      asset.warrantyExpiry || '',
      asset.location,
      asset.assignedTo || '',
      asset.division || '',
      asset.specifications.cpu || '',
      asset.specifications.ram || '',
      asset.specifications.storage || '',
      asset.specifications.storage2 || '',
      asset.specifications.storage3 || '',
      asset.specifications.graphics || '',
      asset.specifications.operatingSystem || '',
      asset.specifications.network || '',
      asset.notes || ''
    ]);
    
    return [headers, ...rows].map(row => 
      row.map(field => `"${field.toString().replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Asset Management</h1>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Asset Management</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Track and manage your IT assets efficiently</p>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
              <Button
                onClick={handleAddAsset}
                className="flex items-center justify-center gap-2 h-11 text-sm font-medium col-span-2 sm:col-span-1"
              >
                <PlusCircle className="h-4 w-4" />
                Add Asset
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleExportExcel}
                className="flex items-center justify-center gap-2 h-11 text-sm"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">CSV</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleExportGoogleSheets}
                className="flex items-center justify-center gap-2 h-11 text-sm"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Google Sheets</span>
                <span className="sm:hidden">Sheets</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleExportGoogleSheets}
                className="flex items-center justify-center gap-2 h-11 text-sm"
              >
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Zapier Export</span>
                <span className="sm:hidden">Zapier</span>
              </Button>

              <Button 
                variant="outline" 
                onClick={signOut}
                className="flex items-center justify-center gap-2 h-11 text-sm"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Out</span>
              </Button>
            </div>
          </div>
        </div>

        <StatsCards assets={assets} />
        
        <div className="flex flex-col gap-4 mb-6">
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 text-base"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full h-11">
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
              <SelectTrigger className="w-full h-11">
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

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="type">Sort by Type</SelectItem>
                <SelectItem value="status">Sort by Status</SelectItem>
                <SelectItem value="location">Sort by Location</SelectItem>
                <SelectItem value="division">Sort by Division</SelectItem>
                <SelectItem value="manufacturer">Sort by Manufacturer</SelectItem>
                <SelectItem value="purchaseDate">Sort by Purchase Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-xl text-muted-foreground mb-4">Loading assets...</p>
          </div>
        ) : filteredAssets.length === 0 ? (
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
        onDelete={deleteAsset}
      />

      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onExport={handleZapierExport}
      />
    </div>
  );
};

export default Index;