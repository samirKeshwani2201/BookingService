
// const { axios } = require("axios");
const axios = require('axios');
const { BookingRepository } = require("../repository/index");
const { FLIGHT_SERVICE_PATH } = require("../config/serverConfig");
const { ServiceError } = require("../utils/errors/index");
class BookingService {
    constructor() {
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(data) {
        try {
            const flightId = data.flightId;
            let getFlightURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const response = await axios.get(getFlightURL);
            // flight.data becaouse we only want the data and not the axios parameters again do data if dont want to ge 2 succes and all that repeated like this we will get with one data and append .data to get only one time  {
            //     "message": "Successfully completed booking",
            //     "success": true,
            //     "err": {},
            //     "data": {
            //         "data": {
            //             "id": 2,
            //             "flightNumber": "UK 820",
            //             "airplaneId": 4,
            //             "departureAirportId": 1,
            //             "arrivalAirportId": 4,
            //             "arrivalTime": "2023-06-29T11:00:00.000Z",
            //             "departureTime": "2023-06-29T08:00:00.000Z",
            //             "price": 4500,
            //             "boardingGate": null,
            //             "totalSeats": 440,
            //             "createdAt": "2023-10-25T20:54:59.000Z",
            //             "updatedAt": "2023-10-25T20:54:59.000Z"
            //         },
            //         "success": true,
            //         "err": {},
            //         "message": "Successfully fetched the flight"
            //     }}
            const flighData = response.data.data;
            const noOfSeats = data.noOfSeats;
            const priceOfFlight = flighData.price;
            if (noOfSeats > flighData.totalSeats) {
                throw new ServiceError(
                    "Something went wrong in booking process",
                    "Insufficient seats in the flight"
                );
            }
            const totalCost = priceOfFlight * noOfSeats;
            const bookingPayload = { ...data, totalCost };
            const booking = await this.bookingRepository.create(bookingPayload);
            const updateFlightUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
            await axios.patch(updateFlightUrl, {
                totalSeats: flighData.totalSeats - booking.noOfSeats
            });

            // update the In Process now:
            const finalBooking = await this.bookingRepository.update(
                booking.id, {
                status: "Booked"
            });
            return finalBooking;
        } catch (error) {
            if (error.name === "RepositoryError" || error.name === "ValiadationError") {
                throw error;
            }
            throw new ServiceError();
        }
    }
}

module.exports = BookingService;