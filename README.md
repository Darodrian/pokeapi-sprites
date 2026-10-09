# pokeapi-sprites

Sprite assets for [pokeapi-commands](https://github.com/Darodrian/pokeapi-commands),
served over GitHub Pages at <https://darodrian.github.io/pokeapi-sprites/>.

## Layout

- `sprites/NNNN/` — normal base-form sprite for a dex number (e.g. `sprites/0025/Idle-Anim.png`)
- `sprites/shiny/NNNN/` — shiny base-form sprite

Each folder contains `AnimData.xml` and one `*-Anim.png` per animation. Only the
animations used by the overlay are included (no offsets, shadows, or forms).

Generated from [PMDCollab — SpriteCollab](https://github.com/PMDCollab/SpriteCollab).
Sprite credits belong to the original artists; see the SpriteCollab repository.
