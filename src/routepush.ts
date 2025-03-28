export function routepushdisplayUsers() {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", "displayUsers");

    console.log(url);
    // await router.push(url.href.slice(url.origin.length));//居然不管用
    history.pushState(null, "", url.href.slice(url.origin.length));
    location.reload();
}
export function routepushdisplayTokens() {


    const url = new URL(window.location.href);
    url.searchParams.set("tab", "displayTokens");

    console.log(url);
    // await router.push(url.href.slice(url.origin.length));//居然不管用
    history.pushState(null, "", url.href.slice(url.origin.length));
    location.reload();
}
export function routepushdisplaySessions() {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", "displaySessions");

    console.log(url);
    // await router.push(url.href.slice(url.origin.length));//居然不管用
    history.pushState(null, "", url.href.slice(url.origin.length));
    location.reload();
}
