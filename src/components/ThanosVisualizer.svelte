<script>
    import { onMount } from "svelte";
    import { RefreshCw, Hand, Loader } from "lucide-svelte";

    let size = 10;
    let minVal = 20;
    let maxVal = 100;
    let arr = [];
    let removed = new Set();
    let willRemove = new Set();
    let running = false;
    let balanced = false;
    let delay = 700;

    function randArray(n, max) {
        const min = Math.min(minVal, max);
        const range = Math.max(0, max - min);
        return Array.from(
            { length: n },
            () => Math.floor(Math.random() * (range + 1)) + min,
        );
    }

    function isSorted(a) {
        for (let i = 1; i < a.length; i++) if (a[i - 1] > a[i]) return false;
        return true;
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function reset() {
        arr = randArray(size, maxVal);
        removed = new Set();
        running = false;
        balanced = false;
    }

    async function step() {
        if (isSorted(arr) || arr.length <= 1) return;
        const n = arr.length;
        const indices = Array.from({ length: n }, (_, i) => i);
        shuffle(indices);
        const removeCount = Math.floor(n / 2);
        const toRemove = new Set(indices.slice(0, removeCount));
        willRemove = new Set(toRemove);
        await new Promise((res) =>
            setTimeout(res, Math.min(350, Math.floor(delay / 2))),
        );
        removed = new Set(toRemove);
        willRemove = new Set();
        await new Promise((res) => setTimeout(res, Math.min(420, delay)));
        arr = arr.filter((_, i) => !toRemove.has(i));
        removed = new Set();
    }
    async function run() {
        running = true;
        while (running && !isSorted(arr) && arr.length > 1) {
            await step();
            await new Promise((r) => setTimeout(r, delay));
        }
        running = false;
        balanced = isSorted(arr) || arr.length <= 1;
    }

    onMount(() => {
        reset();
    });
</script>

<section class="visualizer">
    <div class="controls">
        <button on:click={reset} aria-label="Reset" title="Reset">
            <RefreshCw size={18} />
            <span class="btn-label">Reset</span>
        </button>
        <button
            class="snap-button"
            on:click={run}
            disabled={running}
            aria-label="Snap"
            title="Snap"
        >
            {#if running}
                <Loader size={18} class="spinner" />
                <span class="btn-label">Balancing the scales</span>
            {:else if balanced}
                <Hand size={18} />
                <span class="btn-label">Perfectly balanced</span>
            {:else}
                <Hand size={18} />
                <span class="btn-label">Snap</span>
            {/if}
        </button>
    </div>

    <div class="array-area">
        <div class="array">
            {#each arr as v, i}
                <div
                    class="cell {isSorted(arr) ? 'sorted' : ''} {willRemove.has(
                        i,
                    )
                        ? 'will-remove'
                        : ''} {removed.has(i) ? 'removed' : ''}"
                    style="height: {Math.max(8, v)}px"
                ></div>
            {/each}
        </div>
    </div>
</section>

<style>
    .visualizer {
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }
    .controls {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
    }
    .controls button {
        padding: 6px 10px;
        min-width: 64px;
        height: 40px;
        display: inline-flex;
        gap: 8px;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        background: var(--surface, #fff);
        color: var(--text, #111);
        border: 1px solid rgba(0, 0, 0, 0.08);
        cursor: pointer;
        transition:
            background 160ms ease,
            transform 120ms ease;
    }
    .controls button:hover:not(:disabled) {
        transform: translateY(-2px);
    }
    .controls button[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .controls .btn-label {
        font-size: 0.9rem;
        text-transform: capitalize;
        line-height: 1;
    }
    .array-area {
        padding: 14px;
        display: flex;
        justify-content: center;
        min-height: 160px; /* reserve vertical space so controls don't shift */
    }
    .array {
        display: flex;
        gap: 8px;
        align-items: end;
        overflow: hidden;
        justify-content: center;
    }
    .cell {
        width: clamp(28px, 7vw, 48px);
        display: flex;
        align-items: flex-end;
        justify-content: center;
        transition:
            opacity 360ms ease,
            transform 360ms ease,
            background 220ms ease;
        position: relative;
        background: var(--accent);
        border-radius: 4px;
        max-height: 36vh;
    }
    .cell.sorted {
        background: var(--success);
    }
    .cell.removed {
        opacity: 0;
        transform: translateY(100px) scale(0.6) rotate(-0deg);
        filter: blur(0.8px) grayscale(30%);
    }

    .cell.will-remove {
        background: var(--danger);
        transform: translateY(-4px) scale(1.02);
    }
</style>
