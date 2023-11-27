
/** Function similar to python format used in i() context
 *  ex: tx = format("I am {} {}", names, surnames);
 * 
 */
function format(template: string, ...args: string[]) {
  let i = 0;
  return template.replace(/{}/g, function () {
    return typeof args[i] != 'undefined' ? args[i++] : '';
  });    
}

/**
 * Helper which provides a context to the format function, 
 * so we can define messages with placeholders:
 * 
 *  , my_full_name: i("I am {} {}")
 * 
 * and we use it as:
 *    
 *    import { i as _ } from "~/i18n/messages"      
 *    ...
 *    const names = "Mario", surnames = "Zito";
 *    console.log( _.my_full_name(names, surnames) );
 */
const i = (template: string) => {
  return (...args: string[]) => format(template, ...args)
}  

/**
 * 
 * Pluralizer ???
function np(n, zero, one, many) {
  if (n === 0) return zero ;
  if (n === 1) return one;
  return many
}
*/

export {
  i, format
}
