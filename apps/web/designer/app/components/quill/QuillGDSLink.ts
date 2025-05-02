import { Quill } from 'react-quill-new';
import Link from 'quill/formats/link';

let LinkFormat = Quill.import('formats/link') as typeof Link;
class GDSLink extends LinkFormat {}
GDSLink.className = 'govuk-link';

export default GDSLink;