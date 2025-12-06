import calculateRank from "@/lib/calculateRank";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return new Response(JSON.stringify({ error: "Username required" }), {
      status: 400,
    });
  }

  const headers = {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    "User-Agent": "GitHub-Stats-Widget",
  };

  const user = await fetch(`https://api.github.com/users/${username}`, { headers })
    .then(res => res.json());

  const repos = await fetch(user.repos_url, { headers }).then(res => res.json());
  const stars = repos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);

  const stats = {
    all_commits: false,
    commits: user.public_repos * 20, // Placeholder
    prs: user.public_repos,
    issues: 10,
    reviews: 2,
    repos: repos.length,
    stars,
    followers: user.followers,
  };

  const rank = calculateRank(stats);

  return Response.json({ stats, rank });
}
