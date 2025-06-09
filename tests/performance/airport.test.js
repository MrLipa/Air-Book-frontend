import http from 'k6/http';
import { check, sleep, group } from 'k6';

export function airportTest(token) {
  group('Airport - Get All Airports', () => {
    const res = http.get('http://localhost:3000/airport/getAllAirports', {
      headers: { Authorization: `Bearer ${token}` },
    });

    check(res, {
      'status is 200': (r) => r.status === 200,
      'response is array': (r) => Array.isArray(r.json()),
    });

    sleep(1);
  });
}
