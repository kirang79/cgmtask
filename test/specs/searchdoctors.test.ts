//import { expect } from '@wdio/globals'
import { homePage } from "../pageobjects/home.page.js";
import { domHelper } from "../domhelpers.js";
import { doctorResultsGrid } from "../pageobjects/doctorsearchresults.page.js";
//import { doctorAppointmentDetails } from "../pageobjects/doctorAppointmentbooking.page.js";
import { doctorDetailsPage } from "../pageobjects/doctordetails.page.js";
import { customerToTest, searchResultPageStyle } from "../config/data.config.js";
//const {getByRole} = setupBrowser(browser)

describe('Should be able to search, view details, and book a doctor',()=>{
    describe('Search for doctor',()=>{
        before(async ()=>{
            await homePage.open();
            await domHelper.waitForVisiblility(homePage.cookiesHeader,60000);
            await (await homePage.acceptCookiesButton).click();
        })
        it('should be able to serch for a doctor with name, address and validate name, address and nearest available month', async ()=>{
            await (await homePage.searchTextBox).setValue(customerToTest.name);
            await (await homePage.locationTextBox).setValue(customerToTest.address);
            await (await homePage.searchButton).click();
            await domHelper.waitForVisiblility(doctorResultsGrid.resultsPanel,60000);
            let doctorDetails=await doctorResultsGrid.getDoctorDetailsByIndex(0);
            expect(doctorDetails.name).toBe(customerToTest.name)
            expect(doctorDetails.dateAvailable).toContain(customerToTest.nearestMonthAvailable);
            expect(doctorDetails.address).toContain(customerToTest.address);
        });
        it('should match search results style', async ()=>{
            const findButton=await doctorResultsGrid.findButton;
            let bgColor=await findButton.getCSSProperty('background-color');
            const bookAppointmentButton=await doctorResultsGrid.getBookAppointmentButton(0);
            let appointmentBGColor=await bookAppointmentButton.getCSSProperty('background-color');
            expect(bgColor.parsed.hex).toBe(searchResultPageStyle.findButtonBackgroundColor);
            expect(appointmentBGColor.parsed.hex).toBe(searchResultPageStyle.bookAppointmentBackgroundColor);
        });
    });
    describe('Should be able to view Doctor Details',()=>{
        before(async ()=>{
            await doctorResultsGrid.openDoctorDetailsPage(0);
        });
        it('Should match name of the doctor',async ()=>{
            await domHelper.waitForVisiblility(doctorDetailsPage.appProfileHeader);
            let doctorName=await doctorDetailsPage.getDoctorName();
            expect(doctorName).toBe(customerToTest.name);
        });
        it('Should match address of the doctor',async ()=>{
            let addressDetails=await doctorDetailsPage.getAddress();
            expect(addressDetails).toContain(customerToTest.address);
        });
        it('Should match operating hours of the doctor',async ()=>{
            let operatingHours=await doctorDetailsPage.getOperatingHoursForDay(0);
            console.log(operatingHours);
            expect(operatingHours.morningStartTime).toBe(customerToTest.operatinghours.morningopeningHrs);
            expect(operatingHours.afternoonStartTime).toBe(customerToTest.operatinghours.afterNoonOpeningHours);
            expect(operatingHours.afternoonEndTime).toBe(customerToTest.operatinghours.afterNoonClosingHours);
        });
        // it('Nearest booking date in bold', async ()=>{
        //     let nearestOpeningHoursPanel=await doctorDetailsPage.getNearestBookDatePanel();
        //     const fontWeight = (await nearestOpeningHoursPanel.getCSSProperty('font-weight')).value;
        //     console.log(fontWeight);
        //     expect(fontWeight === 'bold').toBe(true);
        // })
    });
    // describe('Booking Page test', ()=>{
    //     before(async ()=>{
    //         await doctorResultsGrid.bookDoctor(0);
    //     });
    //     it('validate booking page details',async ()=>{
            
    //         await browser.waitUntil(async () =>{
    //             const parentElement=await (await doctorAppointmentDetails.doctorDetails).parentElement();
    //             return parentElement.getAttribute('class').then((classes)=>{
    //                 return classes.includes('data-loaded');
    //             });
    //         },{timeout:5000,timeoutMsg:'Expected class not applied on parent element'});
    //         let doctorName=await doctorAppointmentDetails.getDoctorName();
    //         expect(doctorName).toBe('Peter Wunderlich');

    //         let availableSlot=await doctorAppointmentDetails.getAvailableSlots('Montag');
    //         let firstSlot=availableSlot[0];
    //         expect(firstSlot).toBe('08:00');
    //         let lastSlot=availableSlot[availableSlot.length-1];
    //         expect(lastSlot).toBe('17:50');
    //         let afterNoonSlot=null;
    //         for(let timeSlot in availableSlot){
    //             console.log(timeSlot);
    //             console.log(availableSlot[timeSlot]);
    //             const [hours,minutes]=availableSlot[timeSlot].split(":").map(Number);
    //             const diff=hours-12;
               
    //             if(diff>=0){
    //                 afterNoonSlot=availableSlot[timeSlot];
    //                 break;
    //             }
    //         }
    //         expect(afterNoonSlot).toBe('14:00');
            
    //     //let currentDayName=doctorDetails.getCurrentDay();
    //     //let currentAvailableSlots=await doctorDetails.getAvailableSlots(currentDayName);
    //     //let currentFirstSlot=currentAvailableSlots[0];
    //     //expect(currentFirstSlot).toBeUndefined();
    //     //console.log(currentAvailableSlots);

    //     });

        
    //});
    
})