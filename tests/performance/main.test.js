import { airportTest } from './airport.test.js';
import { flightTest } from './flight.test.js';
import { userTest } from './user.test.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mbyI6eyJ1c2VySWQiOjIsImVtYWlsIjoiYW5uYS5rb3dhbHNrYUBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiJ9LCJpYXQiOjE3NDkyMzE4ODksImV4cCI6MTc4MDc2Nzg4OX0.oQQ5AH2HsScSqPTU2YF3Od48-XrLeiX8fjuYuFoQOKQ';

export const options = {
  scenarios: {
    airport: {
      executor: 'constant-vus',
      exec: 'airportScenario',
      vus: 10,
      duration: '5s',
    },
    flight: {
      executor: 'constant-vus',
      exec: 'flightScenario',
      vus: 10,
      duration: '5s',
    },
    user: {
      executor: 'constant-vus',
      exec: 'userScenario',
      vus: 20,
      duration: '5s',
    },
  },
};

export function airportScenario() {
  airportTest(token);
}

export function flightScenario() {
  flightTest(token);
}

export function userScenario() {
  userTest(token);
}

export function handleSummary(data) {
  return {
    'logs/performance-report.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}