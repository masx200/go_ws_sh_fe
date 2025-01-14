<template>
    <div class="loading-panel">
        <span class="loading">
            <div class="spinner-fading-loading-circle">
                <div
                    class="spinner-fading-loading-circle-cirlce circle-2"
                ></div>
                <div
                    class="spinner-fading-loading-circle-cirlce circle-3"
                ></div>
                <div
                    class="spinner-fading-loading-circle-cirlce circle-4"
                ></div>
                <div
                    class="spinner-fading-loading-circle-cirlce circle-5"
                ></div>
                <div
                    class="spinner-fading-loading-circle-cirlce circle-6"
                ></div>
                <div
                    class="spinner-fading-loading-circle-cirlce circle-7"
                ></div>
                <div
                    class="spinner-fading-loading-circle-cirlce circle-8"
                ></div>
                <div
                    class="spinner-fading-loading-circle-cirlce circle-9"
                ></div>
                <div
                    class="spinner-fading-loading-circle-cirlce circle-10"
                ></div>
                <div
                    class="spinner-fading-loading-circle-cirlce circle-11"
                ></div>
                <div
                    class="spinner-fading-loading-circle-cirlce circle-12"
                ></div>
                <div
                    class="spinner-fading-loading-circle-cirlce circle-13"
                ></div>
            </div>
        </span>
        加载中...
    </div>
</template>
<style lang="css" scoped>
.loading-panel {
    text-align: center;
    /* background: #000; */
    color: lightblue;
    background: #f0f0f0;
    height: 50px;
    line-height: 50px;
    transform: scale(5) translate(0%, 100%);
}
.loading-panel .loading {
    vertical-align: middle;
    display: inline-block;
}
.loading-panel .loading .spinner-fading-loading-circle {
    width: 28px;
    height: 28px;
    position: relative;
}
.loading-panel
    .loading
    .spinner-fading-loading-circle
    .spinner-fading-loading-circle-cirlce {
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    position: absolute;
}
.loading-panel .loading .spinner-fading-loading-circle .circle-2 {
    transform: rotate(30deg);
}
.loading-panel .loading .spinner-fading-loading-circle .circle-2::before {
    content: " ";
    display: block;
    margin: 0px auto;
    width: 15%;
    height: 15%;
    border-radius: 100%;
    background: #ccc;
    animation-delay: -1.2s;
}
.loading-panel .loading .spinner-fading-loading-circle .circle-3 {
    transform: rotate(60deg);
}
.loading-panel .loading .spinner-fading-loading-circle .circle-3::before {
    content: " ";
    display: block;
    margin: 0px auto;
    width: 15%;
    height: 15%;
    border-radius: 100%;
    background: #ccc;
    animation-delay: -1.1s;
}
.loading-panel .loading .spinner-fading-loading-circle .circle-4 {
    transform: rotate(90deg);
}
.loading-panel .loading .spinner-fading-loading-circle .circle-4::before {
    content: " ";
    display: block;
    margin: 0px auto;
    width: 15%;
    height: 15%;
    border-radius: 100%;
    background: #ccc;
    animation-delay: -1s;
}
.loading-panel .loading .spinner-fading-loading-circle .circle-5 {
    transform: rotate(120deg);
}
.loading-panel .loading .spinner-fading-loading-circle .circle-5::before {
    content: " ";
    display: block;
    margin: 0px auto;
    width: 15%;
    height: 15%;
    border-radius: 100%;
    background: #ccc;
    animation-delay: -0.9s;
}
.loading-panel .loading .spinner-fading-loading-circle .circle-6 {
    transform: rotate(150deg);
}
.loading-panel .loading .spinner-fading-loading-circle .circle-6::before {
    content: " ";
    display: block;
    margin: 0px auto;
    width: 15%;
    height: 15%;
    border-radius: 100%;
    background: #ccc;
    animation-delay: -0.8s;
}
.loading-panel .loading .spinner-fading-loading-circle .circle-7 {
    transform: rotate(180deg);
}
.loading-panel .loading .spinner-fading-loading-circle .circle-7::before {
    content: " ";
    display: block;
    margin: 0px auto;
    width: 15%;
    height: 15%;
    border-radius: 100%;
    background: #ccc;
    animation-delay: -0.7s;
}
.loading-panel .loading .spinner-fading-loading-circle .circle-8 {
    transform: rotate(210deg);
}
.loading-panel .loading .spinner-fading-loading-circle .circle-8::before {
    content: " ";
    display: block;
    margin: 0px auto;
    width: 15%;
    height: 15%;
    border-radius: 100%;
    background: #ccc;
    animation-delay: -0.6s;
}
.loading-panel .loading .spinner-fading-loading-circle .circle-9 {
    transform: rotate(240deg);
}
.loading-panel .loading .spinner-fading-loading-circle .circle-9::before {
    content: " ";
    display: block;
    margin: 0px auto;
    width: 15%;
    height: 15%;
    border-radius: 100%;
    background: #ccc;
    animation-delay: -0.5s;
}
.loading-panel .loading .spinner-fading-loading-circle .circle-10 {
    transform: rotate(270deg);
}
.loading-panel .loading .spinner-fading-loading-circle .circle-10::before {
    content: " ";
    display: block;
    margin: 0px auto;
    width: 15%;
    height: 15%;
    border-radius: 100%;
    background: #ccc;
    animation-delay: -0.4s;
}
.loading-panel .loading .spinner-fading-loading-circle .circle-11 {
    transform: rotate(300deg);
}
.loading-panel .loading .spinner-fading-loading-circle .circle-11::before {
    content: " ";
    display: block;
    margin: 0px auto;
    width: 15%;
    height: 15%;
    border-radius: 100%;
    background: #ccc;
    animation-delay: -0.3s;
}
.loading-panel .loading .spinner-fading-loading-circle .circle-12 {
    transform: rotate(330deg);
}
.loading-panel .loading .spinner-fading-loading-circle .circle-12::before {
    content: " ";
    display: block;
    margin: 0px auto;
    width: 15%;
    height: 15%;
    border-radius: 100%;
    background: #ccc;
    animation-delay: -0.2s;
}
.loading-panel .loading .spinner-fading-loading-circle .circle-13 {
    transform: rotate(360deg);
}
.loading-panel .loading .spinner-fading-loading-circle .circle-13::before {
    content: " ";
    display: block;
    margin: 0px auto;
    width: 15%;
    height: 15%;
    border-radius: 100%;
    background: #ccc;
    animation-delay: -0.1s;
}
@keyframes spinner-fading-circle {
    0%,
    39%,
    100% {
        opacity: 0;
    }
    40% {
        opacity: 1;
    }
}
</style>
