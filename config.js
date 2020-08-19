/**
 * IMPORTANTE, USE SUS VARIABLES DE ENTORNO PARA CONFIGURAR
 * NO SUBA NADA AL REPO
 */

const enviroment = {
  v: '1.0.0',
  db: {
    dialect: process.env.DB || 'sqlite'
  },
  keySecret: process.env.KEY_SECRET || 'key12345678',
  log: process.env.LOG || 'dev',
  site: {
    name: 'Eventos'
  }
};

if (enviroment.db.dialect === 'sqlite') {
  enviroment.db.storage = 'database.sqlite';
}
module.exports = enviroment;
