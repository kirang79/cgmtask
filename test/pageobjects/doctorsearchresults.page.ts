import {$} from '@wdio/globals';

class DoctorResultsGrid{
    get resultsPanel(){
        return $('app-search-results-container');
    }
    
    get findButton()
    {
        return this.resultsPanel.$('button[data-web-test="lp-search-button"]');
    }
    async getBookAppointmentButton(index:number)
    {
        //book-appointment-button
        const doctorCard=await this.cardAtIndex(0);
        return await (await doctorCard.$('button.book-appointment-button')).$('cd-abstract-button');
    }
    async openDoctorDetailsPage(index:number){
        const doctorCard=await this.cardAtIndex(0);
        const doctorDetailsLink=await doctorCard.$('a');
        await doctorDetailsLink.click();
    }
    async cardAtIndex(index:number){
        return await $(`#card-${index}`);
    }
    async getDoctorDetailsByIndex(index:number):Promise<DoctorDetails>{
        const cardAtIndex=await $(`#card-${index}`);
        const doctorNamePlaceholder=await cardAtIndex.$('cd-list-entry-headline');
        const addressDetails=await cardAtIndex.$('cd-list-entry-text');
        const address=await (await addressDetails.$('div')).getText();
        const availableSlotHolder=await cardAtIndex.$('.available-slots__time');
        const name=await doctorNamePlaceholder.getText();
        const availableSlot=await availableSlotHolder.getText();
        let doctorDetails=new DoctorDetails(name,availableSlot,address);
        return doctorDetails;
    }

    async bookDoctor(index:number){
        const btnBookAppointment=await this.getBookAppointmentButton(index);
        await btnBookAppointment.click();
    }
    
}

class DoctorDetails{
     name: string;
     dateAvailable:string;
     address:string;
     constructor(name:string,availableSlot:string,address:string){
        this.name=name;
        this.dateAvailable=availableSlot;
        this.address=address;
     }
}


export const doctorResultsGrid = new DoctorResultsGrid();