<script>
    import { onMount } from "svelte";

    let size = 10;
    let minVal = 20;
    let maxVal = 100;
    let arr = [];
    let removed = new Set();
    let willRemove = new Set();
    let running = false;
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
    }

    async function step() {
        // Select about half the indices at random, animate them simultaneously,
        // then remove them in a single batch (snap effect).
        if (isSorted(arr) || arr.length <= 1) return;
        const n = arr.length;
        const indices = Array.from({ length: n }, (_, i) => i);
        shuffle(indices);
        const removeCount = Math.floor(n / 2);
        const toRemove = new Set(indices.slice(0, removeCount));

        // mark indices that will be removed (turn red)
        willRemove = new Set(toRemove);

        // brief pre-remove indicator so users see which will snap
        await new Promise((res) =>
            setTimeout(res, Math.min(350, Math.floor(delay / 2))),
        );

        // switch to removal animation (dust)
        removed = new Set(toRemove);
        willRemove = new Set();

        // wait for dust animation to play
        await new Promise((res) => setTimeout(res, Math.min(420, delay)));

        // remove them all at once, preserving original order of survivors
        arr = arr.filter((_, i) => !toRemove.has(i));

        // clear removed markers
        removed = new Set();
    }
    async function run() {
        running = true;
        while (running && !isSorted(arr) && arr.length > 1) {
            await step();
            await new Promise((r) => setTimeout(r, delay));
        }
        running = false;
    }

    onMount(() => {
        reset();
    });
</script>

<section class="visualizer">
    <div class="controls">
        <button on:click={reset}>Reset</button>
        <button on:click={run} disabled={running}>Snap</button>
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
                >
                </div>
            {/each}
        </div>
    </div>

    <div class="status">
        <strong>Length:</strong>
        {arr.length} — <strong>Sorted:</strong>
        {isSorted(arr) ? "Yes" : "No"}
    </div>
</section>

<style>
    .controls {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        align-items: center;
        margin-bottom: 12px;
    }
    .controls button {
        padding: 6px 10px;
    }
    .array-area {
        padding: 14px;
        display: flex;
        justify-content: center;
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
    .cell .val {
        font-size: clamp(9px, 1.6vw, 12px);
        color: #111;
        padding: 4px 6px;
        background: rgba(255, 255, 255, 0.18);
        margin-bottom: 6px;
    }
    .status {
        margin-top: 10px;
        color: #444;
    }
</style>
