import { CalendarDentist, mustBeObjectId } from "../../refs";

export class GetCalendarDentist {
    static async get(dentistId: string) {
        mustBeObjectId(dentistId);
        const result = await CalendarDentist.find({ dentist: dentistId })
            .populate({
                path: 'ticket',
                select: 'client status',
                populate: {
                    path: 'client',
                    select: 'sid name'
                }
            })
        return { dentistId, calendar: result };
    }
}