import {
    Subjects,
    Publisher,
    ExpirationCompleteEvent,
  } from '@ticket-microservice/common';
  
  export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  }
  