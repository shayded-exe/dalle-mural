# requirements

### mural

- save/load murals
- toggleable grid
- toggleable grid snapping
- set overlap %
- dynamically expand canvas
- brush and rect erasing
- undo/redo

### generate

- generate images from a prompt
- place generated image anywhere on the canvas
  - show overlay of selected generation under cursor on canvas
- confirm before overwriting an existing image
- zoom images on hover
- show history of all generations for the current mural
  - history is a vertical list with one result set per row
  - can expand to show more history

### inpaint

- select anywhere on grid to inpaint
- show history of generations for the current selection

### erase

- brush panel
  - rect/circle shape selector
  - size slider

fit some error handling in there somewhere at some point

## flows

### generate

1. click generate
2. generate panel appears
3. type prompt and submit
4. select result & placement location in either order
5. confirm placement

### inpaint

1. click inpaint
2. select area to inpaint
3. inpaint panel appears
4. type prompt and submit
5. select result
6. confirm placement

### erase

1. click erase
2. show brush panel
3. click to erase
