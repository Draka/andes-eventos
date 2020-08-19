export class Vars {
  static b = $('body')

  static urlApi = ''

  static imgNoAvailable= '/images/imagen_no_disponible.svg'

  static store= Vars.b.data('store')

  static place= Vars.b.data('defaultPlace')

  static statusToDate(arr:Array<any>, status: string) {
    const st = arr.filter((s) => s.status === status);
    if (!st.length) {
      return '';
    }
    return Vars.format(st[0].date);
  }

  static format(str:string) {
    if (!str) return '';
    const days = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const d = new Date();
    d.setTime(Date.parse(str));
    return `${d.getDate()} de ${days[d.getMonth()]} de ${d.getFullYear()}`;
  }

  static formatSimple(str:string) {
    const d = new Date(Date.parse(str));
    return `${d.getFullYear()}-${this.zeroPadded(d.getMonth() + 1)}-${this.zeroPadded(d.getDate())} ${this.zeroPadded(d.getHours())}:${this.zeroPadded(d.getMinutes())}`;
  }

  static zeroPadded(val) {
    if (val >= 10) return val;
    return `0${val}`;
  }

  static formatMoney(number:number, decPlaces = 0, simbol = '$', decSep = ',', thouSep = '.') {
    const re = `\\d(?=(\\d{${3}})+${decPlaces > 0 ? '\\D' : '$'})`;
    // eslint-disable-next-line no-bitwise
    const num = number.toFixed(Math.max(0, ~~decPlaces));
    return simbol + num.replace('.', thouSep).replace(new RegExp(re, 'g'), `$&${decSep}`);
  }

  static getParameterByName(name:string, url:string = window.location.href) {
    name = name.replace(/[[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  static capitalize(input: string) {
    return input[0].toUpperCase() + input.slice(1);
  }
}
