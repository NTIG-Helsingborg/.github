import {
    CURRENT_SCHOOL_YEAR_TE4,
    TE4_PREFIX,
    getFilteredOrgRepoList,
    getOrgRepos,
    ignoredRepos,
} from "../../utils/github.js";

export default async function (answers: any) {
    const repos = await getFilteredOrgRepoList("NTIG-Helsingborg", TE4_PREFIX);

    // Group repos by year and format them as markdown list items
    const groupedRepoList: { [year: string]: string[] } = {};
    for (const repo of repos) {
        const year = repo.name.split("_")[1];
        if (!groupedRepoList[year]) {
            groupedRepoList[year] = [];
        }
        groupedRepoList[year].push(
            `- [${repo.name}](${repo.html_url})${
                repo.description ? ` - ${repo.description}` : ""
            }`
        );
    }

    // Sort the years in descending order and format them as markdown headers
    const repoList = Object.keys(groupedRepoList)
        .sort()
        .reverse()
        .map((year) => {
            const repos = groupedRepoList[year];
            return `## ${year.replace('-', '/')}\n${repos.join("\n")}`;
        })
        .join("\n");

    return /* markdown */ `
# TE4 projekt
${repoList}`;
}
