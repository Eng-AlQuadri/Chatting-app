import { Pagination } from "../Interfaces/pagination";

export class PaginatedResult<T> {
  result!: T;
  pagination!: Pagination
}
