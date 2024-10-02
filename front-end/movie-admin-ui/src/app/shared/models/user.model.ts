export class User {
    private _id: string;
    private _username: string;
    private _email: string;
    private _name: string;
    private _bio: string;
    private _avatar: string;
    private _onboarded: boolean;
    private _createdAt: string;
    private _modifiedAt: string;
    private _lastSignedIn: string;

    constructor(
        id: string,
        username: string,
        email: string,
        name: string,
        bio: string,
        avatar: string,
        onboarded: boolean,
        createdAt: string,
        modifiedAt: string,
        lastSignedIn: string,
    ) {
        this._id = id;
        this._username = username;
        this._email = email;
        this._name = name;
        this._bio = bio;
        this._avatar = avatar;
        this._onboarded = onboarded;
        this._createdAt = createdAt;
        this._modifiedAt = modifiedAt;
        this._lastSignedIn = lastSignedIn;
    }

    /**
     * Getter id
     * @return {string}
     */
    public get id(): string {
        return this._id;
    }

    /**
     * Getter username
     * @return {string}
     */
    public get username(): string {
        return this._username;
    }

    /**
     * Getter email
     * @return {string}
     */
    public get email(): string {
        return this._email;
    }

    /**
     * Getter name
     * @return {string}
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Getter bio
     * @return {string}
     */
    public get bio(): string {
        return this._bio;
    }

    /**
     * Getter avatar
     * @return {string}
     */
    public get avatar(): string {
        return this._avatar;
    }

    /**
     * Getter onboarded
     * @return {boolean}
     */
    public get onboarded(): boolean {
        return this._onboarded;
    }

    /**
     * Getter createdAt
     * @return {string}
     */
    public get createdAt(): string {
        return this._createdAt;
    }

    /**
     * Getter modifiedAt
     * @return {string}
     */
    public get modifiedAt(): string {
        return this._modifiedAt;
    }

    /**
     * Getter lastSignedIn
     * @return {string}
     */
    public get lastSignedIn(): string {
        return this._lastSignedIn;
    }

    /**
     * Setter id
     * @param {string} value
     */
    public set id(value: string) {
        this._id = value;
    }

    /**
     * Setter username
     * @param {string} value
     */
    public set username(value: string) {
        this._username = value;
    }

    /**
     * Setter email
     * @param {string} value
     */
    public set email(value: string) {
        this._email = value;
    }

    /**
     * Setter name
     * @param {string} value
     */
    public set name(value: string) {
        this._name = value;
    }

    /**
     * Setter bio
     * @param {string} value
     */
    public set bio(value: string) {
        this._bio = value;
    }

    /**
     * Setter avatar
     * @param {string} value
     */
    public set avatar(value: string) {
        this._avatar = value;
    }

    /**
     * Setter onboarded
     * @param {boolean} value
     */
    public set onboarded(value: boolean) {
        this._onboarded = value;
    }

    /**
     * Setter createdAt
     * @param {string} value
     */
    public set createdAt(value: string) {
        this._createdAt = value;
    }

    /**
     * Setter modifiedAt
     * @param {string} value
     */
    public set modifiedAt(value: string) {
        this._modifiedAt = value;
    }

    /**
     * Setter lastSignedIn
     * @param {string} value
     */
    public set lastSignedIn(value: string) {
        this._lastSignedIn = value;
    }
}
