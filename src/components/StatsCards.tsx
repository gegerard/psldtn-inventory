import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, HardDrive, Cpu, Zap, Network } from "lucide-react";
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
}

const StatsCards = ({ assets }: StatsCardsProps) => {
  const [showIpDialog, setShowIpDialog] = useState(false);
  const totalAssets = assets.length;
  const activeAssets = assets.filter(asset => asset.status === 'active').length;
  const inMaintenanceAssets = assets.filter(asset => asset.status === 'maintenance').length;
  const retiredAssets = assets.filter(asset => asset.status === 'retired').length;
  const assetsWithIp = assets.filter(asset => asset.ipAddress && asset.ipAddress.trim() !== '');
  const usedIpAddresses = assetsWithIp.length;

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
                    <TableHead>IP Address</TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Assigned To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assetsWithIp.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-mono">{asset.ipAddress}</TableCell>
                      <TableCell>{asset.name}</TableCell>
                      <TableCell>{asset.assignedTo || '-'}</TableCell>
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