// billero.app entry for the Worker winter-scene-1d20-billero (static assets, run_worker_first).
// Language router (WEB-008) and anonymous /app counting (WEB-012) in front of the assets.
// env.STATS (D1 billero-stats) is optional: without the binding nothing is counted.
// Deploy layout: billero.app/docs/strategy/measurement.md §9.
import { handleRequest } from './language-router.mjs';

export default {
  fetch: (request, env, ctx) => handleRequest(request, req => env.ASSETS.fetch(req), { env, ctx }),
};
