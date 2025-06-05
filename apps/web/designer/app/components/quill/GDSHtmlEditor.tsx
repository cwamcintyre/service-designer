// NOTE: This class cannot be rendered server-side because Quill tries to access document during its initialization.
// You need to use React lazy to load this, i.e.
// const GDSHtmlEditor = lazy(() => import("@/components/quill/GDSHtmlEditor"));

import 'react-quill-new/dist/quill.snow.css';
import ReactQuill, { Quill } from 'react-quill-new';
import { Delta } from 'quill';
import CustomToolbar from './GDSToolbar';
import { ScrollBlot } from 'parchment';

import QuillGDSBlockBlot from '@/components/quill/QuillGDSBlock';
import QuillGDSLink from '@/components/quill/QuillGDSLink';
import QuillGDSHeaderOne from '@/components/quill/QuillGDSHeaderOne';
import QuillGDSHeaderTwo from '@/components/quill/QuillGDSHeaderTwo';
import QuillGDSHeaderThree from '@/components/quill/QuillGDSHeaderThree';
import QuillGDSUnorderedList from '@/components/quill/QuillGDSUnorderedList';
import QuillGDSOrderedList from '@/components/quill/QuillGDSOrderedList';

Quill.register({
    'blots/block': QuillGDSBlockBlot,
    'formats/link': QuillGDSLink,
    'formats/headerone': QuillGDSHeaderOne,
    'formats/headertwo': QuillGDSHeaderTwo,
    'formats/headerthree': QuillGDSHeaderThree,
    'formats/bullet': QuillGDSUnorderedList,
    'formats/ordered': QuillGDSOrderedList
}, true);

function insertHeaderOne(this: { quill: Quill }) {
    this.quill.format('headerone', 'headerone');
}

function insertHeaderTwo(this: { quill: Quill }) { 
    this.quill.format('headertwo', 'headertwo');
}

function insertHeaderThree(this: { quill: Quill }) {
    this.quill.format('headerthree', 'headerthree');
} 

function insertOrdered(this: { quill: Quill }) {
    this.quill.format('ordered', 'ordered');
}

function insertBullet(this: { quill: Quill }) {
    this.quill.format('bullet', 'bullet');
}

function applyFormat(
  delta: Delta,
  format: string,
  value: unknown,
  scroll: ScrollBlot,
): Delta {
  if (!scroll.query(format)) {
    return delta;
  }

  return delta.reduce((newDelta, op) => {
    if (op.attributes && op.attributes[format]) {
      return newDelta.push(op);
    }
    const formats = value ? { [format]: value } : {};
    return newDelta.insert(op.insert ? op.insert : "", { ...formats, ...op.attributes });
  }, new Delta());
}

function matchList(node: Node, delta: Delta, scroll: ScrollBlot) {
  // @ts-expect-error
  const list = node.tagName === 'OL' ? 'ordered' : 'bullet';
  return applyFormat(delta, list, list, scroll);
}

export default function HtmlContentEditor({ html = "", onChange } : { html?: string, onChange: (html: string) => void }) {

    const modules = {
        toolbar: {
            container: "#toolbar",
            handlers: {
                GdsNumbers: insertOrdered,
                GdsBullets: insertBullet,
                GdsHeaderOne: insertHeaderOne,
                GdsHeaderTwo: insertHeaderTwo,
                GdsHeaderThree: insertHeaderThree
            }
        },
        keyboard: {
            bindings: {
                shiftEnterOnList: {
                    key: 'Enter',
                    shiftKey: true,
                    format: ['ordered', 'bullet'],
                    handler(this: { quill: Quill }, range: any, context: KeyboardEvent) {
                        this.quill.insertText(range.index + 1, '\n', Quill.sources.USER);    
                        this.quill.setSelection(range.index + 1, Quill.sources.SILENT); 
                    }
                  }
                // },
                // tab: {
                //     key: 'Tab',
                //     shiftKey: true,
                //     handler(this: { quill: Quill }, range: any, context: KeyboardEvent) {                        
                //         return true; // Allow default tab behavior for other formats
                //     }
                // }
            }
        },
        clipboard: {
            matchers: [
                ["ol, ul", matchList]
            ]
        }
    }  

    const formats = [
      'bold','italic','underline','strike',
      'link',
      'headerone', 'headertwo', 'headerthree',
      'bullet','ordered'
    ]
    
    return (
      <>
        <CustomToolbar />
        <ReactQuill
          className={"govuk-body"}
          value={html}
          onChange={onChange}
          modules={modules}
          formats={formats}
        />
      </>
    );
}