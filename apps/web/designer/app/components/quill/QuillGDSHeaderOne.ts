import Block from 'quill/blots/block';

class Header extends Block {
  static blotName = 'headerone';
  static tagName = ['H1'];
  static className = 'govuk-heading-l';
}

export default Header;