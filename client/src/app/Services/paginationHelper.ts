import { HttpClient, HttpParams } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { PaginatedResult } from "../Models/Classes/paginatedResult";

export function getPaginatedResult<T>(url: string, params: HttpParams, http: HttpClient): Observable<PaginatedResult<T>> {

  const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

  return http.get<T>(url, { observe: 'response', params }).pipe(
    map(response => {

      paginatedResult.result = response.body!;
      if (response.headers.get('Pagination') !== null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
      }
      return paginatedResult;
    })
  );
}

export function getPaginationHeaders(pageNumber: number, pageSize: number): HttpParams {
  let params = new HttpParams();

  params = params.append('pageNumber', pageNumber.toString());
  params = params.append('pageSize', pageSize.toString());

  return params;
}
