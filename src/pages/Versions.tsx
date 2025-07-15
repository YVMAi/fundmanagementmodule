
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, RotateCcw, FileText, FileSpreadsheet, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

// Mock data for versions
const versions = [
  {
    id: "v1.4.2",
    date: "2024-01-15",
    time: "14:30",
    author: "John Doe",
    description: "Updated user management features",
    status: "current",
    size: "2.4 MB",
    tag: null
  },
  {
    id: "v1.4.1",
    date: "2024-01-12",
    time: "09:15",
    author: "Jane Smith",
    description: "Bug fixes and performance improvements",
    status: "archived",
    size: "2.3 MB",
    tag: "Restored from v1.3.5"
  },
  {
    id: "v1.4.0",
    date: "2024-01-08",
    time: "16:45",
    author: "Mike Johnson",
    description: "Major feature release with dashboard updates",
    status: "archived",
    size: "2.5 MB",
    tag: null
  },
  {
    id: "v1.3.5",
    date: "2024-01-05",
    time: "11:20",
    author: "Sarah Wilson",
    description: "Security patches and minor fixes",
    status: "archived",
    size: "2.2 MB",
    tag: null
  },
  {
    id: "v1.3.4",
    date: "2024-01-02",
    time: "13:10",
    author: "Tom Brown",
    description: "Initial release with core functionality",
    status: "archived",
    size: "2.1 MB",
    tag: "Restored from v1.2.8"
  }
];

const ITEMS_PER_PAGE = 10;

const Versions = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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

  // Filter versions based on search query
  const filteredVersions = versions.filter(version =>
    version.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    version.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    version.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredVersions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedVersions = filteredVersions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
              <div className="flex items-center space-x-2 mt-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search versions..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1); // Reset to first page when searching
                    }}
                    className="pl-8"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedVersions.map((version) => (
                    <TableRow key={version.id}>
                      <TableCell>
                        <div className="font-medium">{version.id}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{version.date}</div>
                          <div className="text-sm text-gray-500">{version.time}</div>
                        </div>
                      </TableCell>
                      <TableCell>{version.author}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={version.status === 'current' ? 'default' : 'secondary'}
                          className={version.status === 'current' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                        >
                          {version.status === 'current' ? 'Current' : 'Archived'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {version.tag && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {version.tag}
                          </Badge>
                        )}
                      </TableCell>
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
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <RotateCcw className="h-4 w-4 mr-1" />
                                  Restore
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Restore Version</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to restore version {version.id}? This will make it the current primary version and cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleRestore(version.id)}>
                                    Restore Version
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Versions;
