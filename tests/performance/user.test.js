import http from 'k6/http';
import { check, sleep } from 'k6';

export function userTest(token) {
  const res = http.get('http://localhost:3000/user/getAllUsers', {
    headers: { Authorization: `Bearer ${token}` },
  });

  check(res, {
    'getAllUsers - status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
