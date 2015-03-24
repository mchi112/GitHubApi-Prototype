///<reference path="Scripts/typings/jquery/jquery.d.ts"/>

interface ICallback
{
    (response: any, textStatus: string, jqXHR: any): void;
}

class GitHubApi
{
    private baseUrl: string;

    constructor()
    {
        this.baseUrl = "https://api.github.com";
    }

    public GetCommitComparison(username: string, repo: string, base: string, head: string, success: ICallback, error: ICallback)
    {
        this.SendHttpRequest("/repos/" + username + "/" + repo + "/compare/" + base + "..." + head, "GET", success, error);
    }

    public GetCurrentUserRepos(success: ICallback, error: ICallback)
    {
        this.SendHttpRequest("/user/repos", "GET", success, error);
    }

    public GetCollaborators(username: string, repo: string, success: ICallback, error: ICallback)
    {
        this.SendHttpRequest("/repos/" + username + "/" + repo + "/collaborators", "GET", success, error);
    }

    public GetPullRequests(username: string, repo: string, success: ICallback, error: ICallback)
    {
        this.SendHttpRequest("/repos/" + username + "/" + repo + "/pulls", "GET", success, error);
    }

    public GetRepos(username: string, success: ICallback, error: ICallback) {
        this.SendHttpRequest("/users/" + username + "/repos", "GET", success, error);
    }

    private SendHttpRequest(relativeUrl: string, method: string, success: ICallback, error: ICallback)
    {
        $.ajax({
            url: this.baseUrl + relativeUrl,
            dataType: "jsonp",
            method: method,
            success: success,
            error: error
        });
    }
}