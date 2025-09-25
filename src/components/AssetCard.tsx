import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LegacyAsset as Asset } from "@/types/asset";
import { Monitor, Laptop, Server, HardDrive, Edit, Eye, Calendar, MapPin, User } from "lucide-react";

interface AssetCardProps {
  asset: Asset;
  onEdit: (asset: Asset) => void;
  onView: (asset: Asset) => void;
}

const AssetCard = ({ asset, onEdit, onView }: AssetCardProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'desktop':
        return Monitor;
      case 'laptop':
        return Laptop;
      case 'server':
        return Server;
      default:
        return HardDrive;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'maintenance':
        return 'bg-warning text-warning-foreground';
      case 'retired':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const TypeIcon = getTypeIcon(asset.type);

  return (
    <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-[var(--transition-smooth)] group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-info/5">
              <TypeIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{asset.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{asset.manufacturer} {asset.model}</p>
            </div>
          </div>
          <Badge className={getStatusColor(asset.status)} variant="secondary">
            {asset.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Purchased</span>
          </div>
          <span className="font-medium">{new Date(asset.purchaseDate).toLocaleDateString()}</span>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Location</span>
          </div>
          <span className="font-medium">{asset.location}</span>
          
          {asset.assignedTo && (
            <>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Assigned to</span>
              </div>
              <span className="font-medium">{asset.assignedTo}</span>
            </>
          )}
        </div>

        {asset.specifications.cpu && (
          <div className="bg-muted/50 rounded-lg p-3 space-y-1">
            <h4 className="text-sm font-medium text-muted-foreground">Key Specs</h4>
            <div className="grid grid-cols-1 gap-1 text-sm">
              {asset.specifications.cpu && <div><span className="text-muted-foreground">CPU:</span> {asset.specifications.cpu}</div>}
              {asset.specifications.ram && <div><span className="text-muted-foreground">RAM:</span> {asset.specifications.ram}</div>}
              {asset.specifications.storage && <div><span className="text-muted-foreground">Storage:</span> {asset.specifications.storage}</div>}
            </div>
          </div>
        )}

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-[var(--transition-smooth)]">
          <Button variant="outline" size="sm" onClick={() => onView(asset)} className="flex-1 gap-2">
            <Eye className="h-4 w-4" />
            View
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(asset)} className="flex-1 gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetCard;