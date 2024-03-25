import {$} from '@wdio/globals'
import { LaunchUrl } from '../config/data.config.js';
//import BasePage from './clickdoc.basepage';


class HomePage {
    public get cookiesHeader(){
        return $('cd-modal-wrapper [id*="dialog"]');
    }
    public get acceptCookiesButton(){
        return $('.agree-consent--all');
    }
    
    public get searchTextBox(){
        return $('input[data-web-test="lp-search-input"]');
    }
    public get searchResultPanel(){
        return $('.search-step-list');
    }
    public get searchButton(){
        return $('button[data-web-test="lp-search-button"]');
    }
    public get locationTextBox(){
        return $('input[data-web-test="lp-location-input"]');
    }
    public async open():Promise<void>{
        browser.url(LaunchUrl);
    }
}

export const homePage= new HomePage();