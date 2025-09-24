import { Button } from "@/components/ui/button";
import { Plus, Search, Download, FileSpreadsheet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onAddAsset: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onExportExcel: () => void;
  onExportGoogleSheets: () => void;
}

const Header = ({ onAddAsset, searchTerm, onSearchChange, onExportExcel, onExportGoogleSheets }: HeaderProps) => {
  return (
    <header className="border-b bg-card shadow-[var(--shadow-soft)] sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Asset Manager</h1>
            <p className="text-muted-foreground">Track and manage your IT assets</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={onExportExcel}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export to Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onExportGoogleSheets}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export to Google Sheets
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button onClick={onAddAsset} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Asset
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;