import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
  eventos: any[] = []; // Arreglo de eventos (puedes cargarlo desde el localStorage)
  eventosNoFinalizados: any[] = []; // Arreglo de eventos no finalizados
  eventosFinalizados: any[] = []; // Arreglo de eventos finalizados

  constructor() { }

  ngOnInit(): void {
    this.cargarEventosDesdeLocalStorage();
    this.separarEventosPorFinalizacion();
  }

  cargarEventosDesdeLocalStorage(): void {
    const eventosGuardados = localStorage.getItem('eventos');
    if (eventosGuardados) {
      this.eventos = JSON.parse(eventosGuardados);
    }
  }

  guardarEventosEnLocalStorage(): void {
    localStorage.setItem('eventos', JSON.stringify(this.eventos));
  }

  separarEventosPorFinalizacion(): void {
    this.eventosNoFinalizados = this.eventos.filter(evento => !evento.finalizado);
    this.eventosNoFinalizados.sort((a, b) => {
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);
      return fechaA.getTime() - fechaB.getTime();
    });

    this.eventosFinalizados = this.eventos.filter(evento => evento.finalizado);
    this.eventosFinalizados.sort((a, b) => {
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);
      return fechaA.getTime() - fechaB.getTime();
    });
  }

  cambiarEstadoEvento(evento: any): void {
    evento.finalizado = !evento.finalizado;
    this.guardarEventosEnLocalStorage();
    this.separarEventosPorFinalizacion(); // Llamar a separarEventosPorFinalizacion después de guardar los eventos
  }

  editarEvento(evento: any): void {
    const titulo = prompt('Ingrese el nuevo título', evento.titulo);
    const descripcion = prompt('Ingrese la nueva descripción', evento.descripcion);
    const horaInicio = prompt('Ingrese la nueva hora de inicio (formato HH:mm)', evento.horaInicio);
    const horaFin = prompt('Ingrese la nueva hora de fin (formato HH:mm)', evento.horaFin);
    const finalizadoString = prompt('El evento está finalizado? (true/false)', evento.finalizado.toString());

    // Validar y actualizar los datos del evento
    if (titulo && descripcion && horaInicio && horaFin && finalizadoString !== null) {
      evento.titulo = titulo;
      evento.descripcion = descripcion;
      evento.horaInicio = horaInicio;
      evento.horaFin = horaFin;
      evento.finalizado = finalizadoString.toLowerCase() === 'true';

      // Guardar los eventos actualizados en el almacenamiento local y actualizar la lista
      this.guardarEventosEnLocalStorage();
      this.separarEventosPorFinalizacion();
    }
  }
}
