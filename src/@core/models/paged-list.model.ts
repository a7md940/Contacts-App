
export class PagedList<T> {
    collection: T[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;

    static build<T>(rows: T[], pageIndex: number, pageSize: number, totalCount: number): PagedList<T> {
        const result = new PagedList<T>();
        
        result.collection = rows;
        result.pageIndex = pageIndex;
        result.pageSize = pageSize;
        result.totalCount = totalCount;

        return result;
    }
}