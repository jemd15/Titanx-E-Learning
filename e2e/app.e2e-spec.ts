import { TitanxECommercePage } from './app.po';

describe('titanx-ecommerce App', function() {
  let page: TitanxECommercePage;

  beforeEach(() => {
    page = new TitanxECommercePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
