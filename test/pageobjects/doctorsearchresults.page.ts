import { $ } from '@wdio/globals';

class DoctorResultsGrid {
    get resultsPanel() {
        return $('app-search-results-container');
    }

    get findButton() {
        return this.resultsPanel.$('button[data-web-test="lp-search-button"]');
    }
    async getBookAppointmentButtonByCard(doctorCard: any) {
        return await (await doctorCard.$('button.book-appointment-button')).$('cd-abstract-button');
    }
    async openDoctorDetailsPageByCard(doctorCard:any) {
        const doctorDetailsLink = await doctorCard.$('a');
        await doctorDetailsLink.click();
    }
    async cardAtIndex(index: number) {
        return await $(`#card-${index}`);
    }
    async doctorResultCardsByDoctorName(doctorName: string) {
        let resultsDiv = await $('div.search-results-container');
        const allDoctorResultsGrid = await resultsDiv.$$('app-search-result-card');
        console.log(allDoctorResultsGrid.count);
        let doctorResultMatchingName = await allDoctorResultsGrid.map(element => this.getDoctorResultCard(element, doctorName));
        let matchingResultCards = await Promise.all(doctorResultMatchingName);
        return matchingResultCards;
    }
    async getDoctorResultCard(doctorResultCard: any, doctorName: string) {
        const cardHeadLineElement = await doctorResultCard.$('cd-list-entry-headline');
        if (await cardHeadLineElement.$('div').getText() == doctorName) {
            return doctorResultCard;
        }

    }
    async getDoctorDetailsByIndex(index: number): Promise<DoctorDetails> {
        const cardAtIndex = await $(`#card-${index}`);
        const doctorNamePlaceholder = await cardAtIndex.$('cd-list-entry-headline');
        const addressDetails = await cardAtIndex.$('cd-list-entry-text');
        const address = await (await addressDetails.$('div')).getText();
        const availableSlotHolder = await cardAtIndex.$('.available-slots__time');
        const name = await doctorNamePlaceholder.getText();
        const availableSlot = await availableSlotHolder.getText();
        let doctorDetails = new DoctorDetails(name, availableSlot, address);
        return doctorDetails;
    }
    async getDoctorDetailsFromCard(cardElement: any): Promise<DoctorDetails> {
        const doctorNamePlaceholder = await cardElement.$('cd-list-entry-headline');
        const addressDetails = await cardElement.$('cd-list-entry-text');
        const address = await (await addressDetails.$('div')).getText();
        const availableSlotHolder = await cardElement.$('.available-slots__time');
        const name = await doctorNamePlaceholder.getText();
        const availableSlot = await availableSlotHolder.getText();
        let doctorDetails = new DoctorDetails(name, availableSlot, address);
        return doctorDetails;
    }

}

class DoctorDetails {
    name: string;
    dateAvailable: string;
    address: string;
    constructor(name: string, availableSlot: string, address: string) {
        this.name = name;
        this.dateAvailable = availableSlot;
        this.address = address;
    }
}


export const doctorResultsGrid = new DoctorResultsGrid();