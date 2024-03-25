import { homePage } from "../pageobjects/home.page.js";
import { domHelper } from "../domhelpers.js";
import { doctorResultsGrid } from "../pageobjects/doctorsearchresults.page.js";
import { doctorDetailsPage } from "../pageobjects/doctordetails.page.js";
import { customerToTest, searchResultPageStyle } from "../config/data.config.js";

describe('Should be able to search, view details, and book a doctor', () => {
    before(async () => {
        await homePage.open();
        await domHelper.waitForVisiblility(homePage.cookiesHeader, 60000);
        await (await homePage.acceptCookiesButton).click();
        await (await homePage.searchTextBox).setValue(customerToTest.name);
        await (await homePage.locationTextBox).setValue(customerToTest.address);
        await (await homePage.searchButton).click();
        await domHelper.waitForVisiblility(doctorResultsGrid.resultsPanel, 60000);
    });
    describe('Search for doctor', () => { 
        it('should be able to serch for a doctor with name, address and validate name, address and nearest available month', async () => {
            
            let doctorDetails = await doctorResultsGrid.getDoctorDetailsByIndex(0);
            expect(doctorDetails.name).toBe(customerToTest.name)
            expect(doctorDetails.dateAvailable).toContain(customerToTest.nearestMonthAvailable);
            expect(doctorDetails.address).toContain(customerToTest.address);
        });
        it('should match search results style', async () => {
            const findButton = await doctorResultsGrid.findButton;
            let bgColor = await findButton.getCSSProperty('background-color');
            const bookAppointmentButton = await doctorResultsGrid.getBookAppointmentButton(0);
            let appointmentBGColor = await bookAppointmentButton.getCSSProperty('background-color');
            expect(bgColor.parsed.hex).toBe(searchResultPageStyle.findButtonBackgroundColor);
            expect(appointmentBGColor.parsed.hex).toBe(searchResultPageStyle.bookAppointmentBackgroundColor);
        });
    });
    describe('Should be able to view Doctor Details', () => {
        before(async () => {
            await doctorResultsGrid.openDoctorDetailsPage(0);
        });
        it('Should match name of the doctor', async () => {
            await domHelper.waitForVisiblility(doctorDetailsPage.appProfileHeader);
            let doctorName = await doctorDetailsPage.getDoctorName();
            expect(doctorName).toBe(customerToTest.name);
        });
        it('Should match address of the doctor', async () => {
            let addressDetails = await doctorDetailsPage.getAddress();
            expect(addressDetails).toContain(customerToTest.address);
        });
        it('Should match operating hours of the doctor', async () => {
            let currentDay = new Date().getDay();
            //currentDay=2; //2 is for Wed of index range [Mon - Fri]
            let operatingHours = await doctorDetailsPage.getOperatingHoursForDay(currentDay);
            let expectedOperatingHours = customerToTest.operatinghours[currentDay];
            expect(operatingHours.morningStartTime).toBe(expectedOperatingHours.morningopeningHrs);
            expect(operatingHours.morningEndTime).toBe(expectedOperatingHours.morningClosingHrs);
            expect(operatingHours.afternoonStartTime).toBe(expectedOperatingHours.afterNoonOpeningHours);
            expect(operatingHours.afternoonEndTime).toBe(expectedOperatingHours.afterNoonClosingHours);
        });
        it('Current day name should be in bold', async () => {
            let currentDay = new Date().getDay();
            let currentDayNum = doctorDetailsPage.getCurrentPosRelativeToWorkingDays(currentDay);
            let dayNamePanel = await doctorDetailsPage.getCurrentDayNamePanel(currentDayNum);
            let isWorkingDay = doctorDetailsPage.isWorkingDay(currentDay);
            if (isWorkingDay) {
                const fontWeight = (await dayNamePanel.getCSSProperty('font-weight')).value;
                expect(fontWeight && (fontWeight === 'bold' || parseInt(fontWeight) >= 700)).toBe(true);
            }

        });
    });
})