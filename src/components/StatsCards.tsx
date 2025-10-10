import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, HardDrive, Cpu, Zap, Network, ArrowUpDown, ArrowUp, ArrowDown, Pencil } from "lucide-react";
import { LegacyAsset } from "@/types/asset";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StatsCardsProps {
  assets: LegacyAsset[];
  onEditAsset?: (asset: LegacyAsset) => void;
}

const StatsCards = ({ assets, onEditAsset }: StatsCardsProps) => {
  const [showIpDialog, setShowIpDialog] = useState(false);
  const [sortColumn, setSortColumn] = useState<'ipAddress' | 'name' | 'assignedTo'>('ipAddress');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const totalAssets = assets.length;
  const activeAssets = assets.filter(asset => asset.status === 'active').length;
  const inMaintenanceAssets = assets.filter(asset => asset.status === 'maintenance').length;
  const retiredAssets = assets.filter(asset => asset.status === 'retired').length;
  const assetsWithIp = assets.filter(asset => asset.ipAddress && asset.ipAddress.trim() !== '');
  const usedIpAddresses = assetsWithIp.length;

  const handleSort = (column: 'ipAddress' | 'name' | 'assignedTo') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedAssetsWithIp = useMemo(() => {
    return [...assetsWithIp].sort((a, b) => {
      let aValue = a[sortColumn] || '';
      let bValue = b[sortColumn] || '';
      
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [assetsWithIp, sortColumn, sortDirection]);

  const SortIcon = ({ column }: { column: 'ipAddress' | 'name' | 'assignedTo' }) => {
    if (sortColumn !== column) return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const stats = [
    {
      title: "Total Assets",
      value: totalAssets,
      icon: Monitor,
      color: "bg-gradient-to-br from-primary/10 to-info/5",
      iconColor: "text-primary",
    },
    {
      title: "Active",
      value: activeAssets,
      icon: Zap,
      color: "bg-gradient-to-br from-success/10 to-success/5",
      iconColor: "text-success",
    },
    {
      title: "Maintenance",
      value: inMaintenanceAssets,
      icon: HardDrive,
      color: "bg-gradient-to-br from-warning/10 to-warning/5",
      iconColor: "text-warning",
    },
    {
      title: "Retired",
      value: retiredAssets,
      icon: Cpu,
      color: "bg-gradient-to-br from-muted/20 to-muted/10",
      iconColor: "text-muted-foreground",
    },
    {
      title: "Used IP Addresses",
      value: usedIpAddresses,
      icon: Network,
      color: "bg-gradient-to-br from-info/10 to-info/5",
      iconColor: "text-info",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isClickable = stat.title === "Used IP Addresses";
        return (
          <Card 
            key={stat.title} 
            className={`shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-[var(--transition-smooth)] ${isClickable ? 'cursor-pointer' : ''}`}
            onClick={isClickable ? () => setShowIpDialog(true) : undefined}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <Icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
      
      <Dialog open={showIpDialog} onOpenChange={setShowIpDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Used IP Addresses</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {assetsWithIp.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('ipAddress')}
                    >
                      <div className="flex items-center">
                        IP Address
                        <SortIcon column="ipAddress" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Asset Name
                        <SortIcon column="name" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('assignedTo')}
                    >
                      <div className="flex items-center">
                        Assigned To
                        <SortIcon column="assignedTo" />
                      </div>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAssetsWithIp.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-mono">{asset.ipAddress}</TableCell>
                      <TableCell>{asset.name}</TableCell>
                      <TableCell>{asset.assignedTo || '-'}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowIpDialog(false);
                            onEditAsset?.(asset);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-center py-8">No IP addresses assigned yet.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StatsCards;