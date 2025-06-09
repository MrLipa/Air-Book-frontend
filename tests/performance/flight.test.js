import http from 'k6/http';
import { check, sleep, group } from 'k6';

export function flightTest(token) {
  group('Flight - Get All Flights', () => {
    const res = http.get('http://localhost:3000/flight/getAllFlights', {
      headers: { Authorization: `Bearer ${token}` },
    });
    check(res, {
      'status is 200': (r) => r.status === 200,
      'response is array': (r) => Array.isArray(r.json()),
    });
    sleep(1);
  });
}
