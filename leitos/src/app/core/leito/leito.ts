export class Leito {
  setor: string;
  numero: string;
  status: string;
  tipo: string;
  constructor(object?: any) {
    for (var prop in object) {
      this[prop.toLowerCase()] = object[prop];
    }
  }
}
