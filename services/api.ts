import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://unindodestinos-prod-env.eba-2peq7mnh.us-east-1.elasticbeanstalk.com',
  baseURL: "http://localhost:5000"

});

export default api;
