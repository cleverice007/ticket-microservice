import { Subjects, Publisher, OrderCancelledEvent } from '@ticket-microservice/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
