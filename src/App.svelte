<script>
    import ThanosVisualizer from "./components/ThanosVisualizer.svelte";

    let title = "Thanos Sort";
    let tagline =
        "Checks if the array is sorted. If not, it randomly turns half of the elements to dust.";

    const code = `function thanosSort(arr) {
    function isSorted(arr) {
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) return false;
        }
        return true;
    }

    while (!isSorted(arr)) {
        const half = Math.floor(arr.length / 2);
        for (let i = 0; i < half; i++) {
            const r = Math.floor(Math.random() * arr.length);
            arr.splice(r, 1);
        }
    }

    return arr;
}`;
</script>

<main class="app">
    <header class="hero">
        <h1>{title}</h1>
        <p class="tag">{tagline}</p>
    </header>

    <div class="center">
        <div class="panel">
            <ThanosVisualizer />
        </div>

        <div class="code-panel">
            <div class="code-window">
                <div class="titlebar">
                    <span class="dot red"></span>
                    <span class="dot yellow"></span>
                    <span class="dot green"></span>
                </div>
                <pre class="code">{code}</pre>
            </div>
        </div>
    </div>
</main>

<style>
    .app {
        max-width: 980px;
        margin: 0 auto;
        z-index: 1;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 12px;
    }
    .hero {
        text-align: center;
    }
    .hero h1 {
        margin: 0;
        font-size: clamp(18px, 4vw, 32px);
    }
    .hero .tag {
        margin: 6px 0 0 0;
        color: var(--muted);
    }
    .center {
        display: flex;
        flex-direction: column;
        gap: 12px;
        align-items: center;
        width: 100%;
        max-height: calc(100vh - 120px);
        overflow: hidden;
    }
    .panel {
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }
    .code-panel {
        padding: 12px;
        width: min(600px, 94vw);
        overflow: hidden;
    }
    .code-window {
        border-radius: 8px;
        background: var(--muted);
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.03);
        height: 100%;
    }
    .titlebar {
        padding: 8px 10px;
        display: flex;
        gap: 8px;
        align-items: center;
    }
    .dot {
        width: 12px;
        height: 12px;
        border-radius: 99px;
        display: inline-block;
    }
    .dot.red {
        background: var(--danger);
    }
    .dot.yellow {
        background: var(--warning);
    }
    .dot.green {
        background: var(--success);
    }
    .code {
        margin: 0;
        color: var(--accent);
        font-family: "Source Code Pro", ui-monospace, monospace;
        font-size: clamp(10px, 1.8vw, 13px);
        padding: 12px;
        background: var(--subg);
        height: 100%;
    }
    @media (min-width: 800px) {
        .center {
            flex-direction: column;
        }
    }
</style>
