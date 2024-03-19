"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./errors/bad-request-error"), exports);
__exportStar(require("./errors/custom-error"), exports);
__exportStar(require("./errors/not-authorized-error"), exports);
__exportStar(require("./errors/not-found-error"), exports);
__exportStar(require("./errors/request-validation-error"), exports);
__exportStar(require("./middlewares/current-user"), exports);
__exportStar(require("./middlewares/error-handler"), exports);
__exportStar(require("./middlewares/require-auth"), exports);
__exportStar(require("./middlewares/validate-request"), exports);


// npm run pub
// tickets  -> npm update @ticket-microservice/common
// npm run test
//294 cretae nats test

//295 kubectl port-forward nats-depl-5d7d7d7d7d-5d7d7 4222:4222