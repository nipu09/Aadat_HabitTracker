// Node.js 18+ (no additional packages required)



async function main() {
  const response = await fetch("https://api.api-ninjas.com/v2/quotes?categories=success,wisdom", {
    headers: { 'X-Api-Key': 'H01wMgxsxL9VtjE5yLP6SrpOl8Tb7udXiFH59U0P' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  console.log(await response.json());
}

main().catch(console.error);