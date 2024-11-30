import React, {useMemo} from 'react'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface Props {
    setPage: (page: number) => void,
    page: number,
    total: number,
    perPage: number
}

const PaginationUser = ({ setPage, perPage, total, page }: Props) => {
    const totalPages = useMemo(() => Math.ceil(total / perPage), [total, perPage])

    return (
        <Pagination>
            <PaginationContent>
                {page > 1 && <PaginationItem className="cursor-pointer">
                    <PaginationPrevious onClick={() => setPage(page - 1)} />
                </PaginationItem>}
                {page > 1 && <PaginationItem className="cursor-pointer">
                    <PaginationLink onClick={() => setPage(page - 1)}>{page - 1}</PaginationLink>
                </PaginationItem>}
                <PaginationItem>
                    <PaginationLink isActive>{page}</PaginationLink>
                </PaginationItem>
                {totalPages !== page && <PaginationItem className="cursor-pointer">
                    <PaginationLink onClick={() => setPage(page + 1)}>{page + 1}</PaginationLink>
                </PaginationItem>}
                {page + 1 < totalPages - 1 && <PaginationItem className="cursor-pointer">
                    <PaginationEllipsis />
                </PaginationItem>}
                {totalPages !== page && <PaginationItem className="cursor-pointer">
                    <PaginationNext onClick={() => setPage(page + 1)} />
                </PaginationItem>}
            </PaginationContent>
        </Pagination>

    )
}

export default PaginationUser