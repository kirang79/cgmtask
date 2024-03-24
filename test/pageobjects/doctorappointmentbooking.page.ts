import {$} from '@wdio/globals';

class DoctorAppointmentBookingPage{
    get doctorDetails(){
        return $('lib-physician-info');
    }

    async getDoctorName(){
        let nameElement=await (await this.doctorDetails).$('div P.overview-name');
        return await nameElement.getText();
    }

    async prepareAvailableSlots(){
        const libWeekView=await $('lib-calendar-week-view');
        const dayNamesElements=await libWeekView.$('div.week-day');
        const dateNameElements=await (await libWeekView.$('div.day-container')).$('div.day');
        let dayName=this.getCurrentDay();
    }

    getCurrentDay():string{
        //let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let dayName=['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];
        let currentDay = new Date().getDay();
        return dayName[currentDay];
    }
    get weeksContainer(){
        return $('.weeks-container');
    }
    async getAvailableSlots(dayName:string){
        const weeksContainer=await this.weeksContainer;
        var weekDayNames=weeksContainer.$$('.week-day');
        const weekDaysTexts=await Promise.all(await weekDayNames.map(async (weekDay)=>{
            let d=await weekDay.$('div');
            let txt= await d.getText();
            return txt;
        }));
        let currentDayPosition=weekDaysTexts.indexOf(dayName);
        const timeSlotContainer=await $('lib-calendar-bookable-time-slots');
        const allDaySlots=await timeSlotContainer.$$('div.day');
        const nameMatchingDaySlots=allDaySlots[currentDayPosition];
        const availableSlots=nameMatchingDaySlots.$$('div.proposal-slot');
        const availableTimeSlots=await Promise.all(await availableSlots.map(async (slotdiv)=>{
            let d=await slotdiv.$('div');
            let txt=await d.getText();
            return txt;
        }));
        return availableTimeSlots;
    }
}


class AvailableDay{
    date:string;
    availableSlots:string[]
    constructor(date:string,availableSlots:string[]){
        this.date=date;
        this.availableSlots=availableSlots;
    }
}

export const doctorAppointmentDetails=new DoctorAppointmentBookingPage();