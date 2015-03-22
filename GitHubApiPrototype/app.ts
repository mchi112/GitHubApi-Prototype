/// <reference path="./GitHubApi.ts"/>

window.onload = () => {
    var api = new GitHubApi();

    $("#getrepoform").click(function (event) {
        api.GetRepos($("#getrepousername").val(), successGetRepo, error);
    });

    $("#getprform").click(function (event) {
        api.GetPullRequests($("#getprusername").val(), $("#getprrepo").val(), successPullReq, error);
    });
};

function successGetRepo(data: any): void {
    console.log("GET Repositories success");
    for (var i = 0; i < data.data.length; i++) {
        console.log(i + ": " + data.data[i].full_name);
    }
}

function successPullReq(data: any): void {
    console.log("GET Pull Requests success");
    for (var i = 0; i < data.data.length; i++) {
        console.log(i + ": " + data.data[i].body);
    }
}

function error(): void {
    alert("Request failed!");
}