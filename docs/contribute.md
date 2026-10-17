# Contribute

Everything here can be done in your web browser. You don't need to install anything or know git.

## How it works in one minute

- The website is built from the files in our GitHub repository, [ub-ai-physics/ub-ai-physics.github.io](https://github.com/ub-ai-physics/ub-ai-physics.github.io).
- When you change or add a file, GitHub does not publish it straight away. It creates a **proposal** (GitHub calls it a *pull request*).
- A coordinator reads the proposal, may leave comments, and clicks **Merge**. A minute or two later the website is updated.
- Every change keeps your name, and anything can be undone. You can't break the site.

## Before your first contribution

1. Create a free account at [github.com/signup](https://github.com/signup). Tip: as a student you can also ask for the free [GitHub Student Developer Pack](https://education.github.com/pack).
2. Post your GitHub username on Campus Virtual. A coordinator will invite you to the **ub-ai-physics** organization.
3. Accept the invitation (you get it by email, or at [github.com/ub-ai-physics](https://github.com/ub-ai-physics)).

## Fix or improve an existing page

1. On the website, open the page and click the **pencil** icon at the top right of the text.
2. Make your change in the editor. The **Preview** tab shows how it looks.
3. Click **Commit changes…**, write one line saying what you changed, choose **Create a new branch and start a pull request**, then click **Propose changes**.
4. On the next screen click **Create pull request**. Done: the coordinators are notified.

## Add lecture notes or a solved problem

1. Ask Claude to write your notes in **Markdown with LaTeX math** (for example: *"Write these notes as a Markdown file. Use `\( \)` for inline math and `\[ \]` for displayed equations."*).
2. In the repository, open the folder `docs/notes/` (or `docs/problems/`), click **Add file → Create new file**.
3. Name the file in lowercase with dashes, for example `rigid-body-rotation.md`.
4. Start the file with the block below, filled in, then paste your text after it. The [example notes](notes/example-harmonic-oscillator.md) show the whole format.

    ```yaml
    ---
    title: "Rigid body rotation"
    author: Your Name
    course: Mechanics
    year: 1
    status: draft
    tags:
      - Mechanics
      - Year 1
    ---
    ```

5. Add a line for your page to the table on the section's main page (`docs/notes/index.md` or `docs/problems/index.md`), in the same proposal if you can, or in a second one.
6. Click **Commit changes…** and propose the change as above.

**Images:** upload them next to your page (**Add file → Upload files**) and show them with `![Short description](my-figure.png)`.

## Add a simulation or animation

1. Ask Claude for **a single HTML file with everything inside** (no separate CSS or JS files, no data to download), so it works anywhere.
2. In the repository, open `docs/simulations/`, click **Add file → Upload files**, and drag your file in. In the file name box at the top, type a folder name before it so the path becomes `docs/simulations/coriolis/index.html`.
3. Add a line to the table in `docs/simulations/index.md`, then propose the change.

## Using Claude Code instead

If you use Claude Code on your computer, you can ask it to do all of this for you: *"Clone github.com/ub-ai-physics/ub-ai-physics.github.io, add my notes as a new page following docs/contribute.md, and open a pull request."*

## Status of a page

- **draft**: written, not yet checked by someone else.
- **reviewed**: another student (or the supervisor) has checked the physics. The reviewer changes the status and adds their name.

## For coordinators

- Check the open proposals in the [Pull requests](https://github.com/ub-ai-physics/ub-ai-physics.github.io/pulls) tab. Read the **Files changed** tab, leave comments if needed, then **Approve** and **Merge**.
- After merging, the **Actions** tab shows the site being rebuilt. If it turns red, the build log says which file has a problem.
- Keep the tables on the section pages up to date, and move pages into course subfolders when a section grows.
