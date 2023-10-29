import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params, route, url }) {
    if (true) {
      return { 
        host: "localhost",
        port: 3080,
        protocol: "http"
      }; 
    }
}
