export class Hall {
  public id: string;
  public name: string;
  public address: string;
  public createdAt: string;
  public modifiedAt: string;

  constructor(id: string, name: string, address: string, createdAt: string, modifiedAt: string) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.createdAt = createdAt;
    this.modifiedAt = modifiedAt;
  }
}
