/**
 * Aunque no lo crea, este script permite usar la funcionalidad de ts que exporta a un solo archivo
 * usarse en una página sin cargar módulos, sin complejidad y con menos líneas
 */
var System = {
    functions: {},
    register: function (name, requires, cb) {
        System.functions[name] = { requires: requires, cb: cb };
    },
    active: function () {
        $.each(System.functions, function (name, fc) {
            var m = fc.cb(function (nameClass, fcClass) {
                fc[nameClass] = fcClass;
            }, { id: name });
            $.each(m.setters, function (i, fcs) {
                fcs(System.functions[fc.requires[i]]);
            });
            m.execute();
        });
    }
};
System.register("libs/vars", [], function (exports_1, context_1) {
    "use strict";
    var Vars;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Vars = /** @class */ (function () {
                function Vars() {
                }
                Vars.statusToDate = function (arr, status) {
                    var st = arr.filter(function (s) { return s.status === status; });
                    if (!st.length) {
                        return '';
                    }
                    return Vars.format(st[0].date);
                };
                Vars.format = function (str) {
                    if (!str)
                        return '';
                    var days = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                    var d = new Date();
                    d.setTime(Date.parse(str));
                    return d.getDate() + " de " + days[d.getMonth()] + " de " + d.getFullYear();
                };
                Vars.formatSimple = function (str) {
                    var d = new Date(Date.parse(str));
                    return d.getFullYear() + "-" + this.zeroPadded(d.getMonth() + 1) + "-" + this.zeroPadded(d.getDate()) + " " + this.zeroPadded(d.getHours()) + ":" + this.zeroPadded(d.getMinutes());
                };
                Vars.zeroPadded = function (val) {
                    if (val >= 10)
                        return val;
                    return "0" + val;
                };
                Vars.formatMoney = function (number, decPlaces, simbol, decSep, thouSep) {
                    if (decPlaces === void 0) { decPlaces = 0; }
                    if (simbol === void 0) { simbol = '$'; }
                    if (decSep === void 0) { decSep = ','; }
                    if (thouSep === void 0) { thouSep = '.'; }
                    var re = "\\d(?=(\\d{" + 3 + "})+" + (decPlaces > 0 ? '\\D' : '$') + ")";
                    // eslint-disable-next-line no-bitwise
                    var num = number.toFixed(Math.max(0, ~~decPlaces));
                    return simbol + num.replace('.', thouSep).replace(new RegExp(re, 'g'), "$&" + decSep);
                };
                Vars.getParameterByName = function (name, url) {
                    if (url === void 0) { url = window.location.href; }
                    name = name.replace(/[[\]]/g, '\\$&');
                    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
                    var results = regex.exec(url);
                    if (!results)
                        return null;
                    if (!results[2])
                        return '';
                    return decodeURIComponent(results[2].replace(/\+/g, ' '));
                };
                Vars.capitalize = function (input) {
                    return input[0].toUpperCase() + input.slice(1);
                };
                Vars.b = $('body');
                Vars.urlApi = '';
                Vars.imgNoAvailable = '/images/imagen_no_disponible.svg';
                Vars.store = Vars.b.data('store');
                Vars.place = Vars.b.data('defaultPlace');
                return Vars;
            }());
            exports_1("Vars", Vars);
        }
    };
});
System.register("libs/get_api", ["../util/sclib.d", "libs/vars"], function (exports_2, context_2) {
    "use strict";
    var vars_1, GetApi;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (_1) {
            },
            function (vars_1_1) {
                vars_1 = vars_1_1;
            }
        ],
        execute: function () {
            GetApi = /** @class */ (function () {
                function GetApi(token) {
                    this.h = {};
                    if (token) {
                        this.h = {
                            Authorization: "bearer " + token
                        };
                    }
                }
                GetApi.prototype.g = function (path) {
                    return sclib.ajax({
                        url: vars_1.Vars.urlApi + path,
                        type: 'GET',
                        headers: this.h
                    });
                };
                GetApi.prototype.p = function (path, data) {
                    if (data === void 0) { data = {}; }
                    return sclib.ajax({
                        url: vars_1.Vars.urlApi + path,
                        type: 'POST',
                        headers: this.h,
                        data: JSON.stringify(data)
                    });
                };
                GetApi.prototype.d = function (path) {
                    return sclib.ajax({
                        url: vars_1.Vars.urlApi + path,
                        type: 'DELETE',
                        headers: this.h
                    });
                };
                return GetApi;
            }());
            exports_2("GetApi", GetApi);
        }
    };
});
System.register("libs/session", ["libs/get_api", "libs/vars"], function (exports_3, context_3) {
    "use strict";
    var get_api_1, vars_2, Session;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (get_api_1_1) {
                get_api_1 = get_api_1_1;
            },
            function (vars_2_1) {
                vars_2 = vars_2_1;
            }
        ],
        execute: function () {
            Session = /** @class */ (function () {
                function Session() {
                    var _a, _b;
                    this.token = localStorage.getItem('token');
                    try {
                        this.user = JSON.parse(localStorage.getItem('user'));
                        if (this.token) {
                            if ((_b = (_a = this.user) === null || _a === void 0 ? void 0 : _a.personalInfo) === null || _b === void 0 ? void 0 : _b.firstname) {
                                $('.userFirstname').html(this.user.personalInfo.firstname.split(' ')[0]);
                            }
                            $('.nologin').hide();
                            $('.login').show();
                        }
                        else {
                            $('.login').hide();
                            $('.nologin').show();
                        }
                    }
                    catch (error) {
                        $('.login').hide();
                        $('.nologin').show();
                    }
                    if ($('#signupForm').length && this.token) {
                        window.location.replace('/');
                    }
                    if ($('#editEvent,#newEvent,.event-view').length && !this.token) {
                        window.location.replace('/');
                    }
                    $('#loginForm').data('post', function (data, cb) {
                        localStorage.setItem('token', data.token);
                        cb();
                    });
                    $('#signupForm').data('post', function (_data, cb) {
                        cb();
                    });
                    this.getApi = new get_api_1.GetApi(this.token);
                    this.find();
                    this.view();
                    this.edit();
                }
                Session.prototype.find = function () {
                    var _this = this;
                    var objs = $('.event-list');
                    if (objs.length) {
                        this.getApi.g('api/events')
                            .done(function (data) {
                            var html = '<table class="small hide-xs striped">'
                                + '<thead>'
                                + '<tr>'
                                + '<th>&nbsp;</th>'
                                + '<th>FECHA</th>'
                                + '<th>NOMBRE</th>'
                                + '<th>CATEGORÍA</th>'
                                + '<th>&nbsp;</th>'
                                + '</tr>'
                                + '</thead>';
                            $.each(data, function (_i, elem) {
                                html += '<tr>'
                                    + ("<td class=\"tc\"><a href=\"/detalle-evento?id=" + elem.id + "\"><i class=\"fas fa-search big\"></i></a></td>")
                                    + ("<td class=\"tl nowrap\">" + vars_2.Vars.format(elem.event_initial_date) + "</td>")
                                    + ("<td class=\"b\">" + elem.event_name + "</td>")
                                    + ("<td>" + elem.event_category + "</td>")
                                    + ("<td class=\"tc\"><button class=\"flat\" data-id=\"" + elem.id + "\"><i class=\"fas fa-trash\"></i></button></td>")
                                    + '</tr>';
                            });
                            html += '</table>';
                            // Mobile
                            html += '<div class="mobile show-xs">';
                            $.each(data, function (_i, elem) {
                                html += '<table class="small striped">'
                                    + ("<tr><th>FECHA</th><td class=\"tl nowrap\">" + vars_2.Vars.format(elem.event_initial_date) + "</td></tr>")
                                    + ("<tr><td colspan=\"2\" class=\"b big\">" + elem.event_name + "</td></tr>")
                                    + ("<tr><th>CATEGOR\u00CDA</th><td class=\"tl nowrap\">" + elem.event_category + "</td></tr>")
                                    + ("<tr><td><a class=\"button primary w-100\" href=\"/detalle-evento?id=" + elem.id + "\">Ver detalles</a></td>")
                                    + ("<td><button class=\"secondary w-100\" data-id=\"" + elem.id + "\">Eliminar</button></td></tr>")
                                    + '</table>';
                            });
                            html += '</div>';
                            objs.html(html);
                            objs.find('button').click(function (event) {
                                var $el = $(event.currentTarget);
                                sclib.modalShow('#delete');
                                $('#delete .delete').unbind('click').click(function () {
                                    _this.getApi.d("api/events/" + $el.data('id'))
                                        .done(function () {
                                        sclib.modalHide('#delete');
                                        _this.find();
                                    });
                                });
                            });
                        });
                    }
                };
                Session.prototype.view = function () {
                    var _this = this;
                    var objs = $('.event-view');
                    if (objs.length) {
                        this.getApi.g("api/events/" + vars_2.Vars.getParameterByName('id'))
                            .done(function (elem) {
                            // Mobile
                            var html = '<table class="small striped">'
                                + ("<tr><td colspan=\"2\" class=\"tc\"><img src=\"" + elem.thumbnail + "\" class=\"h-4\"></td></tr>")
                                + ("<tr><td colspan=\"2\" class=\"tc b big\">" + elem.event_name + "</td></tr>")
                                + ("<tr><th>CATEGOR\u00CDA</th><td class=\"tl nowrap\">" + elem.event_category + "</td></tr>")
                                + ("<tr><th>FECHA INICIO</th><td class=\"tl nowrap\">" + vars_2.Vars.formatSimple(elem.event_initial_date) + "</td></tr>")
                                + ("<tr><th>FECHA FINAL</th><td class=\"tl nowrap\">" + vars_2.Vars.formatSimple(elem.event_final_date) + "</td></tr>")
                                + ("<tr><th>LUGAR</th><td class=\"tl nowrap\">" + elem.event_place + "</td></tr>")
                                + ("<tr><th>DIRECCI\u00D3N</th><td class=\"tl nowrap\">" + elem.event_address + "</td></tr>")
                                + ("<tr><th>TIPO</th><td class=\"tl nowrap\">" + elem.event_type + "</td></tr>")
                                + ("<tr><td colspan=\"2\"><div class=\"tr\"><a class=\"button primary mr-1\" href=\"/editar-evento?id=" + elem.id + "\">Editar</a>")
                                + ("<button class=\"secondary ml-1\" data-id=\"" + elem.id + "\">Eliminar</button></div></td></tr>")
                                + '</table>';
                            $('.name,.name-link').html(elem.event_name);
                            $('.name-link').attr('href', "/detalle-evento?id=" + elem.id);
                            objs.html(html);
                            objs.find('button').click(function (event) {
                                var $el = $(event.currentTarget);
                                sclib.modalShow('#delete');
                                $('#delete .delete').unbind('click').click(function () {
                                    _this.getApi.d("api/events/" + $el.data('id'))
                                        .done(function () {
                                        sclib.modalHide('#delete');
                                        window.location.replace('/');
                                    });
                                });
                            });
                        });
                    }
                };
                Session.prototype.edit = function () {
                    var objs = $('#editEvent');
                    if (objs.length) {
                        this.getApi.g("api/events/" + vars_2.Vars.getParameterByName('id'))
                            .done(function (elem) {
                            objs.attr('action', "/api/events/" + elem.id);
                            $('#event_name').val(elem.event_name);
                            $('#event_category').val(elem.event_category);
                            $('#event_initial_date').val(vars_2.Vars.formatSimple(elem.event_initial_date));
                            $('#event_final_date').val(vars_2.Vars.formatSimple(elem.event_final_date));
                            $('#event_place').val(elem.event_place);
                            $('#event_address').val(elem.event_address);
                            $('#event_type').val(elem.event_type);
                            $('#thumbnail').val(elem.thumbnail);
                            $('.name,.name-link').html(elem.event_name);
                            $('.name-link').attr('href', "/detalle-evento?id=" + elem.id);
                        });
                    }
                };
                return Session;
            }());
            exports_3("Session", Session);
        }
    };
});
System.register("home", ["./libs/define", "libs/session"], function (exports_4, context_4) {
    "use strict";
    var session_1;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (_2) {
            },
            function (session_1_1) {
                session_1 = session_1_1;
            }
        ],
        execute: function () {
            new session_1.Session();
        }
    };
});
System.active();
