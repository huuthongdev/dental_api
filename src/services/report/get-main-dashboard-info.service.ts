import { CalendarDentist } from "../../../src/refs";

export class GetMainDashboardInfoService {
    static async get(branchId: string) {
        // Get ticket today, get ticket not have calendar (This branch)
        const calendarsToday = await this.getCalendarsToday(branchId);
        return {
            calendarsToday
        }
    }

    static async getCalendarsToday(branchId: string) {
        // Get all calendar of all dentist in this branch
        const calendarsAll = await CalendarDentist.find({ branch: branchId })
            .sort({ startTime: 1 })
            .populate({
                path: 'ticket',
                select: 'client status',
                populate: {
                    path: 'client',
                    select: 'sid name'
                }
            })
            .populate('dentist', 'name') as CalendarDentist[];
        // Filter ticket
        const now = new Date().toLocaleDateString('en-GB');
        const calendarsToday = calendarsAll.filter(v => new Date(v.startTime).toLocaleDateString('en-GB') === now);
        return calendarsToday;
    }
}