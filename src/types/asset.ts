export interface Asset {
  id: string;
  name: string;
  type: 'desktop' | 'laptop' | 'server' | 'other';
  status: 'active' | 'maintenance' | 'retired';
  serial_number: string;
  manufacturer: string;
  model: string;
  purchase_date: string;
  warranty_expiry?: string;
  location: string;
  assigned_to?: string;
  ip_address?: string;
  remote_id?: string;
  division?: string;
  specifications: {
    cpu?: string;
    ram?: string;
    storage?: string;
    storage2?: string;
    storage3?: string;
    graphics?: string;
    operatingSystem?: string;
    network?: string;
  };
  notes?: string;
  created_at: string;
  updated_at: string;
}

// For compatibility with existing components
export interface LegacyAsset {
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
  ipAddress?: string;
  remoteId?: string;
  division?: string;
  specifications: {
    cpu?: string;
    ram?: string;
    storage?: string;
    storage2?: string;
    storage3?: string;
    graphics?: string;
    operatingSystem?: string;
    network?: string;
  };
  notes?: string;
  lastUpdated: string;
}

export interface AssetFormData extends Omit<LegacyAsset, 'id' | 'lastUpdated'> {}

// Helper functions to convert between database format and legacy format
export const convertToLegacyFormat = (asset: Asset): LegacyAsset => ({
  id: asset.id,
  name: asset.name,
  type: asset.type,
  status: asset.status,
  serialNumber: asset.serial_number,
  manufacturer: asset.manufacturer,
  model: asset.model,
  purchaseDate: asset.purchase_date,
  warrantyExpiry: asset.warranty_expiry,
  location: asset.location,
  assignedTo: asset.assigned_to,
  ipAddress: asset.ip_address,
  remoteId: asset.remote_id,
  division: asset.division,
  specifications: asset.specifications,
  notes: asset.notes,
  lastUpdated: asset.updated_at,
});

export const convertFromLegacyFormat = (legacyAsset: AssetFormData): Omit<Asset, 'id' | 'created_at' | 'updated_at'> & { user_id?: string } => ({
  name: legacyAsset.name,
  type: legacyAsset.type,
  status: legacyAsset.status,
  serial_number: legacyAsset.serialNumber,
  manufacturer: legacyAsset.manufacturer,
  model: legacyAsset.model,
  purchase_date: legacyAsset.purchaseDate,
  warranty_expiry: legacyAsset.warrantyExpiry || null,
  location: legacyAsset.location,
  assigned_to: legacyAsset.assignedTo || null,
  ip_address: legacyAsset.ipAddress && legacyAsset.ipAddress.trim() !== '' ? legacyAsset.ipAddress : null,
  remote_id: legacyAsset.remoteId || null,
  division: legacyAsset.division || null,
  specifications: legacyAsset.specifications,
  notes: legacyAsset.notes || null,
});