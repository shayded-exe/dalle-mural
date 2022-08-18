import { models } from '../store';
import { Rect } from '../utils';
import { MuralCanvas } from './MuralCanvas';

export const Mural = _Mural;

function _Mural({
  mural,
  previewGeneration,
  onSelect,
  ...passthrough
}: {
  mural: models.Mural;
  previewGeneration: models.Generation | null;
  onSelect?: (rect: Rect) => void;
}) {
  return (
    <MuralCanvas
      mural={mural}
      previewGeneration={previewGeneration}
    ></MuralCanvas>
  );
}
