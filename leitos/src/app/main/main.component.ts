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
  setores = new Set();

  constructor(private leitoService: LeitoService) {}

  ngOnInit() {
    this.leitoService.list().subscribe(leitos => {
      this.leitos = leitos;
      this.leitos.forEach(leito => {
        this.setores.add(leito.setor)
      });
    })
  }

  getLeitos(setor) {
    let leitos = [];
    this.leitos.forEach((leito: Leito) => {
      if (leito.setor == setor) leitos.push(leito);
    });
    return leitos;
  }

  sortSetor(){
  }

  transformText(text){
    return text.replace(/\D+/,'').padStart(3,'0')
  }
}
