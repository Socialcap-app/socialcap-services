async function fetchData() {

  const apiKey = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJlYzNjNmUyNTRkMGI0MmRlYmQ5MzlkOWE3YmQ3ZGRkZCIsInNlc3Npb25fa2V5IjoiZGEwZDgxNmU5ZmMzNDNiYmFkZWY4ODI2ZjI5MWNiNDciLCJjcmVhdGVkX3V0YyI6IjIwMjQtMDItMjNUMTk6MTM6NDIuMTM0WiIsImV4cGlyZXNfdXRjIjpudWxsLCJpYXQiOjE3MDg3MTU2MjJ9.PHvzas7Rs2tR886NRo47pKxDOkhQJ7tpzUA-lDUrHlk";

  const baseUrl = 'https://api.socialcap.dev/api'

  const params = '{"uid":"70ed0f69af174c399b1958c01dc191c0"}'

  const fullUrl = `${baseUrl}/query/get_community?params=${params}`

  try {
    const response = await fetch(`${fullUrl}`, {
      "headers": {
        "accept": "application/json",
        "authorization": apiKey,
      },
      "body": null,
      "method": "GET"      
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}

fetchData();
