if (!self.define) {
    let n,
        l = {};
    const u = (u, s) => (
        (u = new URL(u + ".js", s).href),
            l[u] ||
            new Promise((l) => {
                if ("document" in self) {
                    const n = document.createElement("script");
                    (n.src = u), (n.onload = l), document.head.appendChild(n);
                } else (n = u), importScripts(u), l();
            }).then(() => {
                let n = l[u];
                if (!n) {
                    throw new Error(`Module ${u} didn’t register its module`);
                }
                return n;
            })
    );
    self.define = (s, r) => {
        const i = n ||
            ("document" in self ? document.currentScript.src : "") ||
            location.href;
        if (l[i]) return;
        let e = {};
        const o = (n) => u(n, i),
            t = { module: { uri: i }, exports: e, require: o };
        l[i] = Promise.all(s.map((n) => t[n] || o(n))).then(
            (n) => (r(...n), e),
        );
    };
}
define(["./workbox-3e8df8c8"], function (n) {
    "use strict";
    self.skipWaiting(),
        n.clientsClaim(),
        n.precacheAndRoute(
            [
                { url: "_nuxt/Bk-QNJ0Q.js", revision: null },
                { url: "_nuxt/BMR7h-qH.js", revision: null },
                { url: "_nuxt/BOhlVkYq.js", revision: null },
                { url: "_nuxt/C--zwfF6.js", revision: null },
                { url: "_nuxt/CBqTafqy.js", revision: null },
                { url: "_nuxt/Cjnhu7fe.js", revision: null },
                { url: "_nuxt/CTEpIIq-.js", revision: null },
                { url: "_nuxt/CTNc40YA.js", revision: null },
                { url: "_nuxt/CwCKd4fd.js", revision: null },
                { url: "_nuxt/CwtvwXb3.js", revision: null },
                { url: "_nuxt/D1SSNeej.js", revision: null },
                { url: "_nuxt/DlAUqK2U.js", revision: null },
                { url: "_nuxt/DOil6_Gs.js", revision: null },
                { url: "_nuxt/DSyedP1-.js", revision: null },
                { url: "_nuxt/DtTv1yTe.js", revision: null },
                { url: "_nuxt/DVr0xitr.js", revision: null },
                { url: "_nuxt/entry.Xc5mgOwq.css", revision: null },
                { url: "_nuxt/error-404.BcHdG7tz.css", revision: null },
                { url: "_nuxt/error-500.DHa4olBZ.css", revision: null },
                { url: "_nuxt/index.crJ2CK_C.css", revision: null },
                { url: "_nuxt/index.DKksWdkj.css", revision: null },
                { url: "_nuxt/Kap57GLX.js", revision: null },
                { url: "_nuxt/loading.BZ6R2raN.css", revision: null },
                { url: "_nuxt/login.Bn6iT2Si.css", revision: null },
                { url: "_nuxt/login.wTgsED47.css", revision: null },
                { url: "_nuxt/manage.CM8mALMH.css", revision: null },
                { url: "_nuxt/n_wxwCoj.js", revision: null },
                { url: "_nuxt/RrIGN2GH.js", revision: null },
                {
                    url: "_nuxt/ServerConnectionInfo.BArEbnHp.css",
                    revision: null,
                },
                { url: "_nuxt/shell.Cn65Y6jH.css", revision: null },
                {
                    url: "_payload.json",
                    revision: "f1c2f3dccc3c1d411a1af76502e28308",
                },
                {
                    url: "login/_payload.json",
                    revision: "13b921b1aba2072085e99df51e186813",
                },
                {
                    url: "manage/_payload.json",
                    revision: "13b921b1aba2072085e99df51e186813",
                },
                {
                    url: "shell/_payload.json",
                    revision: "13b921b1aba2072085e99df51e186813",
                },
                {
                    url: "_nuxt/builds/latest.json",
                    revision: "baad8580f4ad950580380d5518da0ace",
                },
                {
                    url: "_nuxt/builds/meta/74441350-8469-4dd7-b867-4f17949b6754.json",
                    revision: null,
                },
                {
                    url: "manifest.webmanifest",
                    revision: "3d277f0aee0e6f225d31f4518e44c5c6",
                },
            ],
            {},
        ),
        n.cleanupOutdatedCaches(),
        n.registerRoute(new n.NavigationRoute(n.createHandlerBoundToURL("/")));
});
