import {$} from '@wdio/globals';

class DoctorDetailsPage{

    get appProfileHeader(){
        return $('app-profile-header');
    }
    get appAddressLink(){
        return $('app-address-link-text');
    }
    async getDoctorName(){
        let profileHeader=await this.appProfileHeader;
        let doctorNamePlaceHolder=await profileHeader.$('h1');
        return await doctorNamePlaceHolder.getText();
    }

    async getAddress(){
        let addresshLinkContainer=await this.appAddressLink;
        let addressElement=await addresshLinkContainer.$('p[data-automation="Address - Postal city code"]');
        return await addressElement.getText();
    } 
    getCurrentPos():number{
        //let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
       // let dayName=['Sonntag','Mon','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];
        let currentDay = new Date().getDay();
        //if sunday or monday from UI has to pick monday, if saturday has to pick monday 
        //in UI we will be display mon to fri except for sun & sat other day we need to reduce by 1 day to match with index position
        if(currentDay>0 && currentDay<6)--currentDay;
        if(currentDay==6)currentDay=0;
        return currentDay;
    }
    async getNearestBookDatePanel(){
        return await (await $('app-booking-assistant-trigger')).$('span.date');
    }
    async getOperatingHoursForDay(index:number):Promise<OperatingHours>{
        let workHoursPanel=await $('app-working-hours');
        let weekHourDetails=await workHoursPanel.$$('div.text-day-hours-container__items');
        let currentWorkingDayIndex=this.getCurrentPos();
       
        let currentDayWorkingDetails=weekHourDetails[currentWorkingDayIndex];
        let firstHourDiv=await currentDayWorkingDetails.$('div.first');
        let afternoonDiv=await firstHourDiv.nextElement();
        let firstHourTimeDiv=await firstHourDiv.$('div.text-day-hour__text-startTime');
        let firstHourEndTimeDiv=await firstHourDiv.$('div.text-day-hour__text-endTime');
        let afterNoonStartTimeDiv=await afternoonDiv.$('div.text-day-hour__text-startTime');
        let afterNoonEndTime=await afternoonDiv.$('div.text-day-hour__text-endTime');
        let morningOpeningTime=await firstHourTimeDiv.getText();
        let morningEndTime=await firstHourEndTimeDiv.getText();
        let afternoonOpeningTime=await afterNoonStartTimeDiv.getText();
        let afternoonEndTime=await afterNoonEndTime.getText();
        let operatingHours=new OperatingHours(morningOpeningTime,morningEndTime,afternoonOpeningTime,afternoonEndTime);
        return operatingHours;
    }
}

class OperatingHours{
    morningStartTime:string;
    morningEndTime:string;
    afternoonStartTime:string;
    afternoonEndTime:string;
    constructor(morningStartTime:string,morningEndTime:string,afternoonStartTime:string,afterNoonEndTime:string){
        this.morningStartTime=morningStartTime;
        this.morningEndTime=morningEndTime;
        this.afternoonEndTime=afterNoonEndTime;
        this.afternoonStartTime=afternoonStartTime;
    }

}

export const doctorDetailsPage=new DoctorDetailsPage();