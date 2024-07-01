import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteDBConnection, SQLiteConnection } from '@capacitor-community/sqlite';
import { Platform } from '@ionic/angular';
import { Cita } from 'src/app/models/citaModel';
import { Capacitor } from '@capacitor/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private db: SQLiteDBConnection | undefined;
  private sqlite: SQLiteConnection;
  private plataforma: string | undefined;
  private readonly DB_NAME = 'citasDB';
  private readonly DB_ENCRYPTADA = false;
  private readonly DB_MODE = 'no-encryption';
  private readonly DB_VERSION = 1;
  private readonly DB_READ_ONLY = false;
  private readonly DB_SQL_TABLAS = `
    CREATE TABLE IF NOT EXISTS citas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT,
      author TEXT
    )
  `;

  private citasSubject = new BehaviorSubject<Cita[]>([]);
  public citas$: Observable<Cita[]> = this.citasSubject.asObservable();

  constructor(private platform: Platform) {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
    this.platform.ready().then(() => {
      this.iniciarPlugin();
    });
  }

  private async _iniciarPluginWeb(): Promise<void> {
    await customElements.whenDefined('jeep-sqlite');
    const jeepSqliteEl = document.querySelector('jeep-sqlite');
    if (jeepSqliteEl != null) {
      await this.sqlite.initWebStore();
    }
  }

  private async abrirConexion() {
    const ret = await this.sqlite.checkConnectionsConsistency();
    const isConn = (await this.sqlite.isConnection(this.DB_NAME, false)).result;
    if (ret.result && isConn) {
      this.db = await this.sqlite.retrieveConnection(this.DB_NAME, false);
    } else {
      this.db = await this.sqlite.createConnection(
        this.DB_NAME,
        this.DB_ENCRYPTADA,
        this.DB_MODE,
        this.DB_VERSION,
        this.DB_READ_ONLY
      );
    }
    await this.db.open();
  }

  private async verificarConexion() {
    if (!this.db) {
      await this.iniciarPlugin();
    }
  }

  public async iniciarPlugin() {
    this.plataforma = Capacitor.getPlatform();
    if (this.plataforma === 'web') {
      await this._iniciarPluginWeb();
    }
    await this.abrirConexion();
    await this.db?.execute(this.DB_SQL_TABLAS);
    await this.cargarCitas();
  }

  private async cargarCitas() {
    await this.verificarConexion();
    if (!this.db) {
      throw new Error('La base de datos no está inicializada');
    }
    try {
      const res = await this.db.query('SELECT * FROM citas');
      const citas = res.values as Cita[];
      this.citasSubject.next(citas);
    } catch (e) {
      console.error('Error al cargar las citas', e);
    }
  }

  async obtenerCitaAleatoria(): Promise<Cita | null> {
    await this.verificarConexion();
    if (!this.db) {
      throw new Error('La base de datos no está inicializada');
    }
    try {
      const res = await this.db.query('SELECT * FROM citas');
      const citas = res.values as Cita[];
      if (citas.length === 0) {
        return null;
      }
      const indiceAleatorio = Math.floor(Math.random() * citas.length);
      return citas[indiceAleatorio];
    } catch (e) {
      console.error('Error al obtener una cita aleatoria', e);
      return null;
    }
  }

  async agregarCita(cita: Cita) {
    await this.verificarConexion();
    if (!this.db) {
      throw new Error('La base de datos no está inicializada');
    }
    try {
      const query = `INSERT INTO citas (text, author) VALUES (?, ?)`;
      const values = [cita.text, cita.author];
      await this.db.run(query, values);
      await this.cargarCitas(); // Recargar las citas después de agregar una nueva
    } catch (e) {
      console.error('Error al agregar la cita', e);
    }
  }

  async eliminarCita(id: number) {
    await this.verificarConexion();
    if (!this.db) {
      throw new Error('La base de datos no está inicializada');
    }
    try {
      await this.db.run('DELETE FROM citas WHERE id = ?', [id]);
      await this.cargarCitas(); // Recargar las citas después de eliminar una
    } catch (e) {
      console.error('Error al eliminar la cita', e);
    }
  }

  async obtenerTodasLasCitas(): Promise<Cita[]> {
    await this.verificarConexion();
    if (!this.db) {
      throw new Error('La base de datos no está inicializada');
    }
    try {
      const res = await this.db.query('SELECT * FROM citas');
      return res.values as Cita[];
    } catch (e) {
      console.error('Error al obtener todas las citas', e);
      return [];
    }
  }
}
