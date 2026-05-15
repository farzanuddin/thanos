<script>
    import { onMount } from "svelte";

    const MARK_DELAY = 350;
    const REMOVE_DELAY = 420;

    let size = 10;
    let minVal = 20;
    let maxVal = 100;
    let arr = [];
    let removed = new Set();
    let willRemove = new Set();
    let cellRefs = [];
    let particles = [];
    let particlesContainer;
    let running = false;
    let balanced = false;
    let abort = false;
    let delay = 700;

    $: sorted = isSorted(arr);

    function register(node, idx) {
        cellRefs[idx] = node;
        return {
            destroy() {
                cellRefs[idx] = null;
            },
        };
    }

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
        abort = true;
        arr = randArray(size, maxVal);
        removed = new Set();
        running = false;
        balanced = false;
    }

    async function step() {
        if (abort || sorted || arr.length <= 1) return;
        const n = arr.length;
        const indices = Array.from({ length: n }, (_, i) => i);
        shuffle(indices);
        const removeCount = Math.floor(n / 2);
        const toRemove = new Set(indices.slice(0, removeCount));
        willRemove = new Set(toRemove);
        await new Promise((res) =>
            setTimeout(res, Math.min(MARK_DELAY, Math.floor(delay / 2))),
        );
        if (abort) return;
        removed = new Set(toRemove);
        spawnParticlesForIndices(toRemove);
        willRemove = new Set();
        await new Promise((res) => setTimeout(res, Math.min(REMOVE_DELAY, delay)));
        if (abort) return;
        arr = arr.filter((_, i) => !toRemove.has(i));
        removed = new Set();
    }
    async function run() {
        abort = false;
        running = true;
        while (!abort && running && !sorted && arr.length > 1) {
            await step();
            if (abort) break;
            await new Promise((r) => setTimeout(r, delay));
        }
        running = false;
        balanced = sorted || arr.length <= 1;
    }

    function spawnParticlesForIndices(indices) {
        if (!particlesContainer) return;
        const containerRect = particlesContainer.getBoundingClientRect();
        const now = Date.now();
        indices.forEach((i) => {
            const el = cellRefs[i];
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const cx = rect.left - containerRect.left + rect.width / 2;
            const cy = rect.top - containerRect.top + rect.height / 2;
            const style = getComputedStyle(el);
            const color = style.backgroundColor || "rgba(200,180,160,0.9)";
            const count = 14;
            for (let k = 0; k < count; k++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 18 + Math.random() * 70;
                const dx = Math.cos(angle) * speed;
                const dy = Math.sin(angle) * speed - Math.random() * 40;
                const size = 2 + Math.random() * 6;
                const id = `${now}-${i}-${k}-${Math.random().toString(36).slice(2, 7)}`;
                const delay = Math.random() * 120;
                particles = [
                    ...particles,
                    { id, x: cx, y: cy, dx, dy, size, color, delay },
                ];
                setTimeout(() => {
                    particles = particles.filter((p) => p.id !== id);
                }, 900 + delay);
            }
        });
    }

    onMount(() => {
        reset();
    });
</script>

<section class="visualizer">
    <div class="controls">
        <button on:click={reset} disabled={running} aria-label="Reset" title="Reset">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
            <span class="btn-label">Reset</span>
        </button>
        <button
            class="snap-button"
            class:balanced
            on:click={run}
            disabled={running}
            aria-label="Snap"
            title="Snap"
        >
            {#if running}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spinner"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
                <span class="btn-label">Balancing the scales</span>
            {:else if balanced}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>
                <span class="btn-label">Perfectly balanced</span>
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>
                <span class="btn-label">Snap</span>
            {/if}
        </button>
    </div>

    <div class="array-area">
        <div class="array">
            {#each arr as v, i}
                <div
                    use:register={i}
                    class="cell {sorted ? 'sorted' : ''} {willRemove.has(
                        i,
                    )
                        ? 'will-remove'
                        : ''} {removed.has(i) ? 'removed' : ''}"
                    style="height: {Math.max(8, v)}px"
                ></div>
            {/each}
        </div>

        <div class="particles-container" bind:this={particlesContainer}>
            {#each particles as p (p.id)}
                <div
                    class="particle"
                    style="left: {p.x}px; top: {p.y}px; width: {p.size}px; height: {p.size}px; background: {p.color}; --dx: {p.dx}px; --dy: {p.dy}px; animation-delay: {p.delay}ms"
                ></div>
            {/each}
        </div>
    </div>

    <div aria-live="polite" class="sr-only">
        {#if balanced}
            Array is perfectly balanced and sorted.
        {:else if running}
            Balancing the array&hellip;
        {:else}
            Array has {arr.length} elements. Click Snap to balance.
        {/if}
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
    .controls button.balanced {
        opacity: 0.5;
        cursor: default;
        pointer-events: none;
    }
    .controls .btn-label {
        font-size: 0.9rem;
        text-transform: capitalize;
        line-height: 1;
    }
    .spinner {
        animation: spin 800ms linear infinite;
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    .array-area {
        padding: 14px;
        display: flex;
        justify-content: center;
        min-height: 160px; /* reserve vertical space so controls don't shift */
        position: relative;
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
    .particles-container {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: visible;
    }
    .particle {
        position: absolute;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        will-change: transform, opacity, filter;
        animation: dust 900ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        opacity: 1;
        filter: blur(0.4px);
    }
    @keyframes dust {
        0% {
            transform: translate(calc(var(--dx) * 0%), calc(var(--dy) * 0%))
                scale(1);
            opacity: 1;
            filter: blur(0.4px) saturate(1);
        }
        30% {
            opacity: 0.95;
        }
        100% {
            transform: translate(var(--dx), calc(var(--dy) + 18px))
                rotate(270deg) scale(0.6);
            opacity: 0;
            filter: blur(1.6px) grayscale(30%);
        }
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }

    @media (prefers-reduced-motion: reduce) {
        .particle {
            display: none;
        }
        .cell {
            transition: none;
        }
        .particles-container {
            display: none;
        }
    }
</style>
