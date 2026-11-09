/**
 * Dialog lines as real elements.
 *
 * Blockbench 5 shows string dialog "lines" as plain text (HTML strings are
 * deprecated), so markdown such as **bold** showed its asterisks and the lines
 * ran together. This turns the small markdown the plugin writes (## heading,
 * ---, **bold**, _note_) into elements, using textContent only.
 */

function appendInline(parent: HTMLElement, text: string): void {
    for (const part of text.split(/(\*\*[^*]+\*\*)/)) {
        if (!part) continue;
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
            const strong = document.createElement('strong');
            strong.textContent = part.slice(2, -2);
            parent.append(strong);
        } else {
            parent.append(document.createTextNode(part));
        }
    }
}

export function markdownLinesToElements(lines: string[]): HTMLElement[] {
    const out: HTMLElement[] = [];
    for (const raw of lines) {
        const line = raw.trim();
        if (!line) continue;
        if (line === '---') {
            const hr = document.createElement('hr');
            hr.style.margin = '8px 0';
            out.push(hr);
            continue;
        }
        if (line.startsWith('## ')) {
            const h = document.createElement('h3');
            h.style.margin = '0 0 8px 0';
            appendInline(h, line.slice(3));
            out.push(h);
            continue;
        }
        const p = document.createElement('p');
        p.style.margin = '0 0 6px 0';
        const note = line.match(/^_(.*)_$/);
        if (note) {
            p.style.color = 'var(--color-subtle_text)';
            p.style.fontSize = '0.92em';
            appendInline(p, note[1]);
        } else {
            appendInline(p, line);
        }
        out.push(p);
    }
    return out;
}
