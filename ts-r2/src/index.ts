
interface Env {
	MY_BUCKET: R2Bucket
}
  
  export default {
	async fetch(request: Request, env: Env) {
	  const url = new URL(request.url);
	  const key = url.pathname.slice(1);
  
	  if (request.method === 'OPTIONS') {
		// Handle CORS preflight requests
		return new Response(null, {
		  status: 204,
		  headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
			'Access-Control-Max-Age': '86400', // Optional: cache the preflight response for 1 day
		  },
		});
	  }
  
	  let response;
	  switch (request.method) {
		case 'PUT':
		  console.log('=======', request.body);
		  await env.MY_BUCKET.put(key, request.body);
		  response = new Response(`Put ${key} successfully!`);
		  break;
  
		case 'GET':
		  const object = await env.MY_BUCKET.get(key);
  
		  if (object === null) {
			response = new Response('Object Not Found', { status: 404 });
			break;
		  }
  
		  const headers = new Headers();
		  object.writeHttpMetadata(headers);
		  headers.set('etag', object.httpEtag);
  
		  response = new Response(object.body, {
			headers,
		  });
		  break;
  
		default:
		  response = new Response('Method Not Allowed', {
			status: 405,
			headers: {
			  Allow: 'OPTIONS, PUT, GET, DELETE',
			},
		  });
	  }
  
	  // Add CORS headers to the response
	  response.headers.set('Access-Control-Allow-Origin', '*');
	  // Optionally, add other CORS headers if needed
	  // response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
	  // response.headers.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  
	  return response;
	},
  };
  