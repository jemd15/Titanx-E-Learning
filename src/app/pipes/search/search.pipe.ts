import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const searchResult = [];
    if (value) {
      for (const post of value) {
        if(post.name.toLowerCase().indexOf(arg) > -1 || post.lastName.toLowerCase().indexOf(arg) > -1 || post.email.toLowerCase().indexOf(arg) > -1 || post.rol.toLowerCase().indexOf(arg) > -1 || post.state.toLowerCase().indexOf(arg) > -1){
          console.log('si')
          searchResult.push(post)
        }
      }
    }
    return searchResult
  }

}
