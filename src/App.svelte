<script>
    import ThanosVisualizer from "./components/ThanosVisualizer.svelte";

    let title = "Thanos Sort";
    let tagline =
        "Checks if the array is sorted. If not, it randomly turns half of the elements to dust.";

    const codeHtml = `
<span class="token keyword">function</span> <span class="token function">thanosSort</span>(<span class="token parameter">arr</span>) {
    <span class="token keyword">const</span> <span class="token constant">isSorted</span> = (<span class="token parameter">a</span>) => a.every((<span class="token parameter">v, i</span>) => i === <span class="token number">0</span> || v >= a[i - <span class="token number">1</span>]);

    <span class="token keyword">while</span> (arr.length > <span class="token number">1</span> && !isSorted(arr)) {
        <span class="token keyword">const</span> <span class="token constant">survivorCount</span> = Math.ceil(arr.length / <span class="token number">2</span>);
        <span class="token keyword">const</span> <span class="token constant">indices</span> = [...arr.keys()].sort(() => Math.random() - <span class="token number">0.5</span>);
        <span class="token keyword">const</span> <span class="token constant">survivors</span> = <span class="token keyword">new</span> Set(indices.slice(<span class="token number">0</span>, survivorCount));

        arr = arr.filter((_, i) => survivors.has(i));
    }

    <span class="token keyword">return</span> arr;
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
                <pre class="code"><code>{@html codeHtml}</code></pre>
            </div>
        </div>
    </div>

    <footer class="footer">
        <span
            >&copy; {new Date().getFullYear()}
            <a
                href="https://github.com/farzanuddin"
                target="_blank"
                rel="noopener">Farzan Uddin</a
            ></span
        >
    </footer>
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
        margin: 0 10px;
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
        overflow: auto;
        max-width: 100vw;
        box-sizing: border-box;
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
        white-space: pre;
        overflow-x: auto;
        box-sizing: border-box;
    }

    .footer {
        width: 100%;
        text-align: center;
        color: var(--muted);
        font-size: 0.7rem;
        margin-top: 24px;
        margin-bottom: 10px;
        letter-spacing: 0.01em;
    }
    .footer a {
        color: var(--accent);
        text-decoration: underline dotted;
        transition: color 0.18s;
    }
    .footer a:hover {
        color: var(--success);
    }
    .code {
        font-size: 12px;
        padding: 10px 4px;
    }
</style>
