
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, RotateCcw, FileText, FileSpreadsheet } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

// Mock data for versions
const versions = [
  {
    id: "v1.4.2",
    date: "2024-01-15",
    time: "14:30",
    author: "John Doe",
    description: "Updated user management features",
    status: "current",
    size: "2.4 MB"
  },
  {
    id: "v1.4.1",
    date: "2024-01-12",
    time: "09:15",
    author: "Jane Smith",
    description: "Bug fixes and performance improvements",
    status: "archived",
    size: "2.3 MB"
  },
  {
    id: "v1.4.0",
    date: "2024-01-08",
    time: "16:45",
    author: "Mike Johnson",
    description: "Major feature release with dashboard updates",
    status: "archived",
    size: "2.5 MB"
  },
  {
    id: "v1.3.5",
    date: "2024-01-05",
    time: "11:20",
    author: "Sarah Wilson",
    description: "Security patches and minor fixes",
    status: "archived",
    size: "2.2 MB"
  },
  {
    id: "v1.3.4",
    date: "2024-01-02",
    time: "13:10",
    author: "Tom Brown",
    description: "Initial release with core functionality",
    status: "archived",
    size: "2.1 MB"
  }
];

const Versions = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  const handleDownload = (versionId: string, format: 'pdf' | 'excel') => {
    toast({
      title: "Download Started",
      description: `Downloading ${versionId} in ${format.toUpperCase()} format...`,
    });
    // Here you would implement the actual download logic
  };

  const handleRestore = (versionId: string) => {
    toast({
      title: "Version Restored",
      description: `${versionId} has been restored as the primary version.`,
    });
    // Here you would implement the actual restore logic
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="lg:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Version History</h1>
            <p className="text-gray-600">
              View, download, and restore previous versions of your application
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Versions</CardTitle>
              <CardDescription>
                Manage your application versions. You can download versions in PDF or Excel format, or restore any version as the primary version.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {versions.map((version) => (
                    <TableRow key={version.id}>
                      <TableCell className="font-medium">{version.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{version.date}</div>
                          <div className="text-sm text-gray-500">{version.time}</div>
                        </div>
                      </TableCell>
                      <TableCell>{version.author}</TableCell>
                      <TableCell className="max-w-xs truncate">{version.description}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={version.status === 'current' ? 'default' : 'secondary'}
                          className={version.status === 'current' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                        >
                          {version.status === 'current' ? 'Current' : 'Archived'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{version.size}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDownload(version.id, 'pdf')}>
                                <FileText className="h-4 w-4 mr-2" />
                                Download as PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownload(version.id, 'excel')}>
                                <FileSpreadsheet className="h-4 w-4 mr-2" />
                                Download as Excel
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          
                          {version.status !== 'current' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRestore(version.id)}
                            >
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Restore
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Versions;
