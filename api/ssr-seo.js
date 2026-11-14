import { handleSsrRequest } from './_ssrHandler.js';

export default function handler(req, res) {
  return handleSsrRequest(req, res);
}
