# Third-party notices

The MIT license in this repository covers original plugin code. It does not
replace third-party licenses or the Transitions.dev recipe terms below.

## Transitions.dev product-use terms

The three free recipes used in this DSH-specific display are Streaming text,
Thinking states and Reasoning stream, by Jakub Antalik / Transitions.dev.
They are incorporated into the actual conversation UI, not redistributed as a
standalone effects collection, template pack or component kit. No Pro assets,
website fonts, stock images, demo transcript or upstream CLI are included.

The upstream [Terms & License](https://transitions.dev/terms.html), last updated
July 2026 and checked on 2026-08-28, permit use, modification and shipment of
accessible recipes within personal or commercial products. They prohibit
republishing the collection or a substantial part as a competing effects
library, template pack or component kit. The upstream MIT license applies to
its tooling, **not** to the transition recipes. Retain this notice and consult
the upstream terms when redistributing or adapting the corresponding motion
portions of `Reader.module.css`, `motion.tsx` and `word-timeline.ts`.

## DeepSeek Harness native process presentation

`src/client/native` copies the native context rows, form-specific context bodies, reference icon and pure tool summary model. `upstream.json` records the source commit and each original hash. The only adaptations are public type imports, relative ESM suffixes and a local icon path. The MIT license below covers these files. No Host, model, SDK, Agent or tool execution source is included or modified.

## DeepSeek Harness Markdown renderer

`src/client/markdown` derives from DeepSeek Harness commit `b150a551b8d465e31e418e1b2eaf5e79bbb7d28e`. Changes add source-offset hooks for text leaves, literal HTML, inline code and atomic code-block entry, and keep source-offset keys on finalization. Native CodeBlock is reused through the public package API without changing its content renderer. Original file hashes are recorded in `upstream.json`.

MIT License

Copyright (c) 2026 DeepSeek

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Transitions.dev Streaming text

Motion recipe: https://github.com/Jakubantalik/transitions.dev/blob/ef497bb64867ce569689730198fc66f49db56317/cli/free/streaming-text.md

Author: Jakub Antalik. The public free recipe is presented for copying into projects. Opacity 0 to 1, blur 1px to 0, 350ms, 60ms gap and cubic-bezier(0.22,1,0.36,1) are used here. The live adapter animates only appended words rather than replaying existing paragraphs. No protected recipes were retrieved and no license for the entire upstream repository is asserted.

## Transitions.dev Thinking states

Author: Jakub Antalik. Source: the public [Thinking states recipe](https://github.com/Jakubantalik/transitions.dev/blob/ef497bb64867ce569689730198fc66f49db56317/cli/free/thinking-states.md). The scoped implementation retains its glyph-only `::before` sweep (2 seconds, 400% background), 150ms state transition, 50ms entry gap, 8px travel and 2px blur. DSH semantic colors replace fixed colors; real Host events replace the demo's timed state carousel. Hidden visual copies are excluded from accessibility, and interrupted/off/reduced/background states settle to the current label.

## Transitions.dev Reasoning stream

Author: Jakub Antalik. Source: the public [Reasoning stream recipe](https://github.com/Jakubantalik/transitions.dev/blob/ef497bb64867ce569689730198fc66f49db56317/cli/free/reasoning-stream.md). This adaptation retains the 28px viewport mask, 840ms cadence, 500ms cubic-bezier(0.22,1,0.36,1) CSS transform and fixed two-line steps, clamped only at the real transcript's current end. One real text tree replaces the demo's cloned loop. Body and tool phases do not prematurely stop the current step's motion; manual reading receives the painted offset through native scrolling, preserving selection and keyboard access. Bursts never increase the step distance. Reduced motion and closed historical turns remain static.


## dsh-progress-narrator protocol (0.3.0)

Vendored canonical parser for Reader-only presentation integration. Source: https://github.com/S-AN-Shu/dsh-progress-narrator

BSD 3-Clause License

Copyright (c) 2026, S-AN-Shu
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
