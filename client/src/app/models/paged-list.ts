import { PAGE_SIZE, PAGE_INDEX } from './pagination.contants';

export class PagedList<T> {
    collection: T[] = [];
    totalCount = 0;
    pageSize = PAGE_SIZE;
    pageIndex = PAGE_INDEX;

    static build<T>(collection: T[], totalCount: number, pageSize = PAGE_SIZE, pageIndex = PAGE_INDEX): PagedList<T> {
        const result = new PagedList<T>();
        result.collection = collection;
        result.totalCount = totalCount;
        result.pageIndex = pageIndex;
        result.pageSize = pageSize;

        return result;
    }
}   