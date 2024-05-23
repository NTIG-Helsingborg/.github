import {
    CURRENT_SCHOOL_YEAR_TE4,
    getFilteredOrgRepoList,
} from "../../utils/github.js";

export default async function (answers: any) {
    const repos = await getFilteredOrgRepoList(
        "NTIG-Helsingborg",
        CURRENT_SCHOOL_YEAR_TE4
    );

    // Format repos as markdown list items
    const repoList = repos
        .map((repo) => {
            return `- [${repo.name}](${repo.html_url})${
                repo.description ? ` - ${repo.description}` : ""
            }`;
        })
        .join("\n");

    return /* markdown */ `
[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/te-4-nti-gymnasiet-helsingborg/posts/?feedView=all)
# NTI Gymnasiet Helsingborg

## Årets TE4 projekt
${repoList}

[Tidigare år](https://github.com/NTIG-Helsingborg/.github/blob/main/TE4/projects.md)
`;
}
