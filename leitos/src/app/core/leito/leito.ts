export class Leito {
  setor: String;
  numero: String;
  status: String;

  constructor(object?: any) {
    for (var prop in object) {
      this[prop.toLowerCase()] = object[prop];
    }
  }
}
