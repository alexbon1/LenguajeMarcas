import { Component, ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent {
  vista: string = 'calendario';
  mesActual: Date;
  diasSemana: string[];
  nombreMes: string = '';
  eventos: any[] = [];
  semanas: { numero: number | null, estado: string, eventos?: any[] }[][];
  eventoSeleccionado: any = null;
  pestanaActual: 'agregar' | 'mostrar' | 'borrar' = 'mostrar';

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.mesActual = new Date();
    this.diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    this.semanas = [];
  
    this.cargarEventosDesdeLocalStorage(); // Carga los eventos desde el localStorage
    this.generarCalendario();
    this.actualizarNombreMes();
  
    this.guardarEventosEnLocalStorage(); // Guarda los eventos en el localStorage
  }
  

  obtenerEventosDia(fecha: Date): any[] {
    return this.eventos.filter(evento => {
      const fechaEvento = new Date(evento.fecha);
      return fechaEvento.getFullYear() === fecha.getFullYear() &&
        fechaEvento.getMonth() === fecha.getMonth() &&
        fechaEvento.getDate() === fecha.getDate();
    });
  }
  generarCalendario(): void {
    this.semanas = [];

    const primerDiaMes = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth(), 1);
    const primerDiaSemana = primerDiaMes.getDay();
    const ultimaFecha = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + 1, 0).getDate();

    let diaNumero = 1;

    for (let i = 0; i < 6; i++) {
      let semana: { numero: number | null, estado: string, eventos?: any[] }[] = [];
      for (let j = 0; j < 7; j++) {
        const dia: { numero: number | null, estado: string, eventos?: any[] } = { numero: null, estado: '' };

        if ((i === 0 && j < primerDiaSemana) || diaNumero > ultimaFecha) {
          semana.push(dia);
        } else {
          dia.numero = diaNumero;
          const fecha = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth(), diaNumero);
          dia.estado = fecha.toDateString() === new Date().toDateString() ? 'hoy' : 'pasado';
          dia.eventos = this.obtenerEventosDia(new Date(this.mesActual.getFullYear(), this.mesActual.getMonth(), diaNumero));
          semana.push(dia);
          diaNumero++;
        }
      }
      this.semanas.push(semana);
      if (diaNumero > ultimaFecha) {
        break;
      }
    }
  }
  guardarEventosEnLocalStorage(): void {
    localStorage.setItem('eventos', JSON.stringify(this.eventos));
  }
  cargarEventosDesdeLocalStorage(): void {
    const eventosGuardados = localStorage.getItem('eventos');
    if (eventosGuardados) {
      this.eventos = JSON.parse(eventosGuardados);
    }
  }

  actualizarNombreMes(): void {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    this.nombreMes = meses[this.mesActual.getMonth()] + ' ' + this.mesActual.getFullYear();
  }

  mesAnterior(): void {
    this.mesActual.setMonth(this.mesActual.getMonth() - 1);
    this.resetearCalendario();
    this.actualizarNombreMes();
  }

  mesSiguiente(): void {
    this.mesActual.setMonth(this.mesActual.getMonth() + 1);
    this.resetearCalendario();
    this.actualizarNombreMes();
  }

  resetearCalendario(): void {
    this.semanas = [];
    this.generarCalendario();
    this.changeDetectorRef.detectChanges(); // Forzar la actualización de la vista
  }


  cambiarPestana(pestana: 'agregar' | 'mostrar' | 'borrar'): void {
    if (this.pestanaActual === pestana) {
      this.pestanaActual = 'mostrar'; // Desactivar la pestaña si ya está activa
    } else {
      this.pestanaActual = pestana; // Activar la pestaña seleccionada
    }
  }
  
  

  agregarEvento(dia: { numero: number | null, estado: string, eventos?: any[] }): void {
    if (dia.numero !== null) {
      const titulo = prompt('Introduce el título del evento:');
      const descripcion = prompt('Introduce la descripción del evento:');
      const horaInicio = prompt('Introduce la hora de inicio (formato HH:mm):');
      const horaFin = prompt('Introduce la hora de fin (formato HH:mm):');
      const finalizado = confirm('¿El evento está finalizado?');

      if (titulo) {
        const evento = {
          titulo,
          descripcion,
          horaInicio,
          horaFin,
          finalizado,
          fecha: new Date(this.mesActual.getFullYear(), this.mesActual.getMonth(), dia.numero)
        };
        if (!dia.eventos) {
          dia.eventos = [];
        }
        dia.eventos.push(evento);
        this.eventos.push(evento); // Agrega el evento a la lista global
        this.guardarEventosEnLocalStorage(); // Guarda los eventos en el localStorage
      }
    }
  }

  
  
verEvento(evento: any): void {
  if (evento) {
    const estado = evento.finalizado ? 'Finalizado' : 'No finalizado';
    const mensaje = `Título: ${evento.titulo}\nDescripción: ${evento.descripcion}\nHora de inicio: ${evento.horaInicio}\nHora de fin: ${evento.horaFin}\nEstado: ${estado}`;
    const cambiarEstado = confirm(mensaje + '\n\n¿Deseas cambiar el estado de finalización?');

    if (cambiarEstado) {
      evento.finalizado = !evento.finalizado;
      this.guardarEventosEnLocalStorage(); // Guarda los eventos actualizados en el localStorage
    }
  }
}



  borrarEvento(dia: { numero: number | null, estado: string, eventos?: any[] }, evento: any): void {
    if (dia.eventos && evento) {
      const indiceDia = dia.eventos.indexOf(evento);
      const indiceGlobal = this.eventos.indexOf(evento);
      if (indiceDia !== -1) {
        dia.eventos.splice(indiceDia, 1);
      }
      if (indiceGlobal !== -1) {
        this.eventos.splice(indiceGlobal, 1);
      }
      this.guardarEventosEnLocalStorage(); // Guarda los eventos en el localStorage
    }
  }
  
}
