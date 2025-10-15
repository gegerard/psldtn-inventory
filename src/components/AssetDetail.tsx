import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LegacyAsset as Asset } from "@/types/asset";
import { 
  Monitor, 
  Laptop, 
  Server, 
  HardDrive, 
  Calendar, 
  MapPin, 
  User, 
  Shield, 
  Edit,
  Trash2,
  Cpu,
  MemoryStick,
  HardDriveIcon,
  Monitor as GraphicsIcon,
  Network,
  Settings
} from "lucide-react";

interface AssetDetailProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (asset: Asset) => void;
  onDelete: (assetId: string) => void;
}

const AssetDetail = ({ asset, isOpen, onClose, onEdit, onDelete }: AssetDetailProps) => {
  if (!asset) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4 w-[calc(100vw-2rem)] sm:w-full">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-primary/10 to-info/5 flex-shrink-0">
                <TypeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-xl sm:text-2xl font-bold truncate">{asset.name}</DialogTitle>
                <p className="text-sm sm:text-base text-muted-foreground truncate">{asset.manufacturer} {asset.model}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
              <Badge className={getStatusColor(asset.status)} variant="secondary">
                {asset.status}
              </Badge>
              <div className="flex gap-2 flex-1 sm:flex-initial">
                <Button onClick={() => onEdit(asset)} className="gap-2 h-9 sm:h-10 flex-1 sm:flex-initial">
                  <Edit className="h-4 w-4" />
                  <span className="sm:inline">Edit</span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="gap-2 h-9 sm:h-10 flex-1 sm:flex-initial">
                      <Trash2 className="h-4 w-4" />
                      <span className="sm:inline">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Asset</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{asset.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          onDelete(asset.id);
                          onClose();
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-card border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Basic Information
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <span className="text-muted-foreground font-medium">Type:</span>
                  <span className="sm:col-span-2 font-medium capitalize">{asset.type}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-muted-foreground">Serial:</span>
                  <span className="col-span-2 font-mono text-sm bg-muted px-2 py-1 rounded">
                    {asset.serialNumber}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Purchase:
                  </span>
                  <span className="col-span-2 font-medium">
                    {new Date(asset.purchaseDate).toLocaleDateString()}
                  </span>
                </div>
                {asset.warrantyExpiry && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      Warranty:
                    </span>
                    <span className="col-span-2 font-medium">
                      {new Date(asset.warrantyExpiry).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Location:
                  </span>
                  <span className="col-span-2 font-medium">{asset.location}</span>
                </div>
                {asset.assignedTo && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Assigned:
                    </span>
                    <span className="col-span-2 font-medium">{asset.assignedTo}</span>
                  </div>
                )}
                {asset.ipAddress && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Network className="h-4 w-4" />
                      IP Address:
                    </span>
                    <span className="col-span-2 font-mono text-sm bg-muted px-2 py-1 rounded">
                      {asset.ipAddress}
                    </span>
                  </div>
                )}
                {asset.remoteId && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Network className="h-4 w-4" />
                      Remote ID:
                    </span>
                    <span className="col-span-2 font-mono text-sm bg-muted px-2 py-1 rounded">
                      {asset.remoteId}
                    </span>
                  </div>
                )}
                {asset.division && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Division:</span>
                    <span className="col-span-2 font-medium">{asset.division}</span>
                  </div>
                )}
              </div>
            </div>

            {asset.notes && (
              <div className="bg-card border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Notes</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{asset.notes}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-card border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Technical Specifications
              </h3>
              <div className="space-y-4">
                {asset.specifications.cpu && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Cpu className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Processor</div>
                      <div className="font-medium">{asset.specifications.cpu}</div>
                    </div>
                  </div>
                )}
                
                {asset.specifications.ram && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <MemoryStick className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Memory</div>
                      <div className="font-medium">{asset.specifications.ram}</div>
                    </div>
                  </div>
                )}
                
                {asset.specifications.storage && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <HardDriveIcon className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Storage</div>
                      <div className="font-medium">{asset.specifications.storage}</div>
                    </div>
                  </div>
                )}
                
                {asset.specifications.graphics && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <GraphicsIcon className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Graphics</div>
                      <div className="font-medium">{asset.specifications.graphics}</div>
                    </div>
                  </div>
                )}
                
                {asset.specifications.operatingSystem && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Settings className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Operating System</div>
                      <div className="font-medium">{asset.specifications.operatingSystem}</div>
                    </div>
                  </div>
                )}
                
                {asset.specifications.network && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Network className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Network</div>
                      <div className="font-medium">{asset.specifications.network}</div>
                    </div>
                  </div>
                )}

                {!Object.values(asset.specifications).some(Boolean) && (
                  <div className="text-center py-8 text-muted-foreground">
                    No specifications recorded
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date(asset.lastUpdated).toLocaleString()}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssetDetail;