///<reference path="Scripts/typings/jquery/jquery.d.ts"/>

module GitHub
{
    interface ISuccessCb
    {
        (response: any, textStatus: string, xhr: JQueryXHR): void;
    }

    interface IErrorCb
    {
        (xhr: JQueryXHR, textStatus: string, errorThrown: string): void;
    }

    interface IStringsSuccessCb
    {
        (response: string[], textStatus: string, xhr: JQueryXHR): void;
    }

    export interface AuthSettings
    {
        token: string;
    }

    export class Api
    {
        private baseUrl: string;
        private beforeSend: (xhr: JQueryXHR) => void;

        constructor(authSettings?: AuthSettings)
        {
            this.baseUrl = "https://api.github.com";
            this.beforeSend = () => { };

            if (authSettings)
            {
                this.Authenticate(authSettings);
            }
        }

        public Authenticate(authSettings: AuthSettings)
        {
            if (!authSettings)
                throw new Error("authSettings must be non-null");

            if (!authSettings.token)
                throw new Error("authSettings.token must be a non-empty string");

            this.beforeSend = (xhr: JQueryXHR) => xhr.setRequestHeader("Authorization", authSettings.token);
        }

        public Unauthenticate()
        {
            this.beforeSend = () => { };
        }

        public GetJsonCommitComparison(username: string, repo: string, base: string, head: string, success: ISuccessCb, error: IErrorCb)
        {
            this.SendHttpRequest("/repos/" + username + "/" + repo + "/compare/" + base + "..." + head, "GET", success, error);
        }

        public GetJsonAuthorizedUserRepos(success: ISuccessCb, error: IErrorCb)
        {
            this.SendHttpRequest("/user/repos", "GET", success, error);
        }

        public GetJsonCollaborators(username: string, repo: string, success: ISuccessCb, error: IErrorCb)
        {
            this.SendHttpRequest("/repos/" + username + "/" + repo + "/collaborators", "GET", success, error);
        }

        public GetJsonPullRequests(username: string, repo: string, success: ISuccessCb, error: IErrorCb)
        {
            this.SendHttpRequest("/repos/" + username + "/" + repo + "/pulls", "GET", success, error);
        }

        public GetJsonRepos(username: string, success: ISuccessCb, error: IErrorCb)
        {
            this.SendHttpRequest("/users/" + username + "/repos", "GET", success, error);
        }

        /**
         * Retrieves a string[] of repo names belonging to the current authorized user.
         */
        public GetCurrentUserRepoNameList(success: IStringsSuccessCb, error: IErrorCb)
        {
            var mappedCallback: ISuccessCb = (response: any, textStatus: string, jqXHR: any) =>
            {
                var nameList: string[] = this.RetrieveRepoNameListFromResponse(response);
                success(nameList, textStatus, jqXHR);
            }
            this.SendHttpRequest("/user/repos", "GET", mappedCallback, error);
        }

        /**
         * Retrieves a string[] of repo names belonging to the specified username.
         */
        public GetRepoNameList(username: string, success: IStringsSuccessCb, error: IErrorCb)
        {
            var mappedCallback: ISuccessCb = (response: any, textStatus: string, jqXHR: any) =>
            {
                var nameList: string[] = this.RetrieveRepoNameListFromResponse(response);
                success(nameList, textStatus, jqXHR);
            }
            this.SendHttpRequest("/users/" + username + "/repos", "GET", mappedCallback, error);
        }

        private RetrieveRepoNameListFromResponse(json: any): string[]
        {
            var nameList: string[] = [];
            for (var i = 0; i < json.data.length; i++)
            {
                nameList.push(json.data[i].name);
            }
            return nameList;
        }

        private SendHttpRequest(relativeUrl: string, method: string, success: ISuccessCb, error: IErrorCb)
        {
            $.ajax({
                url: this.baseUrl + relativeUrl,
                beforeSend: this.beforeSend,
                dataType: "jsonp",
                method: method,
                success: success,
                error: error
            });
        }
    }
}