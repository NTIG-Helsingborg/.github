import { Octokit, type RestEndpointMethodTypes } from "@octokit/rest";

const date = new Date();
const year = date.getFullYear() - 2000; // Subtract 2000 to get the current year in YY format
const month = date.getMonth() + 1; // Add 1 to get the current month

export const TE4_PREFIX = "TE4_";
export const CURRENT_SCHOOL_YEAR = month >= 8 ? `${year}-${year + 1}` : `${year - 1}-${year}`; // If the current month is August or later, the school year is the current year to the next year, otherwise it's the previous year to the current year
export const CURRENT_SCHOOL_YEAR_TE4 = `${TE4_PREFIX}${CURRENT_SCHOOL_YEAR}_`;

const octokit = new Octokit();

const repoCache = new Map<
    string,
    RestEndpointMethodTypes["repos"]["listForOrg"]["response"]['data']
>();

export async function getOrgRepos(org: string) {
    if (repoCache.has(org)) {
        return repoCache.get(org)!;
    }

    const { data } = await octokit.repos.listForOrg({
        org,
        type: "public",
    });

    repoCache.set(org, data);
    return data;
}

export const ignoredRepos = [
    '.github',
]

export async function getFilteredOrgRepoList(org: string, predicate: string) {
    const repos = await getOrgRepos(org);

    return repos.filter((repo) => !ignoredRepos.includes(repo.name) && repo.name.startsWith(predicate));
}
