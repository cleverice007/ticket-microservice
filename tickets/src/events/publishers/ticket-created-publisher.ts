import { Publisher, Subjects, TicketCreatedEvent } from '@ticket-microservice/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
