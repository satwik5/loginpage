import { Pipe, PipeTransform  } from '@angular/core';  
 
 @Pipe ({ 
    name: 'Hashtag' 
 }) 
 
 export class HashtagPipe implements PipeTransform { 
    transform(value): string { 
       let val=value.join(' #')
        return '#'.concat(val);
    } 
 } 