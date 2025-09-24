export interface Asset {
  id: string;
  name: string;
  type: 'desktop' | 'laptop' | 'server' | 'other';
  status: 'active' | 'maintenance' | 'retired';
  serialNumber: string;
  manufacturer: string;
  model: string;
  purchaseDate: string;
  warrantyExpiry?: string;
  location: string;
  assignedTo?: string;
  specifications: {
    cpu?: string;
    ram?: string;
    storage?: string;
    graphics?: string;
    operatingSystem?: string;
    network?: string;
  };
  notes?: string;
  lastUpdated: string;
}

export interface AssetFormData extends Omit<Asset, 'id' | 'lastUpdated'> {}