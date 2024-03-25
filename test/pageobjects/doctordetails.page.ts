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
    isWorkingDay():boolean{
        //let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
       // let dayName=['Sonntag','Mon','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];
        let currentDay = new Date().getDay();
        //0 is for sunday, 6 for saturday
        return currentDay >0 && currentDay < 6;
        
    }
    get appWorkingHoursPanel(){
        return $('app-working-hours')
    }
    async getCurrentDayNamePanel(dayNum:number){
        if(!dayNum){
            dayNum=this.getCurrentPos();
        }
        let weekDayNamePanel=await this.appWorkingHoursPanel;
        let dayNamePanels=await weekDayNamePanel.$$('div.text-day__item--text');
        let currentDayNamePanel=dayNamePanels[dayNum];
        return currentDayNamePanel;
    }
    async getNearestBookDatePanel(){
        return await (await $('app-booking-assistant-trigger')).$('span.date');
    }
    async getOperatingHoursForDay(index:number):Promise<OperatingHours>{
        let workHoursPanel=await $('app-working-hours');
        let weekHourDetails=await workHoursPanel.$$('div.text-day-hours-container__items');
        
        let currentWorkingDayIndex=index;
        //Valid range is 5 days only from Mon to Fri
        if(currentWorkingDayIndex<0 || currentWorkingDayIndex>5)
        {
            //Use getdate it will get working day index and translates into into Mon to Fri
            currentWorkingDayIndex=this.getCurrentPos();
        }
       
        let currentDayWorkingDetails=weekHourDetails[currentWorkingDayIndex];
        let firstHourDiv=await currentDayWorkingDetails.$('div.first');

        
        let firstHourTimeDiv=await firstHourDiv.$('div.text-day-hour__text-startTime');
        let firstHourEndTimeDiv=await firstHourDiv.$('div.text-day-hour__text-endTime');
        
        let morningOpeningTime=await firstHourTimeDiv.getText();
        let morningEndTime=await firstHourEndTimeDiv.getText();
        
        let afternoonOpeningTime="-";
        let afternoonEndTime="-";
        if(await (await firstHourDiv.nextElement()).isExisting())
        {
            let afternoonDiv=await firstHourDiv.nextElement();
            let afterNoonStartTimeDiv=await afternoonDiv.$('div.text-day-hour__text-startTime');
            let afterNoonEndTime=await afternoonDiv.$('div.text-day-hour__text-endTime');
            afternoonOpeningTime=await afterNoonStartTimeDiv.getText();
            afternoonEndTime=await afterNoonEndTime.getText();
        }
        

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