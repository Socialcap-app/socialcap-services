/**
 * Implement some basic helper routes
 */
import * as fs from "fs";
import { fastify, logger, prisma } from '../global.js';

async function helperRoutes() {

  fastify.get('/', async (request, reply) => {
    return JSON.stringify({
      routes: [
        { title:"Root, show all available routes", 
          verb: "GET", endpoint: "/"},
        { title:"Get the API status (running, version, ...)", 
          verb: "GET", endpoint: "/api/status"},
        { title:"Query some API resource using given method and params", 
          verb: "GET", endpoint: "/api/query/:method", 
          query:"params={...}"},
        { title:"Mutate some API resource using given method and params", 
          verb: "POST", endpoint: "/api/mutation/:method", body:"params={...}"},
      ]
    }, null, 4);
  })
  
  fastify.get('/api/status', async (request, reply) => {
    let isConnected = false;
    let version = null;
    let metrics = null;
    const wantMetrics = 'metrics' in (request.query as any);
    try {
      const pg: any = await prisma.$queryRaw`SELECT version() as version`;
      metrics = await prisma.$metrics.json();
      isConnected = !!pg;
      version = pg[0].version;
    }
    catch (err) {
      isConnected = false;
    }

    return { 
      health: 'running',
      version: '0.1',
      db: {
        connected: isConnected,
        engine: version || 'NO_ENGINE',
        metrics: (wantMetrics && metrics) ? metrics : 'NO_METRICS'
      }
    };
  })
}

export default helperRoutes;
