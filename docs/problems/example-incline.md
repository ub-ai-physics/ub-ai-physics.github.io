---
title: "Block on an incline (example)"
author: Example Student
course: Mechanics
year: 1
status: draft
tags:
  - Mechanics
  - Year 1
---

# Block on an incline (example)

!!! info "About this page"
    **Author:** Example Student · **Course:** Mechanics · **Year:** 1 · **Status:** draft

## Statement

A block of mass \(m\) slides down a plane inclined at an angle \(\theta\), with kinetic friction coefficient \(\mu\). Find its acceleration.

<figure markdown>
<svg viewBox="0 0 220 120" width="320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Block on an inclined plane">
  <polygon points="10,110 210,110 210,20" fill="none" stroke="currentColor" stroke-width="2"/>
  <g transform="rotate(-24.2 120 70)">
    <rect x="105" y="48" width="30" height="20" fill="none" stroke="currentColor" stroke-width="2"/>
    <text x="114" y="63" font-size="12" fill="currentColor">m</text>
  </g>
  <text x="45" y="104" font-size="12" fill="currentColor">θ</text>
</svg>
<figcaption>A figure can be an image file or an SVG drawn by Claude, like this one.</figcaption>
</figure>

## Solution

Along the plane, the forces are the component of the weight \(mg\sin\theta\) and friction \(\mu N\), with \(N = mg\cos\theta\). Newton's second law gives

\[
m a = mg\sin\theta - \mu\, mg\cos\theta
\quad\Longrightarrow\quad
a = g\,(\sin\theta - \mu\cos\theta).
\]

??? note "Check"
    The block only slides if \(a > 0\), that is if \(\tan\theta > \mu\).
