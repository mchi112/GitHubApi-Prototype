/// <reference path="./GitHubApi.ts"/>

window.onload = () => {
    var api = new GitHubApi();

    $("#getrepoform").click(function (event) {
        api.GetRepos($("#getrepousername").val(), successGetRepo, error);
    });

    $("#getprform").click(function (event) {
        api.GetPullRequests($("#getprusername").val(), $("#getprrepo").val(), successPullReq, error);
    });

    api.GetCommitComparison("mchi112", "CRPlayground", "master", "feature", successDiff, error);
};

function successGetRepo(response: any): void {
    console.log("GET Repositories success");
    for (var i = 0; i < response.data.length; i++) {
        console.log(i + ": " + response.data[i].full_name);
    }
}

function successPullReq(response: any): void {
    console.log("GET Pull Requests success");
    for (var i = 0; i < response.data.length; i++) {
        console.log(i + ": " + response.data[i].body);
    }
}

function successDiff(response: any): void {
    var files = response.data.files;
    var file: any;
    for (var i = 0; i < files.length; i++) {
        file = files[i];
        if (file.status === "added" || file.status === "removed") {
            $.ajax({
                url: file.contents_url,
                method: "GET",
                success: function (response) {
                    alert(response.name + ": " + "added/removed");
                    alert(atob(response.content));
                    $("#" + file.status).append("<p" + file.filename + "\n" + "</p>");
                    $("#" + file.status).append("<p" + atob(response.content) + "</p>");
                },
                error: function () {
                    alert("Failed to get added file content");
                }
            });
        }
        else {
            $.ajax({
                url: file.contents_url,
                method: "GET",
                success: function (response) {
                    alert(response.name + ": " + file.status);
                    alert(atob(response.content));
                    $("#modified").append("<p" + file.filename + "\n") + "</p>";
                    $("#modified").append("<p" + atob(response.content) + "</p>");
                },
                error: function () {
                    alert("Failed to get added file content");
                }
            });
        }
    }
}

function success(response: any): void {
    console.log(JSON.stringify(response.data));
}

function error(): void {
    alert("Request failed!");
}