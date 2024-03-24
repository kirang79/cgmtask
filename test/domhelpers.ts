class DomHelpers{
    async waitForVisiblility(elementSelector:any,timeout=4000){
        await elementSelector.waitForDisplayed({timeout});
    }
    async waitForExists(elementSelector:any,timeout=4000){
        await elementSelector.waitForExists({timeout});
    }
}

export const domHelper=new DomHelpers();