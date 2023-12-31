const { StatusCodes } = require("http-status-codes");
const { Booking } = require("../models/index");
const { ValidationError, AppError } = require("../utils/errors/index");

class BookingRepository {
    async create(data) {
        try {
            const booking = await Booking.create(data);
            return booking;
        } catch (error) {
            if (error.name === "ValidationError") {
                throw new ValidationError(error);
            }
            throw new AppError(
                "RepositoryError",
                "Cannot Create Booking",
                "There was some issue creating the booking,please try again later",
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    async update(bookingId, data) {
        try {
            // const response = await Booking.update(data, {
            //     where: {
            //         id: bookingId
            //     }
            // });
            const booking = await Booking.findByPk(bookingId);
            if (booking.status) {
                booking.status = data.status;
            }
            await booking.save();
            return booking;
        } catch (error) {
            if (error.name === "ValidationError") {
                throw new ValidationError(error);
            }
            throw new AppError(
                "RepositoryError",
                "Cannot Create Booking",
                "There was some issue creating the booking,please try again later",
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }


}

module.exports = BookingRepository;