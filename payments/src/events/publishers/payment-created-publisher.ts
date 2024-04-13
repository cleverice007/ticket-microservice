import { Subjects, Publisher, PaymentCreatedEvent } from '@ticket-microservice/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
