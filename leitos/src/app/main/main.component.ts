import {Component, OnInit} from '@angular/core';
import {LeitoService} from "../core/leito/leito.service";
import {Leito} from "../core/leito/leito";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  leitos: Leito[];
  setoresFiltrados = new Set();
  setoresOrdenados = new Array<String>(7);
  tipoLeito = [];
  statusArray = [
    {id: 'O', desc: 'Ocupado', class: "ocupado"},
    {id: 'L', desc: 'Liberado', class: 'liberado'},
    {id: 'H', desc: 'Higienização', class: 'higienizacao'},
    {id: 'M', desc: 'Manutenção', class: 'manutencao'},
    {id: 'I', desc: 'Interditado', class: 'interditado'},
    {id: 'R', desc: 'Reservado', class: 'reservado'}];

  constructor(private leitoService: LeitoService) {
    this.refresh = this.refresh.bind(this);
  }


  ngOnInit() {
    this.refresh();
    setInterval(this.refresh, 60000);
  }

  refresh() {
    this.leitoService.list().subscribe(leitos => {
      this.leitos = leitos;
      this.leitos.forEach(leito => {
        leito.setor = this.textTransform(leito.setor);
        this.setoresFiltrados.add(leito.setor);
      });
      this.sortSetor();
      this.sortLeitos();
      this.setTipoLeitos()
    })

  }

  sortLeitos() {
    this.leitos.sort((a, b) => {
      const numbA = parseInt(this.removeChar(a.numero));
      const numbB = parseInt(this.removeChar(b.numero));
      if (numbA > numbB) return 1;
      if (numbA < numbB) return -1
    });

    this.leitos.sort((a, b) => {
      if (this.findTipoLeito(a.numero) > this.findTipoLeito(b.numero)) return 1;
      if (this.findTipoLeito(a.numero) < this.findTipoLeito(b.numero)) return -1;
    });
  }

  setTipoLeitos() {
    let setoresVisitados = [];
    this.leitos.forEach(leito => {
      leito.tipo = this.findTipoLeito(leito.numero);
      const key = leito.setor.concat(leito.tipo);
      let visited = setoresVisitados.find(function (setor) {
        return setor == key;
      });

      if (!visited && leito.setor == 'UNIDADE II') {
        leito.tipo = this.findTipoLeito(leito.numero);
        setoresVisitados.push(key);
      } else {
        leito.tipo = '';
      }
    });
  }

  getLeitos(setor) {
    let leitos = [];
    if (this.leitos != undefined) {
      this.leitos.forEach((leito: Leito) => {
        if (leito.setor == setor) leitos.push(leito);
      });
    }
    return leitos;
  }

  findTipoLeito(srt) {
    let sigla = srt.replace(/\d/g, '');
    let tipo = '';
    switch (sigla) {
      case 'EN':
        tipo = 'ENF';
        break;
      case 'ST':
        tipo = 'SUÍTE';
        break;
      case '.C':
        tipo = 'APT';
        break;
      case ' C':
        tipo = 'APT';
        break;
    }
    const checkCondition = this.tipoLeito.find(function (el) {
      return el == tipo
    });
    if (!checkCondition) this.tipoLeito.push(tipo);
    return tipo;
  }

  textTransform(text) {
    let newText = text.replace(/UNIDADE II.*/, 'UNIDADE II');
    newText = newText.replace(/HCOR/, '');
    newText = newText.replace(/EMERGENCIA CARDIOLOGIA/, 'UC');
    newText = newText.replace(/UTI HC/, 'UTI');
    return newText;
  }

  getColor(id) {
    let status = this.statusArray.find(function (status) {
      return status.id == id;
    });
    return status.class;
  }

  sortSetor() {
    let array = Array.from(this.setoresFiltrados);
    array[0] = 'DAY-CLINIC';
    array[1] = 'UNIDADE I ';
    array[2] = 'UNIDADE II';
    array[3] = 'UTI';
    array[4] = 'CTI - URTE';
    array[5] = 'CTI - UPO';
    array[6] = 'UC ';
    this.setoresOrdenados = array;
  }

  removeChar(text) {
    return text.replace(/\D+/, '');
  }

  padText(text) {
    return this.removeChar(text).padStart(3, '0')
  }
}
