import { Component } from '@angular/core';
import { toast } from 'angular2-materialize';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  private secretUnlock = false;

  secret() {
    if (!this.secretUnlock) {
      toast('Secreto desbloqueado', 3000);
      let audio = new Audio('../assets/secret/01 - super mario kart.mp3');
      audio.play();
      let karts = document.getElementById('karts');
      karts.classList.remove('hide');
      karts.classList.add('cross-screen');
      document.addEventListener('animationend', () => {
        karts.classList.add('hide');
        this.secretUnlock = true;
      }, false);
    }
  }

}
