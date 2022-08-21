# requirements

### general

- view token count
- keyboard shortcuts
  - fully usable via shortcuts
  - toggle to show shortcut keys in ui

### generations

- zoom images on hover
- can expand to show more history
- can filter by current mural, all murals, and hearted generations
- generations can be hearted just like in dall-e
- link to open in dall-e

### mural canvas

- save/load murals
- toggleable grid
- toggleable grid snapping
- set overlap %
- dynamically expand canvas
- brush and rect erasing
- undo/redo

### place mode

- generate or inpaint from a prompt
- place generated image anywhere on the canvas
  - show overlay of selected generation under cursor on canvas
- confirm before placing

### erase mode

- brush panel
  - rect/circle shape selector
  - size slider

fit some error handling in there somewhere at some point

## flows

### login

1. if auth token isn't set, show login page
2. set token and submit
3. can logout from settings menu

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
