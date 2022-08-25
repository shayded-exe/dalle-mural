# requirements

### general

- [ ] view token count
- [ ] keyboard shortcuts
  - [ ] fully usable via shortcuts
  - [ ] toggle to show shortcut keys in ui
- [ ] track credits used per mural

### generations

- [ ] zoom images on hover
- [ ] can expand to show more history
- [ ] can filter by current mural, all murals, and hearted generations
- [ ] generations can be hearted just like in dall-e
- [ ] link to open in dall-e

### mural canvas

- [x] create murals
- [x] save/load murals
- [x] download
- [x] undo/redo
- [ ] toggleable grid
- [ ] toggleable grid snapping
- [ ] set overlap %
- [ ] dynamically expand canvas
- place mode
  - [x] generate or inpaint from a prompt
  - [ ] upload image
  - [x] place generated image anywhere on the canvas
    - [x] show overlay of selected generation under cursor on canvas
  - [x] confirm before placing
- erase mode
  - [x] brush panel
  - [x] rect/circle shape selector
  - [x] size slider

### outpaint mode

- [ ] scale down mural and outpaint

fit some error handling in there somewhere at some point

## flows

### login

1. if auth token isn't set, show login page
2. set token and submit
3. can logout from settings menu

### generate/inpaint

1. open generate panel
2. optionally enable inpaint switch and select an inpainting area
3. type prompt and submit
4. select result & placement location
5. confirm placement

### erase

1. click erase
2. show brush panel
3. click to erase
