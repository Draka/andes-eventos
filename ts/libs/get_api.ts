/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-void */
/* eslint-disable class-methods-use-this */
import '../util/sclib.d';
import { Vars } from './vars';

export class GetApi {
  h = {}

  constructor(
    token: string
  ) {
    if (token) {
      this.h = {
        Authorization: `bearer ${token}`
      };
    }
  }

  g(path: string) {
    return sclib.ajax({
      url: Vars.urlApi + path,
      type: 'GET',
      headers: this.h
    });
  }

  p(path: string, data = {}) {
    return sclib.ajax({
      url: Vars.urlApi + path,
      type: 'POST',
      headers: this.h,
      data: JSON.stringify(data)
    });
  }

  d(path: string) {
    return sclib.ajax({
      url: Vars.urlApi + path,
      type: 'DELETE',
      headers: this.h
    });
  }
}
