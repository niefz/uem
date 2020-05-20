/**
 * 日志上报
 * @param data
 * @param url
 */
const DB_NAME = 'uem_db';
const DB_VERSION = 1;
const DB_STORE_NAME = 'logger_table';

const DB = {
  db: null,
  ready: function(callback) {
    const self = this;

    if (!window.indexedDB) return callback();

    if (this.db) {
      setTimeout(function() {
        callback(null, self);
      }, 0);
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    if (!request) return callback();

    request.onsuccess = function(evt) {
      self.db = this.result;
      setTimeout(function() {
        callback(null, self);
      }, 500);
    };

    request.onerror = function(evt) {
      callback(evt);
      console.log('indexDB request error');
      return true;
    };

    request.onupgradeneeded = function(evt) {
      const db = evt.currentTarget.result;
      if (!(db.objectStoreNames && db.objectStoreNames.contains(DB_STORE_NAME))) {
        db.createObjectStore(DB_STORE_NAME, { autoIncrement: true });
      }
    };
  },
  getStore: function() {
    const tx = this.db.transaction([DB_STORE_NAME], 'readwrite');
    return tx.objectStore(DB_STORE_NAME);
  },
  addLog: function(log) {
    if (!this.db) {
      this.ready(function(err, db) {
        if (db) db.addLog(log);
      });
    } else {
      this.getStore().add(log);
    }
  },
  getLogs: function(opt, callback) {
    if (!this.db) return;
    const request = this.getStore().openCursor();
    const result = [];
    request.onsuccess = function(e) {
      const cursor = e.target.result;
      if (cursor) {
        if (cursor.value.ht >= opt.start && cursor.value.ht <= opt.end) {
          result.push(cursor.value);
        }
        //# cursor.continue
        cursor['continue']();
      } else {
        callback(null, result);
      }
    };

    request.onerror = function(e) {
      callback(e);
      return true;
    };
  },
  clearDB: function() {
    if (!this.db) return;
    this.getStore().clear();
  },
};

export default DB;
