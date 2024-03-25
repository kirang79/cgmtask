import { browser } from '@wdio/globals'

export default class BasePage {
    /**
   class   * open
path:string     */
    public navigate(path: string) {
        browser.url(`https://demo.clickdoc.de/${path}`)
    }
}
