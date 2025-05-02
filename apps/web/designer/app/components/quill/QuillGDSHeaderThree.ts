import Block from 'quill/blots/block';

class Header extends Block {
  static blotName = 'headerthree';
  static tagName = ['H3'];
  static className = 'govuk-heading-s';
}

export default Header;