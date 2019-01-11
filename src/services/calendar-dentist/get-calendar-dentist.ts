import { CalendarDentist, mustBeObjectId } from "../../../src/refs";

export class GetCalendarDentist {
    static async get(dentistId: string) {
        mustBeObjectId(dentistId);
        const result = await CalendarDentist.find({ dentist: dentistId })
            .populate({
                path: 'ticket',
                populate: {
                    path: 'ticket.client'
                }

            });
        return result;
    }
}