import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // server

    return axios.create({
      baseURL: 'http:///www.ticket-microservice.site/',
      headers: req.headers,
    });
  } else {
    //  browser
    return axios.create({
      baseUrl: '/',
    });
  }
};
