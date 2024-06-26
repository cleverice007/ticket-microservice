import { Publisher, OrderCreatedEvent, Subjects } from '@ticket-microservice/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
