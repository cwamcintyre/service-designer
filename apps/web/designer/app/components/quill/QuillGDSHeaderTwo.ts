import Block from 'quill/blots/block';

class Header extends Block {
  static blotName = 'headertwo';
  static tagName = ['H2'];
  static className = 'govuk-heading-m';
}

export default Header;