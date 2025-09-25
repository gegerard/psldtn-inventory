import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LegacyAsset as Asset, AssetFormData } from "@/types/asset";

interface AssetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: AssetFormData) => void;
  asset?: Asset;
}

const AssetForm = ({ isOpen, onClose, onSave, asset }: AssetFormProps) => {
  const [formData, setFormData] = useState<AssetFormData>({
    name: asset?.name || "",
    type: asset?.type || "desktop",
    status: asset?.status || "active",
    serialNumber: asset?.serialNumber || "",
    manufacturer: asset?.manufacturer || "",
    model: asset?.model || "",
    purchaseDate: asset?.purchaseDate || "",
    warrantyExpiry: asset?.warrantyExpiry || "",
    location: asset?.location || "",
    assignedTo: asset?.assignedTo || "",
    specifications: {
      cpu: asset?.specifications.cpu || "",
      ram: asset?.specifications.ram || "",
      storage: asset?.specifications.storage || "",
      storage2: asset?.specifications.storage2 || "",
      storage3: asset?.specifications.storage3 || "",
      graphics: asset?.specifications.graphics || "",
      operatingSystem: asset?.specifications.operatingSystem || "",
      network: asset?.specifications.network || "",
    },
    notes: asset?.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: { ...prev.specifications, [field]: value }
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{asset ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Asset Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desktop">Desktop</SelectItem>
                  <SelectItem value="laptop">Laptop</SelectItem>
                  <SelectItem value="server">Server</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number *</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer *</Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date *</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
              <Input
                id="warrantyExpiry"
                type="date"
                value={formData.warrantyExpiry}
                onChange={(e) => handleInputChange('warrantyExpiry', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input
                id="assignedTo"
                value={formData.assignedTo}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpu">CPU</Label>
                <Input
                  id="cpu"
                  value={formData.specifications.cpu}
                  onChange={(e) => handleSpecChange('cpu', e.target.value)}
                  placeholder="e.g., Intel i7-12700K"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ram">RAM</Label>
                <Input
                  id="ram"
                  value={formData.specifications.ram}
                  onChange={(e) => handleSpecChange('ram', e.target.value)}
                  placeholder="e.g., 16GB DDR4"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storage">Primary Storage</Label>
                <Input
                  id="storage"
                  value={formData.specifications.storage}
                  onChange={(e) => handleSpecChange('storage', e.target.value)}
                  placeholder="e.g., 512GB NVMe SSD"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storage2">Secondary Storage</Label>
                <Input
                  id="storage2"
                  value={formData.specifications.storage2}
                  onChange={(e) => handleSpecChange('storage2', e.target.value)}
                  placeholder="e.g., 1TB HDD"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storage3">Additional Storage</Label>
                <Input
                  id="storage3"
                  value={formData.specifications.storage3}
                  onChange={(e) => handleSpecChange('storage3', e.target.value)}
                  placeholder="e.g., 2TB External Drive"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="graphics">Graphics</Label>
                <Input
                  id="graphics"
                  value={formData.specifications.graphics}
                  onChange={(e) => handleSpecChange('graphics', e.target.value)}
                  placeholder="e.g., NVIDIA RTX 3070"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="operatingSystem">Operating System</Label>
                <Input
                  id="operatingSystem"
                  value={formData.specifications.operatingSystem}
                  onChange={(e) => handleSpecChange('operatingSystem', e.target.value)}
                  placeholder="e.g., Windows 11 Pro"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="network">Network</Label>
                <Input
                  id="network"
                  value={formData.specifications.network}
                  onChange={(e) => handleSpecChange('network', e.target.value)}
                  placeholder="e.g., Gigabit Ethernet, Wi-Fi 6"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes about this asset..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {asset ? 'Update Asset' : 'Add Asset'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssetForm;