export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  const data = await fetch(`${process.env.URL}/api/stats?username=${username}`)
    .then(res => res.json());

  const { stats, rank } = data;

  const svg = `
  <svg width="400" height="130" xmlns="http://www.w3.org/2000/svg">
    <style>
      .title { fill: #fff; font: 600 15px sans-serif; }
      .label { fill: #7aa2ff; font: 12px sans-serif; }
      .value { fill: #00eaff; font: 700 12px sans-serif; }
    </style>

    <rect width="100%" height="100%" rx="10" fill="#161b22"/>

    <text x="20" y="25" class="title">${username}'s GitHub Stats</text>

    <text x="20" y="55" class="label">Stars:</text>
    <text x="130" y="55" class="value">${stats.stars}</text>

    <text x="20" y="75" class="label">Followers:</text>
    <text x="130" y="75" class="value">${stats.followers}</text>

    <circle cx="330" cy="65" r="35" stroke="#007bff" stroke-width="6" fill="none" />
    <text x="312" y="70" fill="#00ff9d" font-size="22px" font-weight="800">${rank.level}</text>
  </svg>
  `;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "max-age=1800",
    },
  });
}
