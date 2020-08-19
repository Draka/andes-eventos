/* eslint-disable max-len */
import { GetApi } from './get_api';
import { Vars } from './vars';

export class Session {
  getApi: GetApi

  token: string

  user: any

  constructor() {
    this.token = <string>localStorage.getItem('token');
    try {
      this.user = JSON.parse(<string>localStorage.getItem('user'));

      if (this.token) {
        if (this.user?.personalInfo?.firstname) {
          $('.userFirstname').html(this.user.personalInfo.firstname.split(' ')[0]);
        }
        $('.nologin').hide();
        $('.login').show();
      } else {
        $('.login').hide();
        $('.nologin').show();
      }
    } catch (error) {
      $('.login').hide();
      $('.nologin').show();
    }
    if ($('#signupForm').length && this.token) {
      window.location.replace('/');
    }
    if ($('#editEvent,#newEvent,.event-view').length && !this.token) {
      window.location.replace('/');
    }
    $('#loginForm').data('post', (data: any, cb: any) => {
      localStorage.setItem('token', data.token);
      cb();
    });
    $('#signupForm').data('post', (_data: any, cb: any) => {
      cb();
    });

    this.getApi = new GetApi(this.token);
    this.find();
    this.view();
    this.edit();
  }

  find() {
    const objs = $('.event-list');
    if (objs.length) {
      this.getApi.g('api/events')
        .done((data: any) => {
          let html = '<table class="small hide-xs striped">'
            + '<thead>'
            + '<tr>'
            + '<th>&nbsp;</th>'
            + '<th>FECHA</th>'
            + '<th>NOMBRE</th>'
            + '<th>CATEGORÍA</th>'
            + '<th>&nbsp;</th>'
            + '</tr>'
            + '</thead>';

          $.each(data, (_i, elem) => {
            html += '<tr>'
            + `<td class="tc"><a href="/detalle-evento?id=${elem.id}"><i class="fas fa-search big"></i></a></td>`
            + `<td class="tl nowrap">${Vars.format(elem.event_initial_date)}</td>`
            + `<td class="b">${elem.event_name}</td>`
            + `<td>${elem.event_category}</td>`
            + `<td class="tc"><button class="flat" data-id="${elem.id}"><i class="fas fa-trash"></i></button></td>`
            + '</tr>';
          });
          html += '</table>';
          // Mobile
          html += '<div class="mobile show-xs">';
          $.each(data, (_i, elem) => {
            html += '<table class="small striped">'
            + `<tr><th>FECHA</th><td class="tl nowrap">${Vars.format(elem.event_initial_date)}</td></tr>`
            + `<tr><td colspan="2" class="b big">${elem.event_name}</td></tr>`
            + `<tr><th>CATEGORÍA</th><td class="tl nowrap">${elem.event_category}</td></tr>`
            + `<tr><td><a class="button primary w-100" href="/detalle-evento?id=${elem.id}">Ver detalles</a></td>`
            + `<td><button class="secondary w-100" data-id="${elem.id}">Eliminar</button></td></tr>`
            + '</table>';
          });
          html += '</div>';
          objs.html(html);
          objs.find('button').click((event) => {
            const $el = $(event.currentTarget);
            sclib.modalShow('#delete');
            $('#delete .delete').unbind('click').click(() => {
              this.getApi.d(`api/events/${$el.data('id')}`)
                .done(() => {
                  sclib.modalHide('#delete');
                  this.find();
                });
            });
          });
        });
    }
  }

  view() {
    const objs = $('.event-view');
    if (objs.length) {
      this.getApi.g(`api/events/${Vars.getParameterByName('id')}`)
        .done((elem: any) => {
          // Mobile
          const html = '<table class="small striped">'
            + `<tr><td colspan="2" class="tc"><img src="${elem.thumbnail}" class="h-4"></td></tr>`
            + `<tr><td colspan="2" class="tc b big">${elem.event_name}</td></tr>`
            + `<tr><th>CATEGORÍA</th><td class="tl nowrap">${elem.event_category}</td></tr>`
            + `<tr><th>FECHA INICIO</th><td class="tl nowrap">${Vars.formatSimple(elem.event_initial_date)}</td></tr>`
            + `<tr><th>FECHA FINAL</th><td class="tl nowrap">${Vars.formatSimple(elem.event_final_date)}</td></tr>`
            + `<tr><th>LUGAR</th><td class="tl nowrap">${elem.event_place}</td></tr>`
            + `<tr><th>DIRECCIÓN</th><td class="tl nowrap">${elem.event_address}</td></tr>`
            + `<tr><th>TIPO</th><td class="tl nowrap">${elem.event_type}</td></tr>`
            + `<tr><td colspan="2"><div class="tr"><a class="button primary mr-1" href="/editar-evento?id=${elem.id}">Editar</a>`
            + `<button class="secondary ml-1" data-id="${elem.id}">Eliminar</button></div></td></tr>`
            + '</table>';

          $('.name,.name-link').html(elem.event_name);
          $('.name-link').attr('href', `/detalle-evento?id=${elem.id}`);
          objs.html(html);
          objs.find('button').click((event) => {
            const $el = $(event.currentTarget);
            sclib.modalShow('#delete');
            $('#delete .delete').unbind('click').click(() => {
              this.getApi.d(`api/events/${$el.data('id')}`)
                .done(() => {
                  sclib.modalHide('#delete');
                  window.location.replace('/');
                });
            });
          });
        });
    }
  }

  edit() {
    const objs = $('#editEvent');
    if (objs.length) {
      this.getApi.g(`api/events/${Vars.getParameterByName('id')}`)
        .done((elem: any) => {
          objs.attr('action', `/api/events/${elem.id}`);
          $('#event_name').val(elem.event_name);
          $('#event_category').val(elem.event_category);
          $('#event_initial_date').val(Vars.formatSimple(elem.event_initial_date));
          $('#event_final_date').val(Vars.formatSimple(elem.event_final_date));
          $('#event_place').val(elem.event_place);
          $('#event_address').val(elem.event_address);
          $('#event_type').val(elem.event_type);
          $('#thumbnail').val(elem.thumbnail);

          $('.name,.name-link').html(elem.event_name);
          $('.name-link').attr('href', `/detalle-evento?id=${elem.id}`);
        });
    }
  }
}
