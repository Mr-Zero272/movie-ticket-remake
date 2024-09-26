export class Movie {
    private _id: number;
    private _title: string;
    private _adult: boolean;
    private _budget: number;
    private _originalLanguage: string;
    private _overview: string;
    private _status: string;
    private _video: string;
    private _posterPath: string;
    private _backdropPath: string;
    private _voteAverage: number;
    private _voteCount: number;
    private _runtime: number;
    private _releaseDate: string;
    private _deleteFlag: boolean;
    private _genres: Array<{ id: number; name: string }>;

    constructor(
        id: number,
        title: string,
        adult: boolean,
        budget: number,
        originalLanguage: string,
        overview: string,
        status: string,
        video: string,
        posterPath: string,
        backdropPath: string,
        voteAverage: number,
        voteCount: number,
        runtime: number,
        releaseDate: string,
        deleteFlag: boolean,
        genres: Array<{ id: number; name: string }>,
    ) {
        this._id = id;
        this._title = title;
        this._adult = adult;
        this._budget = budget;
        this._originalLanguage = originalLanguage;
        this._overview = overview;
        this._status = status;
        this._video = video;
        this._posterPath = posterPath;
        this._backdropPath = backdropPath;
        this._voteAverage = voteAverage;
        this._voteCount = voteCount;
        this._runtime = runtime;
        this._releaseDate = releaseDate;
        this._deleteFlag = deleteFlag;
        this._genres = genres;
    }

    /**
     * Getter id
     * @return {number}
     */
    public get id(): number {
        return this._id;
    }

    /**
     * Getter title
     * @return {string}
     */
    public get title(): string {
        return this._title;
    }

    /**
     * Getter adult
     * @return {boolean}
     */
    public get adult(): boolean {
        return this._adult;
    }

    /**
     * Getter budget
     * @return {number}
     */
    public get budget(): number {
        return this._budget;
    }

    /**
     * Getter originalLanguage
     * @return {string}
     */
    public get originalLanguage(): string {
        return this._originalLanguage;
    }

    /**
     * Getter overview
     * @return {string}
     */
    public get overview(): string {
        return this._overview;
    }

    /**
     * Getter status
     * @return {string}
     */
    public get status(): string {
        return this._status;
    }

    /**
     * Getter video
     * @return {string}
     */
    public get video(): string {
        return this._video;
    }

    /**
     * Getter posterPath
     * @return {string}
     */
    public get posterPath(): string {
        return this._posterPath;
    }

    /**
     * Getter backdropPath
     * @return {string}
     */
    public get backdropPath(): string {
        return this._backdropPath;
    }

    /**
     * Getter voteAverage
     * @return {number}
     */
    public get voteAverage(): number {
        return this._voteAverage;
    }

    /**
     * Getter voteCount
     * @return {number}
     */
    public get voteCount(): number {
        return this._voteCount;
    }

    /**
     * Getter runtime
     * @return {number}
     */
    public get runtime(): number {
        return this._runtime;
    }

    /**
     * Getter releaseDate
     * @return {string}
     */
    public get releaseDate(): string {
        return this._releaseDate;
    }

    /**
     * Getter deleteFlag
     * @return {boolean}
     */
    public get deleteFlag(): boolean {
        return this._deleteFlag;
    }

    /**
     * Getter deleteFlag
     * @return {Array<{id:number, name:string}>}
     */
    public get genres(): Array<{ id: number; name: string }> {
        return this.genres;
    }

    /**
     * Setter id
     * @param {number} value
     */
    public set id(value: number) {
        this._id = value;
    }

    /**
     * Setter title
     * @param {string} value
     */
    public set title(value: string) {
        this._title = value;
    }

    /**
     * Setter adult
     * @param {boolean} value
     */
    public set adult(value: boolean) {
        this._adult = value;
    }

    /**
     * Setter budget
     * @param {number} value
     */
    public set budget(value: number) {
        this._budget = value;
    }

    /**
     * Setter originalLanguage
     * @param {string} value
     */
    public set originalLanguage(value: string) {
        this._originalLanguage = value;
    }

    /**
     * Setter overview
     * @param {string} value
     */
    public set overview(value: string) {
        this._overview = value;
    }

    /**
     * Setter status
     * @param {string} value
     */
    public set status(value: string) {
        this._status = value;
    }

    /**
     * Setter video
     * @param {string} value
     */
    public set video(value: string) {
        this._video = value;
    }

    /**
     * Setter posterPath
     * @param {string} value
     */
    public set posterPath(value: string) {
        this._posterPath = value;
    }

    /**
     * Setter backdropPath
     * @param {string} value
     */
    public set backdropPath(value: string) {
        this._backdropPath = value;
    }

    /**
     * Setter voteAverage
     * @param {number} value
     */
    public set voteAverage(value: number) {
        this._voteAverage = value;
    }

    /**
     * Setter voteCount
     * @param {number} value
     */
    public set voteCount(value: number) {
        this._voteCount = value;
    }

    /**
     * Setter runtime
     * @param {number} value
     */
    public set runtime(value: number) {
        this._runtime = value;
    }

    /**
     * Setter releaseDate
     * @param {string} value
     */
    public set releaseDate(value: string) {
        this._releaseDate = value;
    }

    /**
     * Setter deleteFlag
     * @param {boolean} value
     */
    public set deleteFlag(value: boolean) {
        this._deleteFlag = value;
    }

    /**
     * Setter deleteFlag
     * @param {Array<{id:number, name:string}>}} value
     */
    public set genres(value: Array<{ id: number; name: string }>) {
        this._genres = value;
    }
}
