import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, arg: any): any { // value es el texto que buscas y arg son las posibles opciones
    const searchResult = [];
    if (value) {
      for (const post of value) {
        if(post.name.toLowerCase().indexOf(arg.toLowerCase()) > -1 || post.lastName.toLowerCase().indexOf(arg.toLowerCase()) > -1 || post.email.toLowerCase().indexOf(arg.toLowerCase()) > -1 || post.rol.toLowerCase().indexOf(arg.toLowerCase()) > -1 || post.state.toLowerCase().indexOf(arg.toLowerCase()) > -1){
          searchResult.push(post);
        }
      }
    }
    return searchResult
  }

}
