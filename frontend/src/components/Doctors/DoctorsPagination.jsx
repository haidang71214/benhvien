import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const DoctorsPagination = ({ currentPage, totalPage, onPageChange }) => {
  return (
    <div className="mt-12 flex justify-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20">
        <Pagination>
          <PaginationContent className="gap-2">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(currentPage - 1)}
                className={`cursor-pointer rounded-xl transition-all duration-300 ${
                  currentPage === 1 
                    ? "pointer-events-none opacity-50" 
                    : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md"
                }`}
              />
            </PaginationItem>
            
            {[...Array(totalPage)].map((_, i) => {
              const page = i + 1;
              if (
                page === 1 ||
                page === totalPage ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => onPageChange(page)}
                      isActive={currentPage === page}
                      className={`cursor-pointer rounded-xl transition-all duration-300 ${
                        currentPage === page
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                          : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md"
                      }`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              if (
                (page === currentPage - 2 && currentPage > 3) ||
                (page === currentPage + 2 && currentPage < totalPage - 2)
              ) {
                return <PaginationEllipsis key={page} className="text-gray-400" />;
              }
              return null;
            })}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(currentPage + 1)}
                className={`cursor-pointer rounded-xl transition-all duration-300 ${
                  currentPage === totalPage 
                    ? "pointer-events-none opacity-50" 
                    : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md"
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default DoctorsPagination;