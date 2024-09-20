export class Pagination<T> {
    private _data: Array<T>;
    private _page: number;
    private _size: number;
    private _totalPages: number;
    private _totalElements: number;

    constructor(data: Array<T>, page: number, size: number, totalPages: number, totalElements: number) {
        this._data = data;
        this._page = page;
        this._size = size;
        this._totalPages = totalPages;
        this._totalElements = totalElements;
    }

    /**
     * Getter data
     * @return {Array<T>}
     */
    public get data(): Array<T> {
        return this._data;
    }

    /**
     * Getter page
     * @return {number}
     */
    public get page(): number {
        return this._page;
    }

    /**
     * Getter size
     * @return {number}
     */
    public get size(): number {
        return this._size;
    }

    /**
     * Getter totalPages
     * @return {number}
     */
    public get totalPages(): number {
        return this._totalPages;
    }

    /**
     * Getter totalElements
     * @return {number}
     */
    public get totalElements(): number {
        return this._totalElements;
    }

    /**
     * Setter data
     * @param {Array<T>} value
     */
    public set data(value: Array<T>) {
        this._data = value;
    }

    /**
     * Setter page
     * @param {number} value
     */
    public set page(value: number) {
        this._page = value;
    }

    /**
     * Setter size
     * @param {number} value
     */
    public set size(value: number) {
        this._size = value;
    }

    /**
     * Setter totalPages
     * @param {number} value
     */
    public set totalPages(value: number) {
        this._totalPages = value;
    }

    /**
     * Setter totalElements
     * @param {number} value
     */
    public set totalElements(value: number) {
        this._totalElements = value;
    }
}
