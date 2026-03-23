<script>
    import { onMount } from "svelte";
    import { RefreshCw, Hand, Loader } from "lucide-svelte";

    let size = 10;
    let minVal = 20;
    let maxVal = 100;
    let arr = [];
    let removed = new Set();
    let willRemove = new Set();
    let cellRefs = [];
    let particles = [];
    let particlesContainer;
    
    function register(node, idx) {
        let current = idx;
        cellRefs[current] = node;
        return {
            update(newIdx) {
                if (newIdx === current) return;
                cellRefs[current] = null;
                current = newIdx;
                cellRefs[current] = node;
            },
            destroy() {
                cellRefs[current] = null;
            },
        };
    }
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
        spawnParticlesForIndices(toRemove);
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
            const color = style.backgroundColor || 'rgba(200,180,160,0.9)';
            const count = 14;
            for (let k = 0; k < count; k++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 18 + Math.random() * 70;
                const dx = Math.cos(angle) * speed;
                const dy = Math.sin(angle) * speed - Math.random() * 40;
                const size = 2 + Math.random() * 6;
                const id = `${now}-${i}-${k}-${Math.random().toString(36).slice(2,7)}`;
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
                    use:register={i}
                    class="cell {isSorted(arr) ? 'sorted' : ''} {willRemove.has(
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
        animation: dust 900ms cubic-bezier(.2,.8,.2,1) both;
        opacity: 1;
        filter: blur(0.4px);
    }

    @keyframes dust {
        0% {
            transform: translate(calc(var(--dx) * 0%), calc(var(--dy) * 0%)) scale(1);
            opacity: 1;
            filter: blur(0.4px) saturate(1);
        }
        30% {
            opacity: 0.95;
        }
        100% {
            transform: translate(var(--dx), calc(var(--dy) + 18px)) rotate(270deg) scale(0.6);
            opacity: 0;
            filter: blur(1.6px) grayscale(30%);
        }
    }
</style>
