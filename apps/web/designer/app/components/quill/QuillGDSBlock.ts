import { Quill } from 'react-quill-new';
import { BlockBlot } from 'parchment';

let Block = Quill.import('blots/block') as typeof BlockBlot;
class GDSBlockBlot extends Block {}
GDSBlockBlot.blotName = 'block';
GDSBlockBlot.tagName = 'p';
GDSBlockBlot.className = 'govuk-body';

export default GDSBlockBlot;