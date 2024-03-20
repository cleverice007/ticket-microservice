import { Publisher, Subjects, TicketUpdatedEvent } from '@ticket-microservice/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
